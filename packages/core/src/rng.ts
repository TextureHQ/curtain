import type { SeededRandom } from './types.js';

/**
 * Deterministic seeded RNG.
 *
 * Algorithm preserved bit-for-bit from the original Curtain extension so that
 * the same `(seed, entityKey)` pair always produces the same identity across
 * versions. DO NOT change the hash or LCG constants without bumping the
 * extension's seed-version and invalidating cached identities.
 */
export function createSeededRandom(seed: string): SeededRandom {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // force i32
  }

  let state = Math.abs(hash);

  return {
    nextInt(max: number): number {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return Math.floor((state / 4294967296) * max);
    },
    nextFloat(): number {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    },
  };
}

/** Select a value from a weighted list. */
export function selectWeighted<T extends { weight: number }>(
  rng: SeededRandom,
  items: ReadonlyArray<T>,
): T {
  if (items.length === 0) {
    throw new Error('selectWeighted: empty items array');
  }
  const roll = rng.nextFloat();
  let cumulative = 0;
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  for (const item of items) {
    cumulative += item.weight / total;
    if (roll < cumulative) {
      return item;
    }
  }
  return items[items.length - 1]!;
}

/**
 * Select a key from a `Record<string, { weight }>` by weight.
 * Normalises weights so the buckets need not sum to 1.
 */
export function selectWeightedKey<T extends { weight: number }>(
  rng: SeededRandom,
  buckets: Record<string, T>,
): string {
  const entries = Object.entries(buckets);
  if (entries.length === 0) {
    throw new Error('selectWeightedKey: empty buckets');
  }
  const total = entries.reduce((sum, [, b]) => sum + b.weight, 0);
  const roll = rng.nextFloat();
  let cumulative = 0;
  for (const [key, bucket] of entries) {
    cumulative += bucket.weight / total;
    if (roll < cumulative) {
      return key;
    }
  }
  return entries[entries.length - 1]![0];
}
