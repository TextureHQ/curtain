/**
 * Test that the generated `src/shared/data.js` exposes a CurtainData shape
 * compatible with the content script. Guards against breakage of the build
 * step that would silently disable masking in the extension.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'src', 'shared', 'data.js');

function loadData(path) {
  const src = fs.readFileSync(path, 'utf8');
  const sandbox = { window: {} };
  const fn = new Function('window', src);
  fn(sandbox.window);
  return sandbox.window.CurtainData;
}

test('data.js loads and exposes CurtainData', () => {
  const data = loadData(DATA_FILE);
  assert.ok(data, 'CurtainData must be defined');
});

test('CurtainData has all required keys for content.js', () => {
  const data = loadData(DATA_FILE);
  const requiredKeys = [
    'NAME_BUCKETS', 'STREET_BASES', 'STREET_SUFFIXES', 'UNIT_DESIGNATORS',
    'LOCATION_REGIONS', 'ORGANIZATIONS', 'PROGRAM_BUCKETS', 'DEVICE_NAMES',
    'APPEARANCE_RANGE_WEIGHTS', 'PLACEHOLDER_AVATAR', 'PLACEHOLDER_LOGO',
    'AVATAR_MANIFEST', 'LOGO_MANIFEST',
  ];
  for (const key of requiredKeys) {
    assert.ok(data[key] !== undefined, `missing ${key}`);
  }
});

test('NAME_BUCKETS has the original 5 demographic buckets', () => {
  const data = loadData(DATA_FILE);
  assert.deepEqual(
    Object.keys(data.NAME_BUCKETS).sort(),
    ['anglo', 'asian', 'black', 'hispanic', 'neutral'],
  );
});

test('ORGANIZATIONS contains exactly 5 neutral default orgs', () => {
  const data = loadData(DATA_FILE);
  assert.equal(data.ORGANIZATIONS.length, 5);
  const ids = new Set(data.ORGANIZATIONS.map((o) => o.id));
  assert.equal(ids.size, 5, 'org IDs must be unique');
});

test('LOCATION_REGIONS includes the 5 US regions', () => {
  const data = loadData(DATA_FILE);
  assert.deepEqual(
    Object.keys(data.LOCATION_REGIONS).sort(),
    ['midwest', 'northeast', 'southeast', 'southwest', 'west'],
  );
});
