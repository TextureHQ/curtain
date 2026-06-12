#!/usr/bin/env node
/**
 * extension/scripts/build-data-bundle.mjs
 *
 * Generates `src/shared/data.js` from the workspace packages
 *   - @texturehq/curtain-core (presets: US demographics + address)
 *   - @texturehq/curtain-industries (energy industry pack + asset manifests)
 *
 * Also copies the bundled asset directories from
 * `@texturehq/curtain-industries/assets/` into `extension/src/shared/` so
 * the MV3 content script can reference them at runtime (Chrome content
 * scripts can't import from node_modules).
 *
 * IMPORTANT: data.js and the copied asset directories are generated.
 * Edit the source in `packages/industries/` instead.
 */
import { writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  US_DEMOGRAPHICS_DEFAULT,
  US_ADDRESS_DEFAULT,
} from '@texturehq/curtain-core';
import {
  ENERGY_ORGANIZATIONS,
  ENERGY_PROGRAMS,
  ENERGY_DEVICES,
  ENERGY_LOGO_MANIFEST,
  AVATAR_MANIFEST_V1,
  getAssetsDir,
} from '@texturehq/curtain-industries';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHARED_DIR = join(__dirname, '..', 'src', 'shared');
const OUT_FILE = join(SHARED_DIR, 'data.js');

// ---------------------------------------------------------------------------
// 1. Copy asset directories from @texturehq/curtain-industries.
// ---------------------------------------------------------------------------
const industriesAssets = getAssetsDir();
const logosSrc = join(industriesAssets, 'energy', 'logos');
const avatarsSrc = join(industriesAssets, 'avatars', 'v1');

const logosDest = join(SHARED_DIR, 'logos');
const avatarsDest = join(SHARED_DIR, 'avatars', 'v1');

for (const dest of [logosDest, avatarsDest]) {
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
}
mkdirSync(dirname(avatarsDest), { recursive: true });
cpSync(logosSrc, logosDest, { recursive: true });
cpSync(avatarsSrc, avatarsDest, { recursive: true });
console.log(`copied logos → ${logosDest}`);
console.log(`copied avatars → ${avatarsDest}`);

// ---------------------------------------------------------------------------
// 2. Reshape package data → legacy content-script shape.
// `content.js` expects the same NAME_BUCKETS / LOCATION_REGIONS / etc. it
// always has. Adapt the package output rather than rewriting content.js to
// keep the diff small and lower the risk of breaking masking behaviour.
// ---------------------------------------------------------------------------
const NAME_BUCKETS = US_DEMOGRAPHICS_DEFAULT.buckets;
const STREET_BASES = US_ADDRESS_DEFAULT.streetBases;
const STREET_SUFFIXES = US_ADDRESS_DEFAULT.streetSuffixes;
const UNIT_DESIGNATORS = US_ADDRESS_DEFAULT.unitDesignators;
const LOCATION_REGIONS = Object.fromEntries(
  Object.entries(US_ADDRESS_DEFAULT.regions).map(([key, region]) => [
    key,
    { weight: region.weight, states: region.states, cities: region.cities },
  ]),
);

const ORGANIZATIONS = ENERGY_ORGANIZATIONS;
const PROGRAM_BUCKETS = ENERGY_PROGRAMS;
const DEVICE_NAMES = ENERGY_DEVICES;

const APPEARANCE_RANGE_WEIGHTS = { light: 0.35, medium: 0.35, dark: 0.30 };

// Rewrite the manifest basePaths to point at where we copied the assets
// inside the extension bundle.
const AVATAR_MANIFEST = {
  ...AVATAR_MANIFEST_V1,
  basePath: 'src/shared/avatars/v1',
};
const LOGO_MANIFEST = {
  ...ENERGY_LOGO_MANIFEST,
  basePath: 'src/shared/logos',
};

const PLACEHOLDER_AVATAR =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23E5E7EB"/%3E%3Ccircle cx="50" cy="40" r="20" fill="%239CA3AF"/%3E%3Cellipse cx="50" cy="85" rx="35" ry="25" fill="%239CA3AF"/%3E%3C/svg%3E';
const PLACEHOLDER_LOGO =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23E5E7EB"/%3E%3Crect x="20" y="30" width="60" height="40" fill="%239CA3AF"/%3E%3C/svg%3E';

const payload = {
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
};

const HEADER = `/**
 * Curtain — Shared Data (GENERATED — DO NOT EDIT BY HAND)
 *
 * Source of truth lives in:
 *   - @texturehq/curtain-core      (demographics, address pools)
 *   - @texturehq/curtain-industries (energy data + logo/avatar manifests + assets)
 *
 * Regenerate with: yarn --cwd extension build:data
 */
`;

const body = `
// Use IIFE to avoid polluting global scope (Chrome content scripts share scope)
(function() {
const DATA = ${JSON.stringify(payload, null, 2)};

if (typeof window !== 'undefined') {
  window.CurtainData = DATA;
}
})();
`;

mkdirSync(SHARED_DIR, { recursive: true });
writeFileSync(OUT_FILE, HEADER + body);
console.log(`wrote ${OUT_FILE}`);
