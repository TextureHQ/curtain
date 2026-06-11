import type {
  AppearanceRangeWeights,
  CoreEngineOptions,
  DemographicsConfig,
  GenerateOptions,
  Identity,
  IndustryConfig,
  SeededRandom,
} from './types.js';
import { createSeededRandom } from './rng.js';
import { generateNamePair } from './generators/names.js';
import { generateAddress } from './generators/address.js';
import { generateProgramName } from './generators/programs.js';
import { selectOrganization } from './generators/organizations.js';
import {
  assignAppearanceRange,
  resolveAvatarUrl,
  resolveLogoUrl,
} from './generators/avatars.js';

const DEFAULT_APPEARANCE_WEIGHTS: AppearanceRangeWeights = {
  light: 0.35,
  medium: 0.35,
  dark: 0.3,
};

const DEFAULT_EMAIL_DOMAINS = ['email.example', 'mail.example', 'inbox.example'];

const DEFAULT_PLACEHOLDER_AVATAR =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23E5E7EB"/%3E%3C/svg%3E';
const DEFAULT_PLACEHOLDER_LOGO =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23E5E7EB"/%3E%3C/svg%3E';

/**
 * `CoreEngine` is the public API surface of `@texturehq/curtain-core`.
 *
 * Usage:
 *
 *   const core = new CoreEngine({ demographics, address });
 *   core.registerIndustry(energy);
 *   const identity = core.generateIdentity("seed", "contact:abc123");
 *
 * In the Curtain extension, the engine is constructed at content-script start
 * with the manifest-bundled industries (currently just "energy"). Future
 * deployments may pass private industries via `registerIndustry()`.
 */
export class CoreEngine {
  private readonly industries = new Map<string, IndustryConfig>();
  private readonly defaultDemographics?: DemographicsConfig;
  private readonly options: Required<
    Pick<
      CoreEngineOptions,
      'appearance' | 'placeholderAvatar' | 'placeholderLogo'
    >
  > &
    CoreEngineOptions;
  private defaultIndustryName?: string;

  /**
   * URL resolver — the extension overrides this with `chrome.runtime.getURL`
   * so generated identities contain extension-scoped URLs. Pure-JS callers
   * (tests, Node) get an identity function.
   */
  resolveUrl: (relativePath: string) => string = (p) => p;

  constructor(options: CoreEngineOptions = {}) {
    this.defaultDemographics = options.demographics;
    this.options = {
      ...options,
      appearance: options.appearance ?? DEFAULT_APPEARANCE_WEIGHTS,
      placeholderAvatar: options.placeholderAvatar ?? DEFAULT_PLACEHOLDER_AVATAR,
      placeholderLogo: options.placeholderLogo ?? DEFAULT_PLACEHOLDER_LOGO,
    };
  }

  /**
   * Register an industry. The first industry registered becomes the default.
   */
  registerIndustry(industry: IndustryConfig): void {
    if (!industry.name) {
      throw new Error('registerIndustry: industry.name is required');
    }
    this.industries.set(industry.name, industry);
    if (!this.defaultIndustryName) {
      this.defaultIndustryName = industry.name;
    }
  }

  setDefaultIndustry(name: string): void {
    if (!this.industries.has(name)) {
      throw new Error(`setDefaultIndustry: unknown industry "${name}"`);
    }
    this.defaultIndustryName = name;
  }

  getIndustry(name: string): IndustryConfig | undefined {
    return this.industries.get(name);
  }

  listIndustries(): string[] {
    return Array.from(this.industries.keys());
  }

  /**
   * Generate a deterministic identity from a seed + entity key.
   *
   * The same seed+entityKey always returns the same identity. The seed
   * typically rotates when the user clicks "Reset Identities".
   */
  generateIdentity(
    seed: string,
    entityKey: string,
    opts: GenerateOptions = {},
  ): Identity {
    const industry = this.resolveIndustry(opts.industry);
    const rng = createSeededRandom(`${seed}:${entityKey}`);

    const demographics =
      industry.demographics ?? this.defaultDemographics;
    if (!demographics) {
      throw new Error(
        'CoreEngine.generateIdentity: no demographics configured. ' +
          'Pass `demographics` to CoreEngine or include it on the industry.',
      );
    }

    const address = industry.address ?? this.options.address;
    if (!address) {
      throw new Error(
        'CoreEngine.generateIdentity: no address pool configured. ' +
          'Pass `address` to CoreEngine or include it on the industry.',
      );
    }

    const { firstName, lastName, genderPresentation } = generateNamePair(
      rng,
      demographics,
    );
    if (!firstName || !lastName) {
      throw new Error(
        `CoreEngine.generateIdentity: generateNamePair returned empty name (firstName="${firstName}", lastName="${lastName}")`,
      );
    }
    const appearanceRange = assignAppearanceRange(rng, this.options.appearance);
    const generatedAddress = generateAddress(rng, address);

    const org = selectOrganization(rng, industry.organizations);
    const orgDomain =
      org.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-') + '.example';
    const orgLogo = resolveLogoUrl(
      org.id,
      this.options.logoManifest,
      this.options.placeholderLogo,
      this.resolveUrl,
    );

    const programName = generateProgramName(rng, industry.programs);
    const deviceName =
      industry.devices.length > 0
        ? industry.devices[rng.nextInt(industry.devices.length)]!
        : 'Unknown Device';

    const emailDomains =
      industry.emailDomains && industry.emailDomains.length > 0
        ? industry.emailDomains
        : DEFAULT_EMAIL_DOMAINS;
    const emailDomain = emailDomains[rng.nextInt(emailDomains.length)]!;

    const avatar = resolveAvatarUrl(
      rng,
      genderPresentation,
      appearanceRange,
      this.options.avatarManifest,
      this.options.placeholderAvatar,
      this.resolveUrl,
    );

    return {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      initials: `${firstName[0]}${lastName[0]}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`,
      phone: `(555) ${String(rng.nextInt(900) + 100)}-${String(
        rng.nextInt(9000) + 1000,
      )}`,
      address: generatedAddress.address,
      city: generatedAddress.city,
      state: generatedAddress.state,
      postalCode: generatedAddress.postalCode,
      cityState: `${generatedAddress.city}, ${generatedAddress.state}`,
      cityStateZip: `${generatedAddress.city}, ${generatedAddress.state} ${generatedAddress.postalCode}`,
      coordinates: `${(rng.nextFloat() * 20 + 30).toFixed(4)}, ${(
        rng.nextFloat() * -50 -
        70
      ).toFixed(4)}`,
      organizationName: org.name,
      organizationDomain: orgDomain,
      organizationLogo: orgLogo,
      programName,
      deviceName,
      genderPresentation,
      appearanceRange,
      avatar,
    };
  }

  /**
   * Generate N identities under a shared seed. Useful for programmatic demo
   * generation outside the extension (e.g. fixture seeding).
   */
  generateContacts(
    seed: string,
    count: number,
    opts: GenerateOptions = {},
  ): Identity[] {
    const out: Identity[] = [];
    for (let i = 0; i < count; i++) {
      out.push(this.generateIdentity(seed, `contact:${i}`, opts));
    }
    return out;
  }

  private resolveIndustry(name?: string): IndustryConfig {
    const target = name ?? this.defaultIndustryName;
    if (!target) {
      throw new Error(
        'CoreEngine: no industry specified and no default registered',
      );
    }
    const industry = this.industries.get(target);
    if (!industry) {
      throw new Error(`CoreEngine: unknown industry "${target}"`);
    }
    return industry;
  }
}

// Re-exports for downstream consumers (extension build, tests).
export { createSeededRandom } from './rng.js';
export type { SeededRandom };
