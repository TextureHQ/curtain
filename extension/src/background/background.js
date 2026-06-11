/**
 * Curtain - Background Service Worker
 * Manages extension state, badge updates, and content script communication.
 */

const DEFAULT_ALLOWED_DOMAINS = [
  '*.texturehq.com',
  'localhost',
  'local.texturehq.com',
];

const DEFAULT_SETTINGS = {
  enabled: true,
  seed: generateSeed(),
  demoOrganization: null,
  /**
   * User-configurable list of domain patterns Curtain should mask on.
   * Glob-style host patterns (`*.example.com`, `localhost`, `app.acme.com`).
   * file:// is always supported regardless of this list.
   *
   * NOTE: extension `host_permissions` are still bounded by manifest.json.
   * Adding a domain here will only take effect for sites the browser has
   * granted the extension access to. We surface this limitation in the
   * popup UI (M1.3) and document it in the README.
   */
  allowedDomains: DEFAULT_ALLOWED_DOMAINS,
  /**
   * Optional per-bucket demographic weight overrides (ALL-1656). Plumbed
   * through settings so they survive round-trips and stay user-editable
   * via storage, but Phase 1 does NOT consume them in content.js — the
   * masking path still uses the static preset baked into data.js. Runtime
   * consumption + popup UI land in Phase 2; the key is reserved so we
   * don't break stored settings when that ships.
   */
  demographicOverrides: {},
  entitySettings: {
    contact: true,
    contactPhoto: true,
    site: false,
    siteLocation: false,
    organization: false,
    program: false,
    device: false,
    user: true,
    userPhoto: true,
    invitation: true,
  },
};

function generateSeed() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

chrome.runtime.onInstalled.addListener(async () => {
  await initializeSettings();
});

chrome.runtime.onStartup.addListener(async () => {
  await initializeSettings();
});

/**
 * Normalize a settings object against DEFAULT_SETTINGS.
 *
 * Single source of truth for "what does a complete settings object look
 * like?". Used by both the startup migration and the runtime message
 * handlers so any settings object handed to content scripts (or persisted
 * back to storage) carries every required key. This prevents a popup
 * save from silently dropping fields like `allowedDomains` and undoing
 * the startup migration on the next read.
 *
 * Honours an explicit empty `allowedDomains` array — that means "no
 * HTTP(S) hosts" (file:// still works) and must NOT be replaced with
 * defaults, otherwise the popup's empty state silently re-enables every
 * default host.
 */
function mergeWithDefaults(stored) {
  const base = stored || {};
  return {
    ...DEFAULT_SETTINGS,
    ...base,
    entitySettings: {
      ...DEFAULT_SETTINGS.entitySettings,
      ...(base.entitySettings || {}),
    },
    allowedDomains: Array.isArray(base.allowedDomains)
      ? base.allowedDomains
      : DEFAULT_ALLOWED_DOMAINS,
    demographicOverrides: base.demographicOverrides || {},
    seed: base.seed || generateSeed(),
  };
}

async function initializeSettings() {
  const existing = await chrome.storage.local.get(['settings']);
  if (!existing.settings) {
    await chrome.storage.local.set({
      settings: { ...DEFAULT_SETTINGS, seed: generateSeed() },
      identityCache: {},
    });
  } else {
    await chrome.storage.local.set({ settings: mergeWithDefaults(existing.settings) });
  }
  await updateBadge();
}

async function updateBadge() {
  const { settings } = await chrome.storage.local.get(['settings']);
  const enabled = settings?.enabled ?? true;

  if (enabled) {
    chrome.action.setBadgeText({ text: 'ON' });
    chrome.action.setBadgeBackgroundColor({ color: '#10B981' });
  } else {
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#6B7280' });
  }
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.settings) {
    updateBadge();
    notifyAllTabs();
  }
});

/**
 * Test whether a tab URL matches any user-configured domain.
 * Patterns support a single leading `*.` wildcard for subdomain matching.
 * A trailing `:port` on the pattern is stripped — Chrome's `URL#hostname`
 * never includes a port, so leaving it in would make every port-suffixed
 * entry (e.g. `localhost:8080`) silently dead.
 */
function tabMatchesDomain(urlString, allowedDomains) {
  if (!urlString) return false;
  if (urlString.startsWith('file://')) return true;

  let url;
  try {
    url = new URL(urlString);
  } catch {
    return false;
  }
  if (!['http:', 'https:'].includes(url.protocol)) return false;

  const host = url.hostname;
  for (const rawPattern of allowedDomains || []) {
    if (!rawPattern) continue;
    // Strip an optional `:port` — hostname comparison is portless.
    const pattern = rawPattern.replace(/:\d+$/, '');
    if (!pattern) continue;
    if (pattern.startsWith('*.')) {
      const suffix = pattern.slice(2);
      // Require a dot in the suffix — `*.com` would otherwise match every
      // `.com` host. Wildcards must target a registrable subdomain root
      // like `*.example.com`.
      if (!suffix.includes('.')) continue;
      if (host === suffix || host.endsWith('.' + suffix)) return true;
    } else if (host === pattern) {
      return true;
    }
  }
  return false;
}

async function notifyAllTabs() {
  const tabs = await chrome.tabs.query({});

  // Broadcast SETTINGS_CHANGED to every tab that already has a content
  // script loaded. Filtering by allowedDomains here would silently strand
  // tabs whose host was just removed from the allowlist — they'd never
  // hear about the change and stay masked until reload. Send to all; the
  // content script gates masking on its own URL.
  for (const tab of tabs) {
    if (!tab.url) continue;
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'SETTINGS_CHANGED' });
    } catch (_) {
      // Tab might not have content script loaded yet
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    chrome.storage.local.get(['settings', 'identityCache']).then(async ({ settings, identityCache }) => {
      // Normalize on read so consumers (popup, content script) always see
      // a complete settings object, even if storage was written by an
      // older version that lacked newer keys like `allowedDomains`.
      const normalized = mergeWithDefaults(settings);
      // Persist back when normalization changed anything — most importantly
      // a newly-generated seed. Without this every GET_SETTINGS call on a
      // seedless store would hand out a fresh random seed while
      // `identityCache` still holds entries keyed to an earlier one, so
      // masked values would drift across reads. Persisting locks the
      // generated seed in storage on first read.
      if (!settings || settings.seed !== normalized.seed || !Array.isArray(settings.allowedDomains)) {
        await chrome.storage.local.set({ settings: normalized });
      }
      sendResponse({ settings: normalized, identityCache: identityCache || {} });
    });
    return true;
  }

  if (message.type === 'UPDATE_SETTINGS') {
    // Normalize on write so a popup save that omits keys (e.g. only
    // toggles `enabled`) cannot drop `allowedDomains` and undo the
    // startup migration on the next read.
    const normalized = mergeWithDefaults(message.settings);
    chrome.storage.local.set({ settings: normalized }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'RESET_SEED') {
    chrome.storage.local.get(['settings']).then(async ({ settings }) => {
      // Normalize before writing so a reset can't drop Phase 1 keys
      // (`allowedDomains`, `demographicOverrides`) when the stored
      // object pre-dates them.
      const newSettings = mergeWithDefaults({
        ...(settings || {}),
        seed: generateSeed(),
      });
      await chrome.storage.local.set({ settings: newSettings, identityCache: {} });
      sendResponse({ success: true, seed: newSettings.seed });
    });
    return true;
  }

  if (message.type === 'CACHE_IDENTITY') {
    chrome.storage.local.get(['identityCache']).then(async ({ identityCache }) => {
      const newCache = { ...identityCache, [message.entityKey]: message.identity };
      await chrome.storage.local.set({ identityCache: newCache });
      sendResponse({ success: true });
    });
    return true;
  }
});

updateBadge();
