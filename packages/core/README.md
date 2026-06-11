# `@texturehq/curtain-core`

Deterministic demo-data generation engine for the [Curtain](https://github.com/TextureHQ/curtain/tree/main/extension) PII-masking extension and other consumers.

## What it does

`curtain-core` turns a `(seed, entityKey)` pair into a stable, fictional
identity — name, email, phone, address, employer, etc. — drawn from a
configurable demographic and industry pool.

The Curtain browser extension uses this engine to replace real PII in the DOM
with realistic look-alike data during demos. Anyone building demo-safe
tooling can use it directly:

```ts
import {
  CoreEngine,
  US_DEMOGRAPHICS_DEFAULT,
  US_ADDRESS_DEFAULT,
} from '@texturehq/curtain-core';
import { energy } from '@texturehq/curtain-industries';

const core = new CoreEngine({
  demographics: US_DEMOGRAPHICS_DEFAULT,
  address: US_ADDRESS_DEFAULT,
});

core.registerIndustry(energy);

const id = core.generateIdentity('my-seed', 'contact:cus_abc123');
//   { firstName, lastName, fullName, email, phone, address, ... }

const cohort = core.generateContacts('my-seed', 50, { industry: 'energy' });
```

## Industry registration API

Each industry is a config bundle:

```ts
core.registerIndustry({
  name: 'fintech',
  organizations: [
    { id: 'org_001', name: 'Acme Federal Credit Union', type: 'credit_union' },
    // ...
  ],
  programs: {
    lending: { weight: 0.5, names: ['SmartLoan', 'EasyCredit'] },
    deposits: { weight: 0.5, names: ['SmartSave'] },
  },
  devices: ['Card Reader', 'POS Terminal'],
  // Optional overrides:
  demographics: customDemographicsPool,
  address: customAddressPool,
  emailDomains: ['bank.example'],
});
```

Public industries (energy today; healthcare and fintech later) ship in
`@texturehq/curtain-industries`. Private industries can be registered at
runtime — see the [Industry Authoring Guide](../curtain/docs/industry-methodology.md).

## Determinism guarantee

`(seed, entityKey)` always produces the same identity. The seeded RNG is a
small LCG layered over a string-hash; both constants are frozen so cached
identities in the extension keep resolving stably across versions. The
`rng.test.ts` snapshot test guards that contract.

## Configurable demographics

`DemographicsConfig` accepts any set of buckets. The defaults are
US-representative because that's what the original extension used; teams in
other markets should pass their own pool. Mixing rules (`sameBucketProbability`)
are configurable too, so global teams aren't stuck with a US-centric mix model.

See [`presets/us-demographics.ts`](./src/presets/us-demographics.ts) for an
example.

## License

MIT. See `LICENSE` at the repo root.
