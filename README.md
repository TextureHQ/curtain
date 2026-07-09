# Curtain

> A browser extension that masks personally-identifiable information in B2B
> SaaS dashboards so you can demo, screenshot, and screen-share without
> leaking customer data. Open source under the MIT license.

Curtain is built and maintained by [Texture](https://texturehq.com) and is the
extension we use internally to make every demo safe. We're open-sourcing it
because every B2B SaaS team needs the same thing.

## Install

Works in **Chrome**, **Arc**, and any Chromium-based browser.

### Option 1: Download and install (no build required)

1. [Download the latest release](https://github.com/TextureHQ/curtain/releases) and unzip.
2. Go to `chrome://extensions` (or `arc://extensions` in Arc).
3. Toggle **Developer mode** on (top-right).
4. Click **Load unpacked** and select the unzipped folder.
5. Click the Curtain icon in your toolbar to open the popup and configure.

### Option 2: Build from source

```bash
git clone https://github.com/TextureHQ/curtain.git
cd curtain
yarn install
yarn --cwd extension build
```

Then follow steps 2–5 above, pointing "Load unpacked" at the `extension/`
directory.

## What it does

Curtain replaces real customer data in your dashboard with deterministic fake
identities — same seed = same fake person every time. It reads `data-pii-type`
and `data-pii-entity` attributes on DOM elements and swaps the content.

```html
<span data-pii-type="full-name" data-pii-entity="contact:ctc_abc123">
  Jane Doe
</span>
```

becomes `Ana Garcia` — reproducible, realistic, safe to screenshot.

**Out of the box** Curtain masks on `*.texturehq.com`, `localhost`, and
`file://`. Add your own domains in the popup's "Allowed Domains" section.

## Using the library (npm)

The data generation engine is published as a standalone npm package. Use it
to build demo-safe tooling outside the extension:

```ts
import { CoreEngine, US_DEMOGRAPHICS_DEFAULT, US_ADDRESS_DEFAULT } from '@texturehq/curtain-core';
import { energy } from '@texturehq/curtain-industries';

const core = new CoreEngine({ demographics: US_DEMOGRAPHICS_DEFAULT, address: US_ADDRESS_DEFAULT });
core.registerIndustry(energy);

const id = core.generateIdentity('my-seed', 'contact:cus_abc123');
// { firstName, lastName, fullName, email, phone, address, organizationName, ... }
```

## Architecture

```
@texturehq/curtain-core         engine: deterministic data generation API
@texturehq/curtain-industries   public industry packs (energy today, healthcare + fintech next)
extension                       the browser extension (Chrome MV3)
```

## Identity attributes

| Type | Example |
| --- | --- |
| `first-name`, `last-name`, `full-name`, `initials` | Names |
| `email`, `phone` | Contact info |
| `avatar` | Photo (replaced with AI-generated avatar) |
| `address`, `city`, `state`, `postal-code`, `city-state`, `city-state-zip`, `coordinates` | Location |
| `organization-name`, `organization-domain`, `organization-logo` | Company |
| `program-name`, `device-name` | Industry-specific |

See [`extension/src/content/content.js`](extension/src/content/content.js)
for the full type → field map.

## Contributing

We welcome industry contributions, bug fixes, and UI improvements. Start
with [CONTRIBUTING.md](./CONTRIBUTING.md) and the
[Industry Authoring Guide](./docs/industry-methodology.md).

## Security

Found a vulnerability? See [SECURITY.md](./SECURITY.md).

## License

MIT. See [`LICENSE`](./LICENSE).
