import type {
  DemographicsConfig,
  GenderPresentation,
  SeededRandom,
} from '../types.js';
import { selectWeightedKey } from '../rng.js';

export interface GeneratedName {
  firstName: string;
  lastName: string;
  genderPresentation: GenderPresentation;
}

/**
 * Generate a {first, last} name pair using configurable demographic mixing.
 *
 * Default `sameBucketProbability` is 0.75 — chosen to produce realistic
 * within-demographic name pairings while still allowing cross-cultural mixes.
 */
export function generateNamePair(
  rng: SeededRandom,
  demographics: DemographicsConfig,
): GeneratedName {
  const buckets = demographics.buckets;
  const sameBucketProbability =
    demographics.mixingRules?.sameBucketProbability ?? 0.75;

  const primaryBucketKey = selectWeightedKey(rng, buckets);
  const primary = buckets[primaryBucketKey];
  if (!primary) {
    throw new Error(`generateNamePair: missing bucket "${primaryBucketKey}"`);
  }

  const firstEntry = primary.firstNames[rng.nextInt(primary.firstNames.length)];
  if (!firstEntry) {
    throw new Error(
      `generateNamePair: bucket "${primaryBucketKey}" has no firstNames`,
    );
  }

  const useSameBucket = rng.nextFloat() < sameBucketProbability;
  const lastBucketKey = useSameBucket
    ? primaryBucketKey
    : selectWeightedKey(rng, buckets);
  const lastBucket = buckets[lastBucketKey] ?? primary;
  const lastName =
    lastBucket.lastNames[rng.nextInt(lastBucket.lastNames.length)];
  if (!lastName) {
    throw new Error(
      `generateNamePair: bucket "${lastBucketKey}" has no lastNames`,
    );
  }

  return {
    firstName: firstEntry.name,
    lastName,
    genderPresentation: firstEntry.gender,
  };
}
