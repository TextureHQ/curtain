# Contributing to Curtain

Thanks for your interest! We welcome:

- **New industry packs** (healthcare, fintech, logistics, …)
- **Bug fixes** in the extension or the data engine
- **UI / accessibility improvements** to the popup
- **Documentation** clarifications, examples, screencasts

## Setup

```bash
git clone <your-fork>
cd mono
yarn install
yarn --cwd extension build           # builds the data bundle
yarn --cwd packages/core test       # 11 tests
yarn --cwd packages/industries test # 3 tests
yarn --cwd extension test            # 5 tests on the data bundle
```

Load the extension via Chrome → `chrome://extensions` → Load unpacked →
select `extension`.

## Adding a new industry

See the full process in [docs/industry-methodology.md](./docs/industry-methodology.md).

Quick checklist:

1. Research 50+ real orgs in the industry to seed naming-style references.
2. Generate fictional org names + logos using Claude + Gemini.
3. Validate via collision check (no trademark hits, no real-company matches).
4. Drop org PNGs into `extension/src/shared/logos/` as `org_NNN.png`.
5. Add `packages/industries/src/<industry>/{organizations,programs,index}.ts`.
6. Add a test under `packages/industries/test/<industry>.test.ts`.
7. Re-export from `packages/industries/src/index.ts`.

## Code style

- TypeScript strict mode in the two packages.
- No `any`. If a type is hard to express, talk to us in the PR.
- Tests run via vitest (packages) or `node --test` (extension data bundle).
- Conventional commits: `feat(curtain): …`, `fix(curtain-core): …`.

## Pull requests

- One concern per PR.
- Update docs alongside code changes.
- CI must be green. Local check: `yarn workspaces foreach --include '@texturehq/curtain*' run test`.

## Code of conduct

Be kind. Disagreements happen — keep them about the work, not the person.

## License

By contributing you agree your contribution will be licensed under the MIT
license used by this repository.
