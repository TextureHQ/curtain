# Curtain

> A Chrome extension that masks personally-identifiable information in B2B
> SaaS dashboards so you can demo, screenshot, and screen-share without
> leaking customer data. Open source under the MIT license.

Curtain is built and maintained by [Texture](https://texturehq.com) and is the
extension we use internally to make every demo safe. We're open-sourcing it
because every B2B SaaS team needs the same thing.

## How it works

Curtain looks for DOM elements tagged with `data-pii-type` and
`data-pii-entity` attributes and replaces their content with deterministic
fake data. The data generation engine (`@texturehq/curtain-core`) is a
separate npm package — anyone can use it to build demo-safe tooling outside
the extension too.

```html
<span data-pii-type="full-name" data-pii-entity="contact:ctc_abc123">
  Jane Doe
</span>
```

renders as `Ana Garcia` (or any deterministic fake based on the seed).

## Architecture

```
@texturehq/curtain-core         engine: deterministic data generation API
@texturehq/curtain-industries   public industry packs (energy today)
extension                   the Chrome MV3 extension
```

The extension bundles core + industries at build time via
`scripts/build-data-bundle.mjs`. Library users (Node, browser apps) can pull
the npm packages directly:

```ts
import { CoreEngine, US_DEMOGRAPHICS_DEFAULT, US_ADDRESS_DEFAULT } from '@texturehq/curtain-core';
import { energy } from '@texturehq/curtain-industries';

const core = new CoreEngine({ demographics: US_DEMOGRAPHICS_DEFAULT, address: US_ADDRESS_DEFAULT });
core.registerIndustry(energy);

const id = core.generateIdentity('my-seed', 'contact:cus_abc123');
// { firstName, lastName, fullName, email, phone, address, organizationName, ... }
```

## Installing the extension (developer build)

1. Clone this repo and run `yarn install` from the root.
2. Build the data bundle: `yarn --cwd extension build`.
3. Chrome → `chrome://extensions` → enable Developer Mode → "Load unpacked"
   → select `extension`.
4. Click the Curtain icon to open the popup and configure.

## Configuration

### Allowed domains

The "Allowed Domains" section of the popup controls which sites Curtain
masks on. Defaults: `*.texturehq.com`, `localhost`, `local.texturehq.com`,
plus `file://` (always on). Add `*.yourcompany.com` to enable masking on
your own dashboards.

> The browser also needs to grant the extension access to the host. The
> shipped `manifest.json` covers `*.texturehq.com`, `localhost`, and
> `file://`. To mask additional hosts, either edit `host_permissions` in
> `manifest.json` and reload the unpacked extension, or wait for the
> store-distributed extension which supports user-granted permissions at
> runtime (Phase 4).

### Demographic ratios

The default identity pool is US-representative (anglo / hispanic / black /
asian / neutral) with the weights captured in
[`packages/core/src/presets/us-demographics.ts`](../curtain-core/src/presets/us-demographics.ts).

Phase 1 ships the `@texturehq/curtain-core` `DemographicsConfig` API
(arbitrary bucket names, per-bucket weights, configurable
`mixingRules.sameBucketProbability`) — library consumers can swap
demographics today. The extension itself currently still uses the static
preset baked into the generated `data.js`; the `settings.demographicOverrides`
chrome.storage key is reserved/plumbed (settings round-trip preserves it)
but **not yet consumed** by the content script. The popup UI and runtime
override wiring land in Phase 2.

Library users can pass any `DemographicsConfig` to `CoreEngine` — global
teams should build a pool that fits their market.

## Identity attributes Curtain understands

| Type | Example |
| --- | --- |
| `first-name`, `last-name`, `full-name`, `initials` | Names |
| `email`, `phone` | Contact info |
| `avatar` | Photo (replaced with AI-generated avatar) |
| `address`, `city`, `state`, `postal-code`, `city-state`, `city-state-zip`, `coordinates` | Location |
| `organization-name`, `organization-domain`, `organization-logo` | Company |
| `program-name`, `device-name` | Industry-specific |

See [`extension/src/content/content.js`](./src/content/content.js)
for the full type → field map.

## Contributing

We welcome industry contributions, bug fixes, and UI improvements. Start
with [CONTRIBUTING.md](./CONTRIBUTING.md) and the
[Industry Authoring Guide](./docs/industry-methodology.md).

## Security

Found a vulnerability? See [SECURITY.md](./SECURITY.md).

## License

MIT. See [`LICENSE`](./LICENSE).
