/**
 * Tests for the industry-pack system:
 *   1. pack-merge.js exposes CurtainPackMerge.mergePackData and merges
 *      correctly (dedup, weight summing, no input mutation).
 *   2. packs/registry.json is well-formed and every referenced pack has a
 *      valid data.json matching the IndustryConfig shape.
 *
 * These guard the two failure modes that would otherwise surface only at
 * runtime: a malformed pack contributed via PR, and a registry entry pointing
 * at a missing/malformed data.json.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const PACK_MERGE_FILE = join(__dirname, '..', 'src', 'shared', 'pack-merge.js');
const PACKS_DIR = join(REPO_ROOT, 'packs');
const REGISTRY_FILE = join(PACKS_DIR, 'registry.json');

// --- Helpers ---------------------------------------------------------------

function loadCurtainPackMerge() {
  const src = fs.readFileSync(PACK_MERGE_FILE, 'utf8');
  const sandbox = { window: {} };
  const fn = new Function('window', src);
  fn(sandbox.window);
  return sandbox.window.CurtainPackMerge;
}

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

// --- pack-merge.js merge semantics -----------------------------------------

test('pack-merge.js exposes CurtainPackMerge.mergePackData', () => {
  const api = loadCurtainPackMerge();
  assert.ok(api, 'CurtainPackMerge must be defined');
  assert.equal(typeof api.mergePackData, 'function', 'mergePackData must be a function');
});

test('mergePackData returns the core unchanged when no packs provided', () => {
  const { mergePackData } = loadCurtainPackMerge();
  const core = {
    organizations: [{ id: 'org_1', name: 'A', type: 'coop' }],
    programs: { battery: { weight: 0.4, names: ['Battery'] } },
    devices: ['Home Battery'],
  };
  const out = mergePackData(core, []);
  assert.deepEqual(out, core);
});

test('mergePackData does not mutate its inputs', () => {
  const { mergePackData } = loadCurtainPackMerge();
  const core = {
    organizations: [{ id: 'org_1', name: 'A', type: 'coop' }],
    programs: { battery: { weight: 0.4, names: ['Battery'] } },
    devices: ['Home Battery'],
  };
  const pack = {
    name: 'medical',
    data: {
      organizations: [{ id: 'med_1', name: 'Clinic', type: 'clinic' }],
      programs: { care: { weight: 0.5, names: ['Care'] } },
      devices: ['Glucose Meter'],
    },
  };
  const snapshot = JSON.stringify({ core, pack });
  mergePackData(core, [pack]);
  assert.equal(JSON.stringify({ core, pack }), snapshot, 'inputs must be unmodified');
});

test('mergePackData appends pack organizations and devices', () => {
  const { mergePackData } = loadCurtainPackMerge();
  const core = {
    organizations: [{ id: 'org_1', name: 'A', type: 'coop' }],
    programs: {},
    devices: ['Home Battery'],
  };
  const pack = {
    name: 'medical',
    data: {
      organizations: [
        { id: 'med_1', name: 'Clinic', type: 'clinic' },
        { id: 'med_2', name: 'Hospital', type: 'hospital' },
      ],
      devices: ['Glucose Meter', 'CPAP Machine'],
    },
  };
  const out = mergePackData(core, [pack]);
  assert.equal(out.organizations.length, 3, 'core org + 2 pack orgs');
  assert.equal(out.devices.length, 3, 'core device + 2 pack devices');
});

test('mergePackData de-duplicates organizations by id and devices by name', () => {
  const { mergePackData } = loadCurtainPackMerge();
  const core = {
    organizations: [{ id: 'org_1', name: 'A', type: 'coop' }],
    programs: {},
    devices: ['Home Battery'],
  };
  const pack = {
    name: 'dup',
    data: {
      organizations: [{ id: 'org_1', name: 'Duplicate', type: 'coop' }],
      devices: ['Home Battery'],
    },
  };
  const out = mergePackData(core, [pack]);
  assert.equal(out.organizations.length, 1, 'duplicate org id must be skipped');
  assert.equal(out.devices.length, 1, 'duplicate device name must be skipped');
});

test('mergePackData merges program buckets by name and sums weights', () => {
  const { mergePackData } = loadCurtainPackMerge();
  const core = {
    organizations: [],
    programs: { battery: { weight: 0.4, names: ['Battery'] } },
    devices: [],
  };
  const pack = {
    name: 'medical',
    data: {
      programs: {
        battery: { weight: 0.3, names: ['Battery', 'Medical Battery'] },
        care: { weight: 0.5, names: ['Care'] },
      },
    },
  };
  const out = mergePackData(core, [pack]);
  assert.equal(out.programs.battery.weight, 0.7, 'weights must sum');
  assert.deepEqual(out.programs.battery.names, ['Battery', 'Medical Battery'], 'names dedup + append');
  assert.equal(out.programs.care.weight, 0.5, 'new bucket preserved');
});

test('mergePackData merges multiple packs', () => {
  const { mergePackData } = loadCurtainPackMerge();
  const core = { organizations: [], programs: {}, devices: [] };
  const medical = { name: 'medical', data: { organizations: [{ id: 'med_1', name: 'Clinic', type: 'clinic' }] } };
  const construction = { name: 'construction', data: { organizations: [{ id: 'con_1', name: 'BuildCo', type: 'contractor' }] } };
  const out = mergePackData(core, [medical, construction]);
  assert.equal(out.organizations.length, 2, 'orgs from both packs');
});

// --- registry + data.json integrity ----------------------------------------

test('registry.json is well-formed', () => {
  const registry = loadJson(REGISTRY_FILE);
  assert.equal(typeof registry.version, 'number', 'registry must have a numeric version');
  assert.ok(registry.packs && typeof registry.packs === 'object', 'registry must have a packs map');
  for (const [name, meta] of Object.entries(registry.packs)) {
    assert.equal(meta.name, name, `pack key "${name}" must match meta.name`);
    assert.ok(meta.dataPath, `pack "${name}" must declare dataPath`);
  }
});

test('every registry pack has a valid data.json', () => {
  const registry = loadJson(REGISTRY_FILE);
  for (const [name, meta] of Object.entries(registry.packs)) {
    const dataPath = join(PACKS_DIR, name, 'data.json');
    assert.ok(fs.existsSync(dataPath), `pack "${name}" data.json missing at ${dataPath}`);
    const data = loadJson(dataPath);
    assert.equal(data.name, name, `pack "${name}" data.name must match`);
    // IndustryConfig shape
    assert.ok(Array.isArray(data.organizations), `pack "${name}" organizations must be an array`);
    for (const org of data.organizations) {
      assert.ok(org.id && org.name && org.type, `pack "${name}" org missing id/name/type`);
    }
    if (data.programs) {
      assert.equal(typeof data.programs, 'object', `pack "${name}" programs must be an object`);
      for (const [bucketKey, bucket] of Object.entries(data.programs)) {
        assert.equal(typeof bucket.weight, 'number', `pack "${name}" program "${bucketKey}" missing weight`);
        assert.ok(Array.isArray(bucket.names), `pack "${name}" program "${bucketKey}" names must be an array`);
      }
    }
    if (data.devices) {
      assert.ok(Array.isArray(data.devices), `pack "${name}" devices must be an array`);
      for (const d of data.devices) {
        assert.equal(typeof d, 'string', `pack "${name}" device must be a string`);
      }
    }
  }
});

test('no orphan data.json files without a registry entry', () => {
  const registry = loadJson(REGISTRY_FILE);
  const declared = new Set(Object.keys(registry.packs));
  for (const dir of fs.readdirSync(PACKS_DIR)) {
    if (dir === 'registry.json') continue;
    if (!fs.statSync(join(PACKS_DIR, dir)).isDirectory()) continue;
    assert.ok(declared.has(dir), `pack directory "${dir}" has no registry entry`);
  }
});
