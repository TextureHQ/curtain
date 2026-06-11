# Industry Authoring Methodology

> How Texture built the **energy** industry data pack for Curtain, and how to
> apply the same process to a new industry (healthcare, fintech, etc.).
>
> This document is the canonical reference for industry contributions to
> `@texturehq/curtain-industries`.

## Phases

1. **Research** — collect ~50–100 real organisations and a representative
   logo sample. For energy we used USDA REA co-op directories, EIA IOU lists,
   APPA municipal-utility rosters, and public DER/cleantech rosters.
2. **Generate** — produce fictional org names and logos that *look* real but
   are not real.
3. **Validate** — confirm no trademark collisions and that quality matches
   the energy reference bar.
4. **Package** — ship as a sub-export of `@texturehq/curtain-industries`.

## 1. Research

For each org category in the industry (e.g. for energy: co-ops, IOUs,
municipals, DER vendors), gather:

- 30–50 **real org names** for naming-style reference.
- 10–20 **real logos** in a single image (collage of 4–8 logos per row, ~512px
  per logo). These become the visual prompt input.

> Energy reference inputs are not redistributed publicly because they include
> trademarked logos. Keep your reference collateral in a private folder
> (`extension/private-refs/<industry>/`) and `.gitignore` it.

## 2. Generate

### Names

Use Claude (or any strong LLM) with this template:

```text
You are helping me build fictional company names for a software demo.
The companies should sound realistic to people who work in <INDUSTRY> but
must NOT match any real company. Generate <N> names for the category
"<CATEGORY>". Use these real names as a style reference:

<REAL_NAME_LIST>

Constraints:
- 2–4 words.
- Use plausible geographic and descriptive elements.
- Avoid words associated with real major brands ("National Grid", "PG&E", etc.).
- Output one name per line. No numbering.
```

Pass the model's output through a manual collision check (see § Validation).

### Logos

Use Gemini (or any strong image model) with the real-logo collage uploaded:

```text
Generate <N> fictional company logos in the same visual style as the attached
reference. Vary colour palettes and typography. Each logo should:
- Be a square composition on a flat background.
- Include a wordmark or compact symbol.
- Look like a real <INDUSTRY> company from the United States.
- Avoid any text or symbol that appears in the reference logos.
```

Output each logo as a 512×512 PNG named `org_NNN.png` matching the org IDs in
the data pack. Place them in `extension/src/shared/logos/` (the extension
ships them as static assets).

## 3. Validate

### Trademark / collision check

- Search each generated name against the real-name research list. Reject
  exact matches and near-matches (one-edit distance + same industry token).
- Spot-check the top 10 names via USPTO TESS and Google. Reject anything
  with an active trademark filing or a real-company hit on the first page.
- For names with stems like "Northstar" / "Pacific" that genuinely appear in
  many real companies, prefer the version that adds a distinguishing
  geographic or functional modifier.

### Quality criteria

A name is acceptable if it satisfies ALL of:

- [ ] Reads as plausible to a domain expert.
- [ ] No real company exists with that exact name in the United States.
- [ ] No active US trademark filing.
- [ ] Stylistically consistent with peer names in the same category.
- [ ] Does not include the words "Texture" or any Texture customer name.

A logo is acceptable if it satisfies ALL of:

- [ ] Visually consistent with the category (e.g. utility logos look
      utility-shaped; cleantech logos look cleantech-shaped).
- [ ] No text or symbol from a reference logo is reproduced.
- [ ] 512×512 PNG, transparent or flat background.
- [ ] File size <100KB after optimisation.

## 4. Package

1. Create `packages/industries/src/<industry>/organizations.ts` matching
   the `OrganizationEntry[]` shape from `@texturehq/curtain-core`.
2. Create `packages/industries/src/<industry>/programs.ts` with
   `Record<string, ProgramBucket>` and a device list.
3. Re-export an `IndustryConfig` named after the industry from
   `packages/industries/src/<industry>/index.ts`.
4. Add the export to the top-level `packages/industries/src/index.ts`.
5. Drop logo PNGs in `extension/src/shared/logos/` named `org_NNN.png`.
6. Add a test under `packages/industries/test/<industry>.test.ts`
   asserting org count, ID uniqueness, and engine-integration.

## Worked example: energy

| Stage | Outcome |
| --- | --- |
| Research | 2,906 municipal utilities + 834 co-ops + 168 IOUs (USDA REA, EIA, APPA, public DER lists) |
| Generation | 60 fictional orgs across coop / IOU / municipal / DER categories |
| Validation | 0 collisions with real names; 60 unique logos generated |
| Package | `packages/industries/src/energy/`, `org_001.png` … `org_060.png` |

Time investment: ~6 hours from scratch. Subsequent industries should be
faster because the prompts and validation checklist are now templated.

## When to escalate to a human

- More than 2 of every 10 generated names collide → category is too narrow,
  expand the reference list.
- Logo style drifts off-brand for the industry → reshoot the reference
  collage with more representative examples.
- Trademark hits exceed 5% of the batch → broaden modifier vocabulary.

## See also

- [`@texturehq/curtain-core`](../../curtain-core/README.md) — engine API.
- [`@texturehq/curtain-industries`](../../curtain-industries/README.md) —
  industry pack format.
- Phase 1 plan: [Curtain Open Source — Linear](https://linear.app/texture/project/curtain-open-source-77d177bdd6fd/overview).
