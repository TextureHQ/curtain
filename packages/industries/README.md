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

## Authoring a new industry

See the [Industry Authoring Guide](https://github.com/TextureHQ/curtain/blob/main/extension/docs/industry-methodology.md)
in the Curtain repo for the full process — research, name generation, logo
synthesis, collision checks, and quality criteria.

## License

MIT.
