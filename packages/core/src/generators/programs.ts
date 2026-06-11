import type { ProgramBucket, SeededRandom } from '../types.js';
import { selectWeightedKey } from '../rng.js';

export function generateProgramName(
  rng: SeededRandom,
  buckets: Record<string, ProgramBucket>,
): string {
  if (Object.keys(buckets).length === 0) {
    return 'Unknown Program';
  }
  const key = selectWeightedKey(rng, buckets);
  const bucket = buckets[key]!;
  return bucket.names[rng.nextInt(bucket.names.length)] ?? 'Unknown Program';
}
