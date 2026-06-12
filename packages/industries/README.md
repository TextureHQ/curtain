# `@texturehq/curtain-industries`

Public industry data packs for the [Curtain](https://github.com/TextureHQ/curtain/tree/main/extension) demo-data engine.

## Industries

- **`energy`** — US energy sector (co-ops, IOUs, municipal utilities, DERs).
  Source pack of the original Curtain extension.

Coming next (Phase 3): `healthcare`, `fintech`.

## Usage

```ts
import { CoreEngine, US_DEMOGRAPHICS_DEFAULT, US_ADDRESS_DEFAULT } from '@texturehq/curtain-core';
import { energy } from '@texturehq/curtain-industries';

const core = new CoreEngine({
  demographics: US_DEMOGRAPHICS_DEFAULT,
  address: US_ADDRESS_DEFAULT,
});
core.registerIndustry(energy);

const id = core.generateIdentity('my-seed', 'contact:abc');
// id.organizationName is one of 60 fictional energy companies
```

## Bundled assets

The package ships with the original Curtain visual pack so npm consumers
get a complete demo experience without cloning the repo:

- **60 organisation logos** — `assets/energy/logos/org_NNN.png`
- **Avatar pack v1** — 28 photos across 9 demographic buckets at
  `assets/avatars/v1/<bucket>/avatar_NNNN.webp`

Two manifests and a path resolver are exported for consumers:

```ts
import {
  ENERGY_LOGO_MANIFEST,
  AVATAR_MANIFEST_V1,
  getAssetsDir,
} from '@texturehq/curtain-industries';

// Node / SSR — absolute filesystem path to the bundled assets dir
const dir = getAssetsDir();
// → ".../node_modules/@texturehq/curtain-industries/assets"

// Bundlers — files are also exposed via the package "./assets/*" subpath
new URL(
  '@texturehq/curtain-industries/assets/avatars/v1/female_light/avatar_0001.webp',
  import.meta.url,
);
```

Wire the manifests into the core engine via `CoreEngineOptions.logoManifest`
and `avatarManifest`. Adjust `basePath` to whatever URL prefix your host
serves the copied assets from.

## Authoring a new industry

See the [Industry Authoring Guide](https://github.com/TextureHQ/curtain/blob/main/extension/docs/industry-methodology.md)
in the Curtain repo for the full process — research, name generation, logo
synthesis, collision checks, and quality criteria.

## License

MIT.
