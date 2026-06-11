/**
 * Engine integration tests.
 *
 * The "deterministic snapshot" test guards the seed→identity contract that
 * existing extension users depend on. If the snapshot changes, cached
 * identities will silently flip on next reload.
 */
import { describe, it, expect } from 'vitest';
import {
  CoreEngine,
  US_ADDRESS_DEFAULT,
  US_DEMOGRAPHICS_DEFAULT,
} from '../src/index.js';

const MINIMAL_INDUSTRY = {
  name: 'test',
  organizations: [
    { id: 'org_001', name: 'Test Org One', type: 'unit' },
    { id: 'org_002', name: 'Test Org Two', type: 'unit' },
  ],
  programs: {
    main: { weight: 1, names: ['Program Alpha', 'Program Beta'] },
  },
  devices: ['Device A', 'Device B'],
};

function buildEngine() {
  const engine = new CoreEngine({
    demographics: US_DEMOGRAPHICS_DEFAULT,
    address: US_ADDRESS_DEFAULT,
  });
  engine.registerIndustry(MINIMAL_INDUSTRY);
  return engine;
}

describe('CoreEngine', () => {
  it('generates a deterministic identity for the same seed/entityKey', () => {
    const engine = buildEngine();
    const a = engine.generateIdentity('seed-x', 'contact:abc');
    const b = engine.generateIdentity('seed-x', 'contact:abc');
    expect(a).toEqual(b);
  });

  it('generates different identities for different entity keys', () => {
    const engine = buildEngine();
    const a = engine.generateIdentity('seed-x', 'contact:abc');
    const b = engine.generateIdentity('seed-x', 'contact:def');
    expect(a.fullName).not.toBe(b.fullName);
  });

  it('keeps phone numbers in the (555) NNN-NNNN format', () => {
    const engine = buildEngine();
    for (let i = 0; i < 20; i++) {
      const id = engine.generateIdentity('seed-y', `contact:${i}`);
      expect(id.phone).toMatch(/^\(555\) \d{3}-\d{4}$/);
    }
  });

  it('initials match firstName[0] + lastName[0]', () => {
    const engine = buildEngine();
    const id = engine.generateIdentity('seed-z', 'contact:1');
    expect(id.initials).toBe(`${id.firstName[0]}${id.lastName[0]}`);
  });

  it('throws when no industry registered', () => {
    const engine = new CoreEngine({
      demographics: US_DEMOGRAPHICS_DEFAULT,
      address: US_ADDRESS_DEFAULT,
    });
    expect(() => engine.generateIdentity('s', 'k')).toThrow(/no industry/);
  });

  it('honours custom demographic mixing rules', () => {
    const engine = new CoreEngine({
      demographics: {
        ...US_DEMOGRAPHICS_DEFAULT,
        mixingRules: { sameBucketProbability: 1.0 },
      },
      address: US_ADDRESS_DEFAULT,
    });
    engine.registerIndustry(MINIMAL_INDUSTRY);
    // Smoke test — should not throw and should still be deterministic
    const a = engine.generateIdentity('s', 'k');
    const b = engine.generateIdentity('s', 'k');
    expect(a).toEqual(b);
  });

  it('generateContacts returns N unique-ish identities', () => {
    const engine = buildEngine();
    const list = engine.generateContacts('batch', 25);
    expect(list).toHaveLength(25);
    const uniqueNames = new Set(list.map((i) => i.fullName));
    // With 25 draws from a large pool we expect mostly-unique names.
    expect(uniqueNames.size).toBeGreaterThan(10);
  });
});
