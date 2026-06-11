/**
 * @texturehq/curtain-core — public type surface.
 *
 * An "industry" is a registered bundle of data (organizations, programs,
 * devices) plus optional configuration overrides. Industries can be registered
 * at runtime via {@link CoreEngine.registerIndustry}.
 */

export type GenderPresentation = 'male' | 'female' | 'neutral';
export type AppearanceRange = 'light' | 'medium' | 'dark';

export interface FirstNameEntry {
  name: string;
  gender: GenderPresentation;
}

export interface NameBucketConfig {
  /** Relative weight within demographic mixing. Weights need not sum to 1. */
  weight: number;
  firstNames: ReadonlyArray<FirstNameEntry>;
  lastNames: ReadonlyArray<string>;
}

/**
 * Configurable demographic mixing rules.
 *
 * `sameBucketProbability` controls how often the last name is drawn from the
 * same bucket as the first name (vs. cross-bucket). Default: 0.75.
 */
export interface DemographicsConfig {
  buckets: Record<string, NameBucketConfig>;
  mixingRules?: {
    sameBucketProbability?: number;
  };
}

export interface StreetSuffix {
  suffix: string;
  weight: number;
}

export interface UnitDesignator {
  format: string;
  weight: number;
}

export interface LocationRegion {
  weight: number;
  states: ReadonlyArray<string>;
  cities: ReadonlyArray<string>;
  /** Optional ZIP-prefix range used to bias postal codes. */
  zipRange?: { min: number; max: number };
}

export interface AddressConfig {
  streetBases: ReadonlyArray<string>;
  streetSuffixes: ReadonlyArray<StreetSuffix>;
  unitDesignators: ReadonlyArray<UnitDesignator>;
  regions: Record<string, LocationRegion>;
  /** Probability that an address has a unit designator. Default: 0.30. */
  unitProbability?: number;
  /** Probability the city's state is drawn from the same region. Default: 0.80. */
  sameRegionStateProbability?: number;
}

export interface OrganizationEntry {
  id: string;
  name: string;
  /** Industry-specific organisation type, e.g. "coop", "iou", "hospital". */
  type: string;
  /** Optional logo filename relative to {@link IndustryAssets.logosBasePath}. */
  logoFile?: string;
}

export interface ProgramBucket {
  weight: number;
  names: ReadonlyArray<string>;
}

export interface IndustryAssets {
  /** Optional base path for organisation logos (extension-managed URL). */
  logosBasePath?: string;
  /** Optional base path for avatar images (extension-managed URL). */
  avatarsBasePath?: string;
}

/**
 * Industry configuration — what makes "energy" different from "healthcare".
 *
 * The demographic pool, address pool, etc. live on the core engine and are
 * shared by default. An industry can override any of them.
 */
export interface IndustryConfig {
  name: string;
  organizations: ReadonlyArray<OrganizationEntry>;
  programs: Record<string, ProgramBucket>;
  devices: ReadonlyArray<string>;
  /** Optional per-industry demographic override. */
  demographics?: DemographicsConfig;
  /** Optional per-industry address override. */
  address?: AddressConfig;
  /** Optional asset paths (logos, avatars). */
  assets?: IndustryAssets;
  /** Email domain pool used for generated contacts. Defaults to a generic pool. */
  emailDomains?: ReadonlyArray<string>;
}

export interface AvatarManifest {
  basePath: string;
  buckets: Record<string, ReadonlyArray<string>>;
}

export interface LogoManifest {
  basePath: string;
  logos: Record<string, string>;
}

export interface AppearanceRangeWeights {
  light: number;
  medium: number;
  dark: number;
}

export interface CoreEngineOptions {
  /**
   * Default demographic pool used when an industry does not provide its own.
   * The extension supplies a US-representative default; library users can
   * pass any pool that satisfies {@link DemographicsConfig}.
   */
  demographics?: DemographicsConfig;
  /** Default address generator pool used when an industry does not override. */
  address?: AddressConfig;
  /** Default appearance-range weights for avatar selection. */
  appearance?: AppearanceRangeWeights;
  /** Avatar manifest used by the extension to resolve avatar URLs. */
  avatarManifest?: AvatarManifest;
  /** Logo manifest used by the extension to resolve logo URLs. */
  logoManifest?: LogoManifest;
  /** Placeholder data-URL for avatars (when manifest lookups fail). */
  placeholderAvatar?: string;
  /** Placeholder data-URL for logos (when manifest lookups fail). */
  placeholderLogo?: string;
}

export interface Identity {
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  cityState: string;
  cityStateZip: string;
  coordinates: string;
  organizationName: string;
  organizationDomain: string;
  organizationLogo: string;
  programName: string;
  deviceName: string;
  genderPresentation: GenderPresentation;
  appearanceRange: AppearanceRange;
  avatar: string;
}

export interface GenerateOptions {
  /** Industry name. Falls back to the engine's default industry. */
  industry?: string;
}

export interface SeededRandom {
  nextInt(max: number): number;
  nextFloat(): number;
}
