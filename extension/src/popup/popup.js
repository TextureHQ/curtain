/**
 * Curtain - Popup Script
 * Handles UI interactions and settings management
 */

const masterToggle = document.getElementById('master-toggle');
const entityToggles = document.querySelectorAll('[data-entity]');
const resetBtn = document.getElementById('reset-btn');
const demoOrgSelect = document.getElementById('demo-org-select');
const headerStatus = document.getElementById('header-status');
const statusText = headerStatus.querySelector('.status-text');
const domainListEl = document.getElementById('domain-list');
const domainInputEl = document.getElementById('domain-input');
const domainAddBtn = document.getElementById('domain-add-btn');
const packListEl = document.getElementById('pack-list');
const packRefreshBtn = document.getElementById('pack-refresh-btn');

let settings = null;
let availablePacks = [];

// Demo organization options — mirrors the neutral default ORGANIZATIONS in
// build-data-bundle.mjs. NOTE: this should eventually populate dynamically
// from the core pool + enabled packs; the static list is a stopgap until the
// popup can read the merged organization list from the background worker.
const DEMO_ORG_OPTIONS = [
  'Acme Corporation',
  'Globex Industries',
  'Initech Solutions',
  'Northwind Traders',
  'Umbrella Holdings',
];

// Initialize popup
async function initialize() {
  // Populate demo org select options
  for (const orgName of DEMO_ORG_OPTIONS) {
    const option = document.createElement('option');
    option.value = orgName;
    option.textContent = orgName;
    demoOrgSelect.appendChild(option);
  }

  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
    if (!response) {
      console.warn('Curtain: No response from background script');
      statusText.textContent = 'Extension error';
      headerStatus.className = 'header-status inactive';
      return;
    }
    settings = response.settings;
    updateUI();
    await loadPacks();
  } catch (error) {
    console.error('Curtain: Failed to initialize popup:', error);
    statusText.textContent = 'Extension error';
    headerStatus.className = 'header-status inactive';
  }
}

// Update UI to reflect current settings
function updateUI() {
  if (!settings) return;

  masterToggle.checked = settings.enabled;
  updateEntityTogglesState();

  for (const toggle of entityToggles) {
    const entity = toggle.getAttribute('data-entity');
    toggle.checked = settings.entitySettings?.[entity] ?? false;
  }

  // Set demo org select value
  demoOrgSelect.value = settings.demoOrganization || '';

  renderDomains();

  updateStatus();
}

// ---------- Domain editor (M1.3: ALL-1677) ----------
function renderDomains() {
  const domains = Array.isArray(settings.allowedDomains)
    ? settings.allowedDomains
    : [];
  domainListEl.innerHTML = '';
  if (domains.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'hint';
    empty.textContent = 'No domains configured. Curtain will not mask anywhere except file://.';
    domainListEl.appendChild(empty);
    return;
  }
  for (const pattern of domains) {
    const row = document.createElement('div');
    row.className = 'domain-row';
    const text = document.createElement('span');
    text.className = 'domain-pattern';
    text.textContent = pattern;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'domain-remove-btn';
    removeBtn.textContent = '×';
    removeBtn.title = `Remove ${pattern}`;
    removeBtn.addEventListener('click', () => {
      settings.allowedDomains = domains.filter((d) => d !== pattern);
      saveSettings().then(renderDomains);
    });
    row.appendChild(text);
    row.appendChild(removeBtn);
    domainListEl.appendChild(row);
  }
}

domainAddBtn.addEventListener('click', () => {
  const pattern = domainInputEl.value.trim();
  if (!pattern) return;
  // Light validation: reject invalid characters.
  if (!/^(\*\.)?[a-z0-9.-]+(:[0-9]+)?$/i.test(pattern)) {
    domainInputEl.setCustomValidity('Use a hostname or *.subdomain.example.com');
    domainInputEl.reportValidity();
    return;
  }
  // Reject bare-TLD wildcards like `*.com` — they'd match every `.com`
  // host. Wildcards must target a registrable parent domain (the suffix
  // after `*.` must itself contain a dot).
  if (pattern.startsWith('*.') && !pattern.slice(2).replace(/:\d+$/, '').includes('.')) {
    domainInputEl.setCustomValidity('Wildcard patterns require a registrable parent (e.g. *.example.com)');
    domainInputEl.reportValidity();
    return;
  }
  domainInputEl.setCustomValidity('');
  const current = Array.isArray(settings.allowedDomains)
    ? [...settings.allowedDomains]
    : [];
  if (!current.includes(pattern)) {
    current.push(pattern);
  }
  settings.allowedDomains = current;
  domainInputEl.value = '';
  saveSettings().then(renderDomains);
});

domainInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    domainAddBtn.click();
  }
});

// Enable/disable entity toggles based on master toggle
function updateEntityTogglesState() {
  for (const toggle of entityToggles) {
    toggle.disabled = !settings.enabled;
  }
  // Note: demoOrgSelect stays enabled regardless of master toggle
  // so users can set their demo org name before enabling masking
}

// Update status text in header
function updateStatus() {
  if (!settings?.enabled) {
    statusText.textContent = 'Masking disabled';
    headerStatus.className = 'header-status inactive';
    return;
  }

  const enabledEntities = Object.entries(settings.entitySettings || {})
    .filter(([_, enabled]) => enabled)
    .map(([entity]) => entity);

  if (enabledEntities.length === 0) {
    statusText.textContent = 'No entities selected';
    headerStatus.className = 'header-status inactive';
  } else {
    statusText.textContent = `Masking ${enabledEntities.length} entity type${enabledEntities.length > 1 ? 's' : ''}`;
    headerStatus.className = 'header-status active';
  }
}

// Handle master toggle change
masterToggle.addEventListener('change', async () => {
  settings.enabled = masterToggle.checked;
  await saveSettings();
  updateEntityTogglesState();
  updateStatus();
});

// Handle entity toggle changes
for (const toggle of entityToggles) {
  toggle.addEventListener('change', async () => {
    const entity = toggle.getAttribute('data-entity');
    settings.entitySettings[entity] = toggle.checked;
    await saveSettings();
    updateStatus();
  });
}

// Handle demo org select changes
demoOrgSelect.addEventListener('change', async () => {
  settings.demoOrganization = demoOrgSelect.value || null;
  await saveSettings();
});

// Handle reset button
resetBtn.addEventListener('click', async () => {
  resetBtn.disabled = true;
  resetBtn.textContent = 'Resetting...';

  try {
    await chrome.runtime.sendMessage({ type: 'RESET_SEED' });
    statusText.textContent = 'Identities reset!';
    headerStatus.className = 'header-status active';

    setTimeout(() => {
      updateStatus();
    }, 1500);
  } catch (error) {
    console.error('Curtain: Failed to reset seed:', error);
    statusText.textContent = 'Reset failed';
    headerStatus.className = 'header-status inactive';
  } finally {
    resetBtn.disabled = false;
    resetBtn.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 4v6h6M23 20v-6h-6"/>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
      </svg>
      Reset Identities
    `;
  }
});

// Save settings to storage
async function saveSettings() {
  try {
    await chrome.runtime.sendMessage({ type: 'UPDATE_SETTINGS', settings });
  } catch (error) {
    console.error('Curtain: Failed to save settings:', error);
  }
}

// ---------- Industry Packs (runtime pack loading) ----------

// Load the pack registry + cached state from the background worker.
async function loadPacks() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'FETCH_PACK_REGISTRY' });
    if (!response) return;
    availablePacks = response.availablePacks || [];
    renderPacks();
  } catch (error) {
    console.error('Curtain: Failed to load packs:', error);
  }
}

// Render the pack list with toggle switches.
function renderPacks() {
  packListEl.innerHTML = '';

  if (!availablePacks.length) {
    const empty = document.createElement('p');
    empty.className = 'hint';
    empty.textContent = 'No packs available. Check your connection and refresh.';
    packListEl.appendChild(empty);
    return;
  }

  for (const pack of availablePacks) {
    const wrapper = document.createElement('div');
    wrapper.className = 'pack-card';
    wrapper.dataset.pack = pack.name;

    // ── Top row: name, description, master toggle ──
    const row = document.createElement('div');
    row.className = 'pack-row';

    const info = document.createElement('div');
    info.className = 'pack-info';

    const label = document.createElement('span');
    label.className = 'pack-name';
    label.textContent = pack.displayName;

    const desc = document.createElement('span');
    desc.className = 'pack-desc';
    desc.textContent = pack.description;

    info.appendChild(label);
    info.appendChild(desc);

    const toggleLabel = document.createElement('label');
    toggleLabel.className = 'switch';
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = !!pack.enabled;
    toggle.disabled = !pack.cached && !pack.enabled;
    toggle.addEventListener('change', async () => {
      toggle.disabled = true;
      try {
        await chrome.runtime.sendMessage({
          type: 'TOGGLE_PACK',
          packName: pack.name,
          enabled: toggle.checked,
        });
        await loadPacks();
      } catch (error) {
        console.error('Curtain: Failed to toggle pack:', error);
        toggle.checked = !toggle.checked;
        toggle.disabled = false;
      }
    });
    const slider = document.createElement('span');
    slider.className = 'slider';
    toggleLabel.appendChild(toggle);
    toggleLabel.appendChild(slider);

    row.appendChild(info);
    row.appendChild(toggleLabel);
    wrapper.appendChild(row);

    // ── Sub-toggles: type/bucket filters (only when enabled + masks present) ──
    if (pack.enabled && pack.masks) {
      const filters = pack.filters || {};

      // Organization type checkboxes
      if (pack.masks.organization?.types?.length) {
        const orgRow = document.createElement('div');
        orgRow.className = 'pack-filter-row';
        const orgLabel = document.createElement('span');
        orgLabel.className = 'pack-filter-label';
        orgLabel.textContent = 'Orgs:';
        orgLabel.style.marginRight = '4px';
        orgRow.appendChild(orgLabel);

        const orgCbs = {};
        for (const type of pack.masks.organization.types) {
          const cb = createFilterChip(pack, 'organization', type,
            filters.organization?.[type] !== false);
          orgRow.appendChild(cb);
          orgCbs[type] = cb;
        }
        wrapper.appendChild(orgRow);
      }

      // Program bucket checkboxes
      if (pack.masks.program?.buckets?.length) {
        const progRow = document.createElement('div');
        progRow.className = 'pack-filter-row';
        const progLabel = document.createElement('span');
        progLabel.className = 'pack-filter-label';
        progLabel.textContent = 'Progs:';
        progLabel.style.marginRight = '4px';
        progRow.appendChild(progLabel);

        for (const bucket of pack.masks.program.buckets) {
          const cb = createFilterChip(pack, 'program', bucket,
            filters.program?.[bucket] !== false);
          progRow.appendChild(cb);
        }
        wrapper.appendChild(progRow);
      }

      // Device toggle
      if (pack.masks.device != null) {
        const devRow = document.createElement('div');
        devRow.className = 'pack-filter-row';
        const devCb = createFilterChip(pack, 'device', null,
          filters.device !== false);
        devCb.querySelector('.filter-label-text').textContent =
          `${pack.masks.device.count} devices`;
        devRow.appendChild(devCb);
        wrapper.appendChild(devRow);
      }
    }

    packListEl.appendChild(wrapper);
  }
}

/**
 * Create a small checkbox chip for a type/bucket filter.
 * Clicking it fires SET_PACK_FILTER to persist the change.
 */
function createFilterChip(pack, category, key, checked) {
  const label = document.createElement('label');
  label.className = 'filter-chip';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.checked = checked;
  cb.addEventListener('change', async () => {
    cb.disabled = true;
    // Build updated filters from current DOM state for this pack
    const wrapper = packListEl.querySelector(`[data-pack="${pack.name}"]`);
    const newFilters = buildFiltersFromDOM(wrapper, pack);
    try {
      await chrome.runtime.sendMessage({
        type: 'SET_PACK_FILTER',
        packName: pack.name,
        filters: newFilters,
      });
      await loadPacks();
    } catch (err) {
      console.error('Curtain: filter update failed:', err);
      cb.checked = !cb.checked;
      cb.disabled = false;
    }
  });
  const span = document.createElement('span');
  span.className = `filter-label-text ${checked ? 'active' : ''}`;
  span.textContent = key || '';
  // Update style when checked state changes
  cb.addEventListener('change', () => {
    span.className = `filter-label-text ${cb.checked ? 'active' : ''}`;
  });
  label.appendChild(cb);
  label.appendChild(span);
  return label;
}

/**
 * Walk the DOM sub-toggles for a pack and reconstruct the filters object.
 */
function buildFiltersFromDOM(wrapper, pack) {
  const filters = {};
  const rows = wrapper.querySelectorAll('.pack-filter-row');
  for (const row of rows) {
    const chips = row.querySelectorAll('.filter-chip input');
    const labelEl = row.querySelector('.pack-filter-label');
    const heading = labelEl?.textContent?.toLowerCase() || '';

    if (heading.startsWith('orgs')) {
      filters.organization = {};
      for (const chip of chips) {
        const name = chip.nextElementSibling?.textContent;
        if (name) filters.organization[name] = chip.checked;
      }
    } else if (heading.startsWith('progs')) {
      filters.program = {};
      for (const chip of chips) {
        const name = chip.nextElementSibling?.textContent;
        if (name) filters.program[name] = chip.checked;
      }
    } else {
      // Device row — single checkbox
      filters.device = chips[0]?.checked ?? true;
    }
  }
  return filters;
}

// Refresh the pack list (force re-fetch registry).
packRefreshBtn.addEventListener('click', async () => {
  packRefreshBtn.disabled = true;
  packRefreshBtn.textContent = 'Refreshing...';
  try {
    await loadPacks();
  } finally {
    packRefreshBtn.disabled = false;
    packRefreshBtn.textContent = 'Refresh Pack List';
  }
});

// Initialize on load
initialize();
