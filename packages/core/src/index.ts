export { CoreEngine, createSeededRandom } from './engine.js';
export type {
  AppearanceRange,
  AppearanceRangeWeights,
  AvatarManifest,
  AddressConfig,
  CoreEngineOptions,
  DemographicsConfig,
  FirstNameEntry,
  GenderPresentation,
  GenerateOptions,
  Identity,
  IndustryAssets,
  IndustryConfig,
  LocationRegion,
  LogoManifest,
  NameBucketConfig,
  OrganizationEntry,
  ProgramBucket,
  SeededRandom,
  StreetSuffix,
  UnitDesignator,
} from './types.js';

// Re-export default presets so library users can opt in without re-deriving.
export { US_DEMOGRAPHICS_DEFAULT } from './presets/us-demographics.js';
export { US_ADDRESS_DEFAULT } from './presets/us-address.js';
