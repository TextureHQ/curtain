# Curtain Open Source Roadmap

## Overview
Transform Curtain from a Texture-internal tool into an open source platform for generating realistic demo data across industries.

## Architecture

```
@texturehq/curtain-core        # Data generation engine + industry registration API
@texturehq/curtain-industries  # Public industry data packs (energy, healthcare, etc.)  
@texturehq/curtain-extension   # Browser extension (bundles core + all public industries)
```

**Distribution Strategy:**
- **Chrome/Safari Web Store:** Extension with bundled public industries
- **NPM Library:** Core system for programmatic integration
- **Private Industries:** Companies register custom data via `core.registerIndustry()` API

---

## Phase 1: Foundation & Core Extraction
**Goal:** Extract reusable core system and establish industry segment architecture

### Milestone 1.1: Core System Extraction
- [ ] Extract data generation logic from current extension into `@texturehq/curtain-core`
- [ ] Create industry registration API: `core.registerIndustry(name, config)`
- [ ] Design industry segment schema (organizations, programs, devices, demographics)
- [ ] Implement deterministic generation with configurable ratios
- [ ] Add TypeScript definitions for industry configs

### Milestone 1.2: Industry Segment Refactor  
- [ ] Convert current energy data to industry segment format
- [ ] Create `@texturehq/curtain-industries` package with energy industry as reference
- [ ] **Document energy industry creation process** (logo generation prompts, name validation, research sources)
- [ ] Update extension to use new industry system
- [ ] Maintain full backward compatibility with existing Texture usage
- [ ] Validate data quality matches current extension output

### Milestone 1.3: Generic Domain Configuration
- [ ] Remove hardcoded `texturehq.com` domain restrictions
- [ ] Add configurable domain patterns in extension settings
- [ ] Update manifest.json host_permissions to be pattern-based
- [ ] Test extension works on generic localhost and file:// URLs

---

## Phase 2: Public Repository & Store Preparation
**Goal:** Open source the project and prepare for public distribution

### Milestone 2.1: Repository Setup
- [ ] Create `texturehq/curtain` public GitHub repository
- [ ] Set up CI/CD pipeline for NPM package publishing
- [ ] Configure automated extension building for store submission
- [ ] Add comprehensive documentation and contribution guidelines
- [ ] Set up issue templates for industry contributions

### Milestone 2.2: Store Asset Preparation
- [ ] Remove Texture-specific branding from extension
- [ ] Create generic extension icons and promotional assets
- [ ] Write store descriptions emphasizing demo data utility
- [ ] Prepare Chrome Web Store developer account
- [ ] Create Safari App Store Connect assets

### Milestone 2.3: Legal & Licensing
- [ ] Choose appropriate open source license (MIT recommended)
- [ ] Ensure energy industry data has no IP conflicts
- [ ] Prepare store submission policies compliance
- [ ] Document contribution legal requirements

---

## Phase 3: Multi-Industry Expansion  
**Goal:** Add 2-3 additional industries to demonstrate extensibility

### Milestone 3.1: Healthcare Industry
- [ ] Research realistic healthcare organization types (hospital, clinic, insurer, healthtech)
- [ ] Create healthcare program names (patient-engagement, telehealth, clinical-trials)
- [ ] Add healthcare device types (Patient Monitor, MRI Scanner, Infusion Pump)
- [ ] Validate with healthcare industry professionals

### Milestone 3.2: Fintech Industry
- [ ] Research fintech organization types (bank, credit-union, payments, neobank)
- [ ] Create fintech program names (lending, digital-wallet, fraud-prevention)
- [ ] Add fintech device/service types (Payment Terminal, API Gateway, Mobile App)
- [ ] Ensure regulatory compliance in naming conventions

### Milestone 3.3: Extension Multi-Industry Support
- [ ] Add industry selection UI to extension popup
- [ ] Implement runtime industry switching
- [ ] Bundle all public industries in store extension
- [ ] Add industry indicators in masked content (subtle badges/colors)

---

## Phase 4: Store Launch & Community Building
**Goal:** Launch on app stores and establish contributor community

### Milestone 4.1: Chrome Web Store Launch
- [ ] Submit extension for Chrome Web Store review
- [ ] Create landing page with installation instructions
- [ ] Prepare demo videos showing multi-industry usage
- [ ] Launch announcement blog post

### Milestone 4.2: Safari App Store Launch
- [ ] Port extension to Safari using Safari Web Extension framework
- [ ] Submit to Safari App Store (Mac App Store)
- [ ] Cross-platform testing and bug fixes
- [ ] Update documentation for Safari-specific installation

### Milestone 4.3: Community & Contributions
- [ ] Create contribution guidelines for new industries
- [ ] **Document industry creation methodology** (logo generation, name validation, research process)
- [ ] Set up industry validation process for PRs
- [ ] Establish maintainer review process
- [ ] Create industry request issue template

---

## Industry Creation Guide (Draft)

### Research Phase
1. **Study real industry players** - Collect 20-30 real organization names, logos, program names
2. **Identify naming patterns** - Regional patterns, common suffixes, industry terminology
3. **Understand org types** - Different categories within industry (co-ops vs IOUs in energy)

### Generation Phase  
1. **AI-assisted name generation** - Use Claude/GPT with real examples as context
2. **Collision detection** - De-duplicate against real companies (crucial for legal safety)
3. **Logo creation process** - Upload real logos to Gemini/Claude, generate similar styles
4. **Program/device name research** - Study real marketing names, create realistic alternatives

### Validation Phase
1. **Industry expert review** - Get feedback from domain professionals  
2. **Legal clearance** - Ensure no trademark conflicts
3. **Quality standards** - Names should be realistic, not obviously fake

### Technical Implementation
1. **Follow schema format** - Match `@texturehq/curtain-industries` structure
2. **Include all asset types** - Organizations, programs, devices, logos
3. **Demographic ratios** - Research appropriate geographic/cultural distributions

---

## Phase 5: Advanced Features & Library Growth
**Goal:** Enhanced functionality and broader adoption

### Milestone 5.1: Advanced Data Generation
- [ ] Add configurable demographic ratios per industry
- [ ] Implement realistic data relationships (manager hierarchies, org charts)
- [ ] Add temporal data generation (historical trends, seasonality)
- [ ] Support for complex data types (financial metrics, health data)

### Milestone 5.2: Library Ecosystem
- [ ] Create React/Vue component library for quick integration
- [ ] Add REST API mode for language-agnostic usage
- [ ] Develop CLI tool for bulk data generation
- [ ] Create Figma/Sketch plugins for design mockups

### Milestone 5.3: Enterprise Features
- [ ] Add industry-specific compliance modes (HIPAA, SOX, GDPR)
- [ ] Implement data export formats (CSV, JSON, SQL)
- [ ] Create enterprise documentation and case studies
- [ ] Support for custom logo/branding in generated orgs

---

## Success Metrics

**Phase 1-2:** Technical Foundation
- [ ] Core system passes all existing Texture use cases
- [ ] Energy industry data maintains current quality standards
- [ ] Extension works on 3+ different domains

**Phase 3-4:** Market Validation  
- [ ] 3+ industries with realistic, validated data
- [ ] 1,000+ Chrome Web Store installs in first 30 days
- [ ] 5+ community-contributed industry segments

**Phase 5:** Ecosystem Growth
- [ ] 10+ industries available
- [ ] 50+ companies using library integration
- [ ] Active contributor community (10+ regular contributors)

---

## Integration with Texture

**Current State:** Texture demo-data package imports private energy data
**Future State:** Texture demo-data package imports `@texturehq/curtain-core` + registers enhanced energy data

**Migration Path:**
1. Phase 1: Texture uses new core system with existing private data
2. Phase 2-3: Texture contributes generic energy data to public industries
3. Phase 4+: Texture maintains private enhancements via `registerIndustry()` API

This ensures Texture gets all open source improvements while keeping competitive energy data private.