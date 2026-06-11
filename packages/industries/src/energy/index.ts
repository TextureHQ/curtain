import type { IndustryConfig } from '@texturehq/curtain-core';
import { ENERGY_ORGANIZATIONS } from './organizations.js';
import { ENERGY_PROGRAMS, ENERGY_DEVICES } from './programs.js';

/**
 * Energy industry pack — the original Curtain industry, preserved so the
 * browser extension's existing seeded identities continue to resolve to the
 * same names/orgs/programs after the refactor.
 *
 * Assets (logos, avatars) are bundled inside the extension itself rather than
 * here; the extension wires manifests into the core engine at startup.
 */
export const energy: IndustryConfig = {
  name: 'energy',
  organizations: ENERGY_ORGANIZATIONS,
  programs: ENERGY_PROGRAMS,
  devices: ENERGY_DEVICES,
};

export { ENERGY_ORGANIZATIONS, ENERGY_PROGRAMS, ENERGY_DEVICES };
