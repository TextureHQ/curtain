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

let settings = null;

// Demo organization options - mirrors ORG_BUCKETS from content.js
const DEMO_ORG_OPTIONS = [
  // Co-ops (largest category)
  'Pioneer Electric Cooperative',
  'Valley Rural Electric',
  'Northern Plains REC',
  'Ozark Electric Cooperative',
  'Blue Ridge Electric Membership Corp',
  'Heartland Electric Cooperative',
  'Midwest Energy Cooperative',
  'Tri-County Electric Cooperative',
  // IOUs
  'Northern Lights Electric',
  'Valley Stream Power',
  'Summit Power Company',
  'Coastal Electric',
  'Evergreen Utilities',
  'Prairie State Energy',
  'Golden State Electric',
  // Municipals
  'Springfield Municipal Electric',
  'Riverside Public Utilities',
  'Burlington Electric Department',
  'Madison Power & Light',
  // DER/OEM
  'Redwood Energy Group',
  'Pacific Grid Solutions',
  'Blue Sky Energy',
  'Horizon Energy Systems',
  'NextWave Power',
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

// Initialize on load
initialize();
