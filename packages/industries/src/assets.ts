import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { AvatarManifest, LogoManifest } from '@texturehq/curtain-core';
import { ENERGY_ORGANIZATIONS } from './energy/organizations.js';

/**
 * Asset bundle shipped with `@texturehq/curtain-industries`.
 *
 * The package includes:
 *   - One PNG logo per energy organisation (`assets/energy/logos/<id>.png`)
 *   - Avatar pack v1 (`assets/avatars/v1/<bucket>/avatar_NNNN.webp`)
 *
 * Node consumers can resolve the bundled directory with
 * {@link getAssetsDir} and feed the manifests below into the core engine.
 * Bundler consumers (Vite/webpack/Rollup) can also `import` files directly
 * using package-relative paths, e.g.
 *   `new URL('@texturehq/curtain-industries/assets/avatars/v1/...', import.meta.url)`
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Absolute path to the bundled assets directory.
 *
 * Layout:
 *   <assetsDir>/energy/logos/org_NNN.png
 *   <assetsDir>/avatars/v1/<bucket>/avatar_NNNN.webp
 *   <assetsDir>/avatars/v1/manifest.json
 */
export function getAssetsDir(): string {
  // From dist/assets.js → ../assets (relative to package root).
  return resolve(__dirname, '..', 'assets');
}

/**
 * Logo manifest for the energy industry. `basePath` is relative; combine
 * with {@link getAssetsDir} or with an extension-managed URL.
 */
export const ENERGY_LOGO_MANIFEST: LogoManifest = {
  basePath: 'energy/logos',
  logos: Object.fromEntries(
    ENERGY_ORGANIZATIONS.map((o) => [o.id, `${o.id}.png`]),
  ),
};

/**
 * Avatar manifest (pack v1). Buckets follow
 * `{female,male,neutral}_{light,medium,dark}` with 3 images each.
 */
export const AVATAR_MANIFEST_V1: AvatarManifest = {
  basePath: 'avatars/v1',
  buckets: Object.fromEntries(
    [
      'female_light', 'female_medium', 'female_dark',
      'male_light', 'male_medium', 'male_dark',
      'neutral_light', 'neutral_medium', 'neutral_dark',
    ].map((k) => [
      k,
      ['avatar_0001.webp', 'avatar_0002.webp', 'avatar_0003.webp'],
    ]),
  ),
};
