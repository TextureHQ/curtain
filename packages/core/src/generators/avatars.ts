import type {
  AppearanceRange,
  AppearanceRangeWeights,
  AvatarManifest,
  GenderPresentation,
  LogoManifest,
  SeededRandom,
} from '../types.js';

export function assignAppearanceRange(
  rng: SeededRandom,
  weights: AppearanceRangeWeights,
): AppearanceRange {
  const roll = rng.nextFloat();
  if (roll < weights.light) return 'light';
  if (roll < weights.light + weights.medium) return 'medium';
  return 'dark';
}

/**
 * Resolve an avatar URL given the manifest. The `resolveUrl` callback gives the
 * runtime (Chrome extension, Node test, etc.) a chance to translate a relative
 * path into an absolute one (e.g. `chrome.runtime.getURL(...)`).
 */
export function resolveAvatarUrl(
  rng: SeededRandom,
  gender: GenderPresentation,
  appearance: AppearanceRange,
  manifest: AvatarManifest | undefined,
  placeholder: string,
  resolveUrl: (relativePath: string) => string,
): string {
  if (!manifest?.buckets) return placeholder;

  const tryBuckets: string[] = [
    `${gender}_${appearance}`,
    `${gender}_medium`,
    'neutral_medium',
  ];

  for (const key of tryBuckets) {
    const files = manifest.buckets[key];
    if (files && files.length > 0) {
      const file = files[rng.nextInt(files.length)];
      try {
        return resolveUrl(`${manifest.basePath}/${key}/${file}`);
      } catch {
        return placeholder;
      }
    }
  }
  return placeholder;
}

export function resolveLogoUrl(
  orgId: string,
  manifest: LogoManifest | undefined,
  placeholder: string,
  resolveUrl: (relativePath: string) => string,
): string {
  const file = manifest?.logos?.[orgId];
  if (!file) return placeholder;
  try {
    return resolveUrl(`${manifest!.basePath}/${file}`);
  } catch {
    return placeholder;
  }
}
