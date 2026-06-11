import type { AddressConfig, SeededRandom } from '../types.js';
import { selectWeighted, selectWeightedKey } from '../rng.js';

export interface GeneratedAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

function generateHouseNumber(rng: SeededRandom): number {
  const roll = rng.nextFloat();
  if (roll < 0.15) return rng.nextInt(90) + 10;
  if (roll < 0.6) return rng.nextInt(900) + 100;
  return rng.nextInt(8000) + 1000;
}

export function generateAddress(
  rng: SeededRandom,
  config: AddressConfig,
): GeneratedAddress {
  if (config.streetBases.length === 0) {
    throw new Error('generateAddress: config.streetBases must be non-empty');
  }
  if (Object.keys(config.regions).length === 0) {
    throw new Error('generateAddress: config.regions must be non-empty');
  }
  const houseNumber = generateHouseNumber(rng);
  const base = config.streetBases[rng.nextInt(config.streetBases.length)];
  const suffix = selectWeighted(rng, config.streetSuffixes).suffix;
  const streetName = `${base} ${suffix}`;

  const unitProbability = config.unitProbability ?? 0.3;
  let unit: string | null = null;
  if (rng.nextFloat() < unitProbability) {
    const designator = selectWeighted(rng, config.unitDesignators).format;
    let unitNumber: string;
    if (rng.nextFloat() < 0.75) {
      unitNumber = String(rng.nextInt(799) + 101);
    } else {
      const num = rng.nextInt(20) + 1;
      const letter = String.fromCharCode(65 + rng.nextInt(4));
      unitNumber = `${num}${letter}`;
    }
    unit = designator === '#' ? `#${unitNumber}` : `${designator} ${unitNumber}`;
  }

  const primaryRegionKey = selectWeightedKey(rng, config.regions);
  const primaryRegion = config.regions[primaryRegionKey]!;
  const city = primaryRegion.cities[rng.nextInt(primaryRegion.cities.length)]!;

  const sameRegionStateProbability = config.sameRegionStateProbability ?? 0.8;
  let state: string;
  if (rng.nextFloat() < sameRegionStateProbability) {
    state = primaryRegion.states[rng.nextInt(primaryRegion.states.length)]!;
  } else {
    const otherKey = selectWeightedKey(rng, config.regions);
    const other = config.regions[otherKey]!;
    state = other.states[rng.nextInt(other.states.length)]!;
  }

  const zipRange = primaryRegion.zipRange ?? { min: 10000, max: 99999 };
  const postalCode = String(
    rng.nextInt(zipRange.max - zipRange.min) + zipRange.min,
  ).padStart(5, '0');

  const address = unit
    ? `${houseNumber} ${streetName}, ${unit}`
    : `${houseNumber} ${streetName}`;

  return { address, city, state, postalCode };
}
