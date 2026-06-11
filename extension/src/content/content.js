/**
 * Curtain - Content Script
 * Detects and masks PII elements in the DOM
 */

// Import shared data (loaded via manifest.json content_scripts)
const {
  NAME_BUCKETS,
  STREET_BASES,
  STREET_SUFFIXES,
  UNIT_DESIGNATORS,
  LOCATION_REGIONS,
  ORGANIZATIONS,
  PROGRAM_BUCKETS,
  DEVICE_NAMES,
  APPEARANCE_RANGE_WEIGHTS,
  PLACEHOLDER_AVATAR,
  PLACEHOLDER_LOGO,
  AVATAR_MANIFEST,
  LOGO_MANIFEST,
} = window.CurtainData || {};

let settings = null;
let identityCache = {};
let isProcessing = false;
let originalTitle = null;
let piiReplacements = new Map(); // Maps original values to masked values for title replacement

// Initialize on load
async function initialize() {
  // Guard: Exit if CurtainData failed to load (prevents runtime errors)
  // Include avatar/logo essentials that are required for new masking paths
  if (!NAME_BUCKETS || !LOCATION_REGIONS || !ORGANIZATIONS || !PROGRAM_BUCKETS ||
      !APPEARANCE_RANGE_WEIGHTS || !PLACEHOLDER_AVATAR || !PLACEHOLDER_LOGO) {
    console.error('Curtain: CurtainData not loaded - extension disabled');
    return;
  }

  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
    if (!response) {
      console.warn('Curtain: No response from background script');
      return;
    }
    settings = response.settings;
    identityCache = response.identityCache || {};

    updateDocumentState();
    processPiiElements();
    observeDom();
  } catch (error) {
    console.error('Curtain: Failed to initialize:', error);
  }
}

// Check whether the current tab URL is covered by settings.allowedDomains.
// Mirrors background.js `tabMatchesDomain` — kept inline so the content
// script has zero runtime deps on the background worker.
function currentUrlAllowed() {
  if (!settings) return false;
  const allowed = settings.allowedDomains;
  const href = location.href;
  // file:// is always allowed regardless of allowlist shape — matches
  // background.js `tabMatchesDomain` and the popup's empty-state copy
  // ("Curtain will not mask anywhere except file://").
  if (href.startsWith('file://')) return true;
  // Missing/non-array → treat as empty allowlist, NOT permissive.
  // Background normalizes settings on read so this should be unreachable
  // in practice, but keeping the fallback restrictive matches the popup's
  // user-facing empty-state copy and avoids the divergent-behaviour bug
  // where a malformed settings blob would silently mask every site.
  if (!Array.isArray(allowed)) return false;
  let url;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  if (!['http:', 'https:'].includes(url.protocol)) return false;
  const host = url.hostname;
  for (const rawPattern of allowed) {
    if (!rawPattern) continue;
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

// Update document class based on enabled state
function updateDocumentState() {
  if (settings?.enabled && currentUrlAllowed()) {
    document.documentElement.classList.add('curtain-enabled');
  } else {
    document.documentElement.classList.remove('curtain-enabled');
    // Restore original values when disabled or out-of-allowlist
    restoreOriginalValues();
  }
}

// Restore original PII values
function restoreOriginalValues() {
  // Restore elements with original HTML (initials replaced with avatar)
  const htmlElements = document.querySelectorAll('[data-pii-original-html]');
  for (const el of htmlElements) {
    // First, explicitly remove any injected avatar images
    const injectedImg = el.querySelector('img[data-curtain-avatar]');
    if (injectedImg) {
      injectedImg.remove();
    }

    const originalHtml = el.getAttribute('data-pii-original-html');
    if (originalHtml !== null) {
      el.innerHTML = originalHtml;
    }
    el.removeAttribute('data-pii-original-html');
    el.removeAttribute('data-pii-original');
    el.removeAttribute('data-pii-masked');
  }

  // Restore elements with original text/src
  const elements = document.querySelectorAll('[data-pii-original]');
  for (const el of elements) {
    const original = el.getAttribute('data-pii-original');
    if (original !== null && original !== '') {
      if (el.tagName === 'IMG') {
        el.src = original;
      } else {
        el.textContent = original;
      }
    }
    // Remove both attributes to prevent stale values on navigation
    el.removeAttribute('data-pii-original');
    el.removeAttribute('data-pii-masked');
  }

  // Restore original title
  if (originalTitle !== null) {
    document.title = originalTitle;
    originalTitle = null;
  }

  // Clear replacements map
  piiReplacements.clear();
}

// Process all PII elements in the document
function processPiiElements() {
  if (!settings?.enabled || isProcessing) return;
  // Out-of-allowlist tabs must not be masked, even on initial load.
  if (!currentUrlAllowed()) return;

  isProcessing = true;

  try {
    const elements = document.querySelectorAll('[data-pii-type][data-pii-entity]');

    for (const el of elements) {
      processPiiElement(el);
    }

    // Process page title after DOM elements
    processPageTitle();
  } finally {
    isProcessing = false;
  }
}

// Process page title to replace any PII values
function processPageTitle() {
  if (!settings?.enabled) {
    // Restore original title when disabled
    if (originalTitle !== null) {
      document.title = originalTitle;
      originalTitle = null;
    }
    return;
  }

  // Store original title if not already stored
  if (originalTitle === null) {
    originalTitle = document.title;
  }

  // Replace any known PII values in the title
  let maskedTitle = originalTitle;
  for (const [original, masked] of piiReplacements) {
    if (original && masked && original !== masked) {
      maskedTitle = maskedTitle.split(original).join(masked);
    }
  }

  if (maskedTitle !== document.title) {
    document.title = maskedTitle;
  }
}

// Map PII type to the correct settings key
// This allows granular control (e.g., mask address but not city/state)
function getSettingKeyForPiiType(entityType, piiType) {
  // Contact entity has granular controls for photos
  if (entityType === 'contact') {
    // Avatar and initials use contactPhoto setting
    if (['avatar', 'initials'].includes(piiType)) {
      return 'contactPhoto';
    }
    // All other contact PII (name, email, phone) uses contact setting
    return 'contact';
  }

  // User entity has granular controls for photos
  if (entityType === 'user') {
    // Avatar and initials use userPhoto setting
    if (['avatar', 'initials'].includes(piiType)) {
      return 'userPhoto';
    }
    // All other user PII (name, email) uses user setting
    return 'user';
  }

  // Site entity has granular controls
  if (entityType === 'site') {
    // Street address only
    if (piiType === 'address') {
      return 'site';
    }
    // City, state, ZIP, coordinates
    if (['city', 'state', 'postal-code', 'city-state', 'city-state-zip', 'coordinates'].includes(piiType)) {
      return 'siteLocation';
    }
  }
  // All other entity types use their entity type directly
  return entityType;
}

// Process a single PII element
function processPiiElement(el) {
  if (!settings?.enabled) return;

  const piiType = el.getAttribute('data-pii-type');
  const entityKey = el.getAttribute('data-pii-entity');

  if (!piiType || !entityKey) return;

  // Special handling for organization:current - independent of organization toggle
  // If a demo org is selected, mask it; otherwise show the real name
  if (entityKey === 'organization:current') {
    processDemoOrgElement(el, piiType);
    return;
  }

  // Determine which setting controls this PII type
  const entityType = entityKey.split(':')[0];
  const settingKey = getSettingKeyForPiiType(entityType, piiType);

  if (!settings.entitySettings?.[settingKey]) {
    // Entity type not enabled
    // Restore original HTML if initials were replaced with avatar
    if (el.hasAttribute('data-pii-original-html')) {
      // First, explicitly remove any injected avatar images
      const injectedImg = el.querySelector('img[data-curtain-avatar]');
      if (injectedImg) {
        injectedImg.remove();
      }

      const originalHtml = el.getAttribute('data-pii-original-html');
      if (originalHtml !== null) {
        el.innerHTML = originalHtml;
      }
      el.removeAttribute('data-pii-original-html');
      el.removeAttribute('data-pii-original');
    }
    // First, store original if not already stored
    if (!el.hasAttribute('data-pii-original')) {
      const valueToStore = el.tagName === 'IMG' ? el.src : el.textContent;
      if (valueToStore) {
        el.setAttribute('data-pii-original', valueToStore);
      }
    }
    // Restore original if previously masked
    if (el.hasAttribute('data-pii-original')) {
      const original = el.getAttribute('data-pii-original');
      if (original !== null && original !== '') {
        if (el.tagName === 'IMG') {
          if (el.src !== original) el.src = original;
        } else {
          if (el.textContent !== original) el.textContent = original;
        }
      }
    }
    // Mark as processed but not masked (so CSS shows it)
    el.setAttribute('data-pii-masked', 'false');
    return;
  }

  // Get or generate identity for this entity
  const identity = getOrCreateIdentity(entityKey);

  // Resolve the masked value
  const maskedValue = resolveMaskedValue(identity, piiType);

  // Store original value BEFORE masking (only if not already stored)
  const hasOriginal = el.hasAttribute('data-pii-original');
  const currentOriginal = el.getAttribute('data-pii-original');

  if (!hasOriginal || currentOriginal === '' || currentOriginal === null) {
    const valueToStore = el.tagName === 'IMG' ? el.src : el.textContent;
    // Only store if the current value isn't already a masked value
    if (valueToStore && valueToStore !== maskedValue) {
      el.setAttribute('data-pii-original', valueToStore);
    }
  }

  // Apply masked value
  if (el.tagName === 'IMG') {
    if (el.src !== maskedValue) {
      el.src = maskedValue;
    }
  } else if (piiType === 'initials') {
    // Special handling for initials: replace with avatar image
    replaceInitialsWithAvatar(el, identity);
  } else if (el.textContent !== maskedValue) {
    el.textContent = maskedValue;
  }

  // Track replacement for title masking (only for text content, not images)
  const originalValue = el.getAttribute('data-pii-original');
  if (originalValue && el.tagName !== 'IMG' && piiType !== 'initials') {
    piiReplacements.set(originalValue, maskedValue);
  }

  el.setAttribute('data-pii-masked', 'true');
}

// Replace initials span with an avatar image
function replaceInitialsWithAvatar(el, identity) {
  // Skip if avatar loading already failed (prevents infinite retry loop)
  if (el.hasAttribute('data-curtain-avatar-failed')) {
    return;
  }

  // Check if we already injected an avatar image
  const existingImg = el.querySelector('img[data-curtain-avatar]');
  if (existingImg) {
    // Update src if needed
    if (existingImg.src !== identity.avatar) {
      existingImg.src = identity.avatar;
    }
    return;
  }

  // Store original content if not stored
  if (!el.hasAttribute('data-pii-original-html')) {
    el.setAttribute('data-pii-original-html', el.innerHTML);
  }

  // Create avatar image
  const img = document.createElement('img');
  img.src = identity.avatar;
  img.alt = 'Avatar';
  img.setAttribute('data-curtain-avatar', 'true');
  img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: inherit;';

  // Handle load errors by reverting to original content and marking as failed
  // The marker prevents infinite retry loops from MutationObserver
  img.onerror = function() {
    el.setAttribute('data-curtain-avatar-failed', 'true');
    const originalHtml = el.getAttribute('data-pii-original-html');
    // Use !== null to handle empty string as valid original content
    if (originalHtml !== null) {
      el.innerHTML = originalHtml;
    }
  };

  // Clear and replace content
  el.textContent = '';
  el.appendChild(img);
}

// Process demo org element independently of organization toggle
// Only mask if a demo organization is selected, otherwise show real name
function processDemoOrgElement(el, piiType) {
  const hasDemoOrg = Boolean(settings.demoOrganization);

  if (!hasDemoOrg) {
    // No demo org selected - show real name
    // First, store original if not already stored
    if (!el.hasAttribute('data-pii-original')) {
      const valueToStore = el.tagName === 'IMG' ? el.src : el.textContent;
      if (valueToStore) {
        el.setAttribute('data-pii-original', valueToStore);
      }
    }
    // Restore original if previously masked
    if (el.hasAttribute('data-pii-original')) {
      const original = el.getAttribute('data-pii-original');
      if (original !== null && original !== '') {
        if (el.tagName === 'IMG') {
          if (el.src !== original) el.src = original;
        } else {
          if (el.textContent !== original) el.textContent = original;
        }
      }
    }
    el.setAttribute('data-pii-masked', 'false');
    return;
  }

  // Demo org is selected - mask with selected org name
  const identity = getCurrentOrgIdentity();
  const maskedValue = resolveMaskedValue(identity, piiType);

  // Store original value BEFORE masking
  const hasOriginal = el.hasAttribute('data-pii-original');
  const currentOriginal = el.getAttribute('data-pii-original');

  if (!hasOriginal || currentOriginal === '' || currentOriginal === null) {
    const valueToStore = el.tagName === 'IMG' ? el.src : el.textContent;
    if (valueToStore && valueToStore !== maskedValue) {
      el.setAttribute('data-pii-original', valueToStore);
    }
  }

  // Apply masked value
  if (el.tagName === 'IMG') {
    if (el.src !== maskedValue) el.src = maskedValue;
  } else if (el.textContent !== maskedValue) {
    el.textContent = maskedValue;
  }

  // Track replacement for title masking (only for text content, not images)
  const originalValue = el.getAttribute('data-pii-original');
  if (originalValue && el.tagName !== 'IMG') {
    piiReplacements.set(originalValue, maskedValue);
  }

  el.setAttribute('data-pii-masked', 'true');
}

// Get or create identity for an entity
function getOrCreateIdentity(entityKey) {
  // Special handling for current organization
  if (entityKey === 'organization:current') {
    return getCurrentOrgIdentity();
  }

  if (identityCache[entityKey]) {
    const cached = identityCache[entityKey];
    // Regenerate avatar if it's a placeholder or missing gender/appearance (old cached identities)
    const needsAvatarRegeneration =
      cached.avatar === PLACEHOLDER_AVATAR ||
      !cached.genderPresentation ||
      !cached.appearanceRange;

    if (needsAvatarRegeneration) {
      // Regenerate the full identity to get proper avatar support
      const freshIdentity = generateIdentity(settings.seed, entityKey);
      // Merge fresh identity into cache (preserves any other cached data)
      Object.assign(cached, freshIdentity);
    }
    return cached;
  }

  const identity = generateIdentity(settings.seed, entityKey);
  identityCache[entityKey] = identity;

  // Cache in storage (fire and forget)
  chrome.runtime.sendMessage({
    type: 'CACHE_IDENTITY',
    entityKey,
    identity,
  }).catch(() => {
    // Ignore errors from invalidated extension context
  });

  return identity;
}

// Get identity for current organization (uses demoOrganization setting)
function getCurrentOrgIdentity() {
  const demoOrg = settings.demoOrganization;
  if (!demoOrg) {
    // No demo org selected, generate a random one
    return generateIdentity(settings.seed, 'organization:current');
  }

  // Create a cached key for this specific demo org
  const cacheKey = `organization:current:${demoOrg}`;
  if (identityCache[cacheKey]) {
    return identityCache[cacheKey];
  }

  // Generate base identity but override org fields with selected demo org
  const baseIdentity = generateIdentity(settings.seed, cacheKey);
  const orgDomain = demoOrg.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.example';

  const identity = {
    ...baseIdentity,
    organizationName: demoOrg,
    organizationDomain: orgDomain,
    organizationLogo: PLACEHOLDER_LOGO,
  };

  identityCache[cacheKey] = identity;
  return identity;
}

// Generate a deterministic identity from seed + entity key
function generateIdentity(seed, entityKey) {
  const rng = createSeededRandom(`${seed}:${entityKey}`);

  // Use bucketed name generation for US-representative demographics
  // Now includes genderPresentation from first name metadata
  const { firstName, lastName, genderPresentation } = generateNamePair(rng);

  // Assign appearance range independently of name demographics
  const appearanceRange = assignAppearanceRange(rng);

  // Use regional location generation for realistic city/state pairing
  const { address, city, state, postalCode } = generateAddress(rng);

  // Generate organization from stable list (coop/IOU/municipal/DER)
  // Returns { id, name, type } for logo lookup
  const org = selectOrganization(rng);
  const orgName = org.name;
  const orgDomain = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.example';
  const orgLogo = resolveLogoUrl(org.id);

  // Generate program name from buckets (DR/efficiency/DER/EV/TOU/VPP)
  const programName = generateProgramName(rng);

  // Simple email domains for contacts (not org-specific)
  const emailDomains = ['email.example', 'mail.example', 'inbox.example'];
  const emailDomain = emailDomains[rng.nextInt(emailDomains.length)];

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    initials: `${firstName[0]}${lastName[0]}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`,
    phone: `(555) ${String(rng.nextInt(900) + 100)}-${String(rng.nextInt(9000) + 1000)}`,
    address,
    city,
    state,
    postalCode,
    cityState: `${city}, ${state}`,
    cityStateZip: `${city}, ${state} ${postalCode}`,
    coordinates: `${(rng.nextFloat() * 20 + 30).toFixed(4)}, ${(rng.nextFloat() * -50 - 70).toFixed(4)}`,
    organizationName: orgName,
    organizationDomain: orgDomain,
    organizationLogo: orgLogo,
    programName,
    deviceName: DEVICE_NAMES[rng.nextInt(DEVICE_NAMES.length)],
    // Avatar fields - resolved from AI-generated avatar manifest
    genderPresentation,   // 'male' | 'female' | 'neutral' - from first name metadata
    appearanceRange,      // 'light' | 'medium' | 'dark' - assigned independently
    avatar: resolveAvatarUrl(rng, genderPresentation, appearanceRange),
  };
}

// Resolve a masked value from identity based on PII type
function resolveMaskedValue(identity, piiType) {
  const fieldMap = {
    'first-name': 'firstName',
    'last-name': 'lastName',
    'full-name': 'fullName',
    'initials': 'initials',
    'email': 'email',
    'phone': 'phone',
    'organization-name': 'organizationName',
    'organization-domain': 'organizationDomain',
    'organization-logo': 'organizationLogo',
    'program-name': 'programName',
    'device-name': 'deviceName',
    'avatar': 'avatar',
    'address': 'address',
    'city': 'city',
    'state': 'state',
    'postal-code': 'postalCode',
    'city-state': 'cityState',
    'city-state-zip': 'cityStateZip',
    'coordinates': 'coordinates',
  };

  const field = fieldMap[piiType];
  return field ? identity[field] : '[MASKED]';
}

// Create a seeded random number generator
function createSeededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Use a simple LCG (Linear Congruential Generator)
  let state = Math.abs(hash);

  return {
    nextInt(max) {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return Math.floor((state / 4294967296) * max);
    },
    nextFloat() {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    },
  };
}

// Observe DOM for changes
function observeDom() {
  const observer = new MutationObserver((mutations) => {
    if (!settings?.enabled) return;

    // Debounce with requestAnimationFrame
    requestAnimationFrame(() => {
      processPiiElements();
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Also observe title changes for SPA navigation
  observeTitleChanges();
}

// Observe title element changes to detect SPA navigation
function observeTitleChanges() {
  const titleElement = document.querySelector('title');
  if (!titleElement) return;

  const titleObserver = new MutationObserver(() => {
    // Title changed - likely SPA navigation
    // Reset originalTitle so it re-captures the new page title
    // Only reset if the new title doesn't match what we set (avoid loop)
    const currentTitle = document.title;

    // If title changed and it's not one we masked, it's a navigation
    if (originalTitle !== null && currentTitle !== originalTitle) {
      // Check if current title contains any of our masked values
      let isMaskedTitle = false;
      for (const [_original, masked] of piiReplacements) {
        if (currentTitle.includes(masked)) {
          isMaskedTitle = true;
          break;
        }
      }

      // If it's not a masked title, it's a navigation - reset state
      if (!isMaskedTitle) {
        originalTitle = null;
        piiReplacements.clear();
      }
    }
  });

  titleObserver.observe(titleElement, {
    childList: true,
    characterData: true,
    subtree: true,
  });
}

// Listen for settings changes from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SETTINGS_CHANGED') {
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' })
      .then((response) => {
        settings = response.settings;
        identityCache = response.identityCache || {};
        updateDocumentState();
        processPiiElements();
      })
      .catch((error) => {
        console.warn('Curtain: Failed to refresh settings:', error);
      });
  }
});

// Bucketed name generation for US-representative demographics
// Data is loaded from shared/data.js via window.CurtainData

// Guard: Exit early if CurtainData failed to load
if (!NAME_BUCKETS || !LOCATION_REGIONS || !ORGANIZATIONS || !PROGRAM_BUCKETS) {
  console.error('Curtain: CurtainData not loaded - check manifest.json content_scripts order');
}

// Precompute cumulative weights for bucket selection (guarded)
const BUCKET_NAMES = NAME_BUCKETS ? Object.keys(NAME_BUCKETS) : [];
const BUCKET_CUMULATIVE_WEIGHTS = [];
let cumulativeWeight = 0;
for (const name of BUCKET_NAMES) {
  cumulativeWeight += NAME_BUCKETS[name].weight;
  BUCKET_CUMULATIVE_WEIGHTS.push(cumulativeWeight);
}

// Select a bucket based on weighted probability
function selectBucket(rng) {
  const roll = rng.nextFloat();
  for (let i = 0; i < BUCKET_CUMULATIVE_WEIGHTS.length; i++) {
    if (roll < BUCKET_CUMULATIVE_WEIGHTS[i]) {
      return BUCKET_NAMES[i];
    }
  }
  return BUCKET_NAMES[BUCKET_NAMES.length - 1];
}

// Generate a name pair using bucketed approach
// 75% same bucket, 25% cross-bucket for last name
// Returns firstName, lastName, and genderPresentation (from first name metadata)
function generateNamePair(rng) {
  const primaryBucket = selectBucket(rng);
  const bucket = NAME_BUCKETS[primaryBucket];

  // First names are now objects: { name: 'Michael', gender: 'male' }
  const firstNameEntry = bucket.firstNames[rng.nextInt(bucket.firstNames.length)];
  const firstName = firstNameEntry.name;
  const genderPresentation = firstNameEntry.gender;

  // 75% chance same bucket, 25% cross-bucket
  const useSameBucket = rng.nextFloat() < 0.75;
  let lastNameBucket;
  if (useSameBucket) {
    lastNameBucket = bucket;
  } else {
    // Pick another bucket for last name (may occasionally be same bucket by chance)
    const otherBucket = selectBucket(rng);
    lastNameBucket = NAME_BUCKETS[otherBucket];
  }

  const lastName = lastNameBucket.lastNames[rng.nextInt(lastNameBucket.lastNames.length)];

  return { firstName, lastName, genderPresentation };
}

// Street and location data loaded from shared/data.js

// Precompute cumulative weights for location regions (guarded)
const REGION_NAMES = LOCATION_REGIONS ? Object.keys(LOCATION_REGIONS) : [];
const REGION_CUMULATIVE_WEIGHTS = [];
let regionCumulativeWeight = 0;
for (const name of REGION_NAMES) {
  regionCumulativeWeight += LOCATION_REGIONS[name].weight;
  REGION_CUMULATIVE_WEIGHTS.push(regionCumulativeWeight);
}

// Select a region based on weighted probability
function selectRegion(rng) {
  const roll = rng.nextFloat();
  for (let i = 0; i < REGION_CUMULATIVE_WEIGHTS.length; i++) {
    if (roll < REGION_CUMULATIVE_WEIGHTS[i]) {
      return REGION_NAMES[i];
    }
  }
  return REGION_NAMES[REGION_NAMES.length - 1];
}

// Select from weighted array
function selectWeighted(rng, items) {
  const roll = rng.nextFloat();
  let cumulative = 0;
  for (const item of items) {
    cumulative += item.weight;
    if (roll < cumulative) {
      return item;
    }
  }
  return items[items.length - 1];
}

// Generate a realistic street name
function generateStreetName(rng) {
  const base = STREET_BASES[rng.nextInt(STREET_BASES.length)];
  const suffix = selectWeighted(rng, STREET_SUFFIXES).suffix;
  return `${base} ${suffix}`;
}

// Generate a house number with realistic distribution (bias toward 3-4 digits)
function generateHouseNumber(rng) {
  const roll = rng.nextFloat();
  if (roll < 0.15) {
    // 15% chance: 2 digits (10-99)
    return rng.nextInt(90) + 10;
  } else if (roll < 0.60) {
    // 45% chance: 3 digits (100-999)
    return rng.nextInt(900) + 100;
  } else {
    // 40% chance: 4 digits (1000-8999)
    return rng.nextInt(8000) + 1000;
  }
}

// Generate optional unit/apartment number (~30% of addresses)
function generateUnit(rng) {
  if (rng.nextFloat() > 0.30) {
    return null; // 70% no unit
  }

  const designator = selectWeighted(rng, UNIT_DESIGNATORS).format;
  let unitNumber;

  // 75% numeric only, 25% alphanumeric
  if (rng.nextFloat() < 0.75) {
    unitNumber = String(rng.nextInt(799) + 101); // 101-899
  } else {
    const num = rng.nextInt(20) + 1; // 1-20
    const letter = String.fromCharCode(65 + rng.nextInt(4)); // A-D
    unitNumber = `${num}${letter}`;
  }

  return designator === '#' ? `#${unitNumber}` : `${designator} ${unitNumber}`;
}

// Generate city/state pair with regional coherence
// 80% same region, 20% cross-region
function generateCityState(rng) {
  const primaryRegion = selectRegion(rng);
  const region = LOCATION_REGIONS[primaryRegion];

  const city = region.cities[rng.nextInt(region.cities.length)];

  // 80% same region state, 20% any region
  let state;
  if (rng.nextFloat() < 0.80) {
    state = region.states[rng.nextInt(region.states.length)];
  } else {
    const otherRegion = selectRegion(rng);
    const otherRegionData = LOCATION_REGIONS[otherRegion];
    state = otherRegionData.states[rng.nextInt(otherRegionData.states.length)];
  }

  return { city, state };
}

// Generate a realistic ZIP code (loosely correlated with region)
function generatePostalCode(rng, region) {
  // ZIP prefix ranges by region (approximate)
  const zipRanges = {
    west: { min: 90000, max: 99999 },
    southwest: { min: 75000, max: 88999 },
    midwest: { min: 43000, max: 62999 },
    northeast: { min: 1000, max: 19999 },
    southeast: { min: 30000, max: 39999 },
  };
  const range = zipRanges[region] || { min: 10000, max: 99999 };
  return String(rng.nextInt(range.max - range.min) + range.min).padStart(5, '0');
}

// Generate complete address object
function generateAddress(rng) {
  const houseNumber = generateHouseNumber(rng);
  const streetName = generateStreetName(rng);
  const unit = generateUnit(rng);
  const regionName = selectRegion(rng);
  const { city, state } = generateCityState(rng);
  const postalCode = generatePostalCode(rng, regionName);

  // Build address line
  let address = `${houseNumber} ${streetName}`;
  if (unit) {
    address += `, ${unit}`;
  }

  return { address, city, state, postalCode };
}

// Organization list loaded from shared/data.js
// Organizations are a stable list with IDs for logo association

// Select an organization deterministically based on RNG
// Returns the full org object { id, name, type }
function selectOrganization(rng) {
  if (!ORGANIZATIONS || ORGANIZATIONS.length === 0) {
    return { id: 'org_000', name: 'Unknown Utility', type: 'unknown' };
  }
  const index = rng.nextInt(ORGANIZATIONS.length);
  return ORGANIZATIONS[index];
}

// Generate organization name (returns just the name for backwards compatibility)
function generateOrgName(rng) {
  return selectOrganization(rng).name;
}

// Program name buckets loaded from shared/data.js

// Precompute cumulative weights for program buckets (guarded)
const PROGRAM_BUCKET_NAMES = PROGRAM_BUCKETS ? Object.keys(PROGRAM_BUCKETS) : [];
const PROGRAM_BUCKET_CUMULATIVE_WEIGHTS = [];
let programCumulativeWeight = 0;
for (const name of PROGRAM_BUCKET_NAMES) {
  programCumulativeWeight += PROGRAM_BUCKETS[name].weight;
  PROGRAM_BUCKET_CUMULATIVE_WEIGHTS.push(programCumulativeWeight);
}

// Select a program bucket based on weighted probability
function selectProgramBucket(rng) {
  const roll = rng.nextFloat();
  for (let i = 0; i < PROGRAM_BUCKET_CUMULATIVE_WEIGHTS.length; i++) {
    if (roll < PROGRAM_BUCKET_CUMULATIVE_WEIGHTS[i]) {
      return PROGRAM_BUCKET_NAMES[i];
    }
  }
  return PROGRAM_BUCKET_NAMES[PROGRAM_BUCKET_NAMES.length - 1];
}

// Generate program name from buckets
function generateProgramName(rng) {
  const bucketName = selectProgramBucket(rng);
  const bucket = PROGRAM_BUCKETS[bucketName];
  return bucket.names[rng.nextInt(bucket.names.length)];
}

// DEVICE_NAMES, PLACEHOLDER_AVATAR, PLACEHOLDER_LOGO, AVATAR_MANIFEST, LOGO_MANIFEST loaded from shared/data.js

// Resolve logo URL from manifest based on organization ID
// Returns a chrome:// URL for the logo image, or placeholder if unavailable
function resolveLogoUrl(orgId) {
  if (!LOGO_MANIFEST?.logos) {
    return PLACEHOLDER_LOGO;
  }

  const logoFile = LOGO_MANIFEST.logos[orgId];
  if (!logoFile) {
    return PLACEHOLDER_LOGO;
  }

  const relativePath = `${LOGO_MANIFEST.basePath}/${logoFile}`;

  try {
    return chrome.runtime.getURL(relativePath);
  } catch {
    return PLACEHOLDER_LOGO;
  }
}

// Resolve avatar URL from manifest based on gender and appearance
// Returns a chrome:// URL for the avatar image, or placeholder if unavailable
// Implements fallback chain: exact bucket → same gender medium → neutral_medium → placeholder
function resolveAvatarUrl(rng, genderPresentation, appearanceRange) {
  if (!AVATAR_MANIFEST?.buckets) {
    return PLACEHOLDER_AVATAR;
  }

  const bucketKey = `${genderPresentation}_${appearanceRange}`;
  let avatarFiles = AVATAR_MANIFEST.buckets[bucketKey];
  let actualBucketKey = bucketKey;

  // Fallback chain: exact bucket → same gender medium → neutral_medium → placeholder
  if (!avatarFiles || avatarFiles.length === 0) {
    const mediumKey = `${genderPresentation}_medium`;
    avatarFiles = AVATAR_MANIFEST.buckets[mediumKey];
    actualBucketKey = mediumKey;
  }
  if (!avatarFiles || avatarFiles.length === 0) {
    avatarFiles = AVATAR_MANIFEST.buckets['neutral_medium'];
    actualBucketKey = 'neutral_medium';
  }
  if (!avatarFiles || avatarFiles.length === 0) {
    return PLACEHOLDER_AVATAR;
  }

  const avatarFile = avatarFiles[rng.nextInt(avatarFiles.length)];
  const relativePath = `${AVATAR_MANIFEST.basePath}/${actualBucketKey}/${avatarFile}`;

  try {
    return chrome.runtime.getURL(relativePath);
  } catch {
    return PLACEHOLDER_AVATAR;
  }
}

// Assign appearance range using weighted distribution
// Intentionally independent of name demographics to avoid correlation
function assignAppearanceRange(rng) {
  // Default weights ensure function works even if weights are missing
  const weights = APPEARANCE_RANGE_WEIGHTS || { light: 0.35, medium: 0.35, dark: 0.30 };
  const roll = rng.nextFloat();
  const lightThreshold = weights.light;
  const mediumThreshold = lightThreshold + weights.medium;

  if (roll < lightThreshold) return 'light';
  if (roll < mediumThreshold) return 'medium';
  return 'dark';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
