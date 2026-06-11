import { describe, it, expect } from 'vitest';
import { createSeededRandom } from '../src/rng.js';

describe('createSeededRandom', () => {
  it('returns deterministic output for the same seed', () => {
    const a = createSeededRandom('foo:contact:1');
    const b = createSeededRandom('foo:contact:1');
    for (let i = 0; i < 50; i++) {
      expect(a.nextInt(1000)).toBe(b.nextInt(1000));
    }
  });

  it('returns different sequences for different seeds', () => {
    const a = createSeededRandom('foo:contact:1');
    const b = createSeededRandom('foo:contact:2');
    const seqA = Array.from({ length: 20 }, () => a.nextInt(1000));
    const seqB = Array.from({ length: 20 }, () => b.nextInt(1000));
    expect(seqA).not.toEqual(seqB);
  });

  it('nextFloat stays in [0, 1)', () => {
    const r = createSeededRandom('floattest');
    for (let i = 0; i < 200; i++) {
      const f = r.nextFloat();
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThan(1);
    }
  });

  it('matches the original extension LCG (snapshot)', () => {
    // Snapshot of (seed = "deadbeef:contact:42", first 10 nextInt(1000) values)
    // recorded against the pre-refactor data.js+content.js implementation.
    // If this fails, the LCG/hash has drifted and seeded identities will
    // change. DO NOT update without bumping a seed version.
    const r = createSeededRandom('deadbeef:contact:42');
    const seq = Array.from({ length: 10 }, () => r.nextInt(1000));
    expect(seq).toEqual([537, 444, 999, 652, 884, 270, 580, 32, 605, 686]);
  });
});
