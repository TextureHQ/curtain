import { describe, it, expect } from 'vitest';
import { CoreEngine, US_ADDRESS_DEFAULT, US_DEMOGRAPHICS_DEFAULT } from '@texturehq/curtain-core';
import { energy } from '../src/index.js';

describe('energy industry', () => {
  it('has 60 organisations across coop/iou/municipal/der', () => {
    expect(energy.organizations).toHaveLength(60);
    const types = new Set(energy.organizations.map((o) => o.type));
    expect(types).toEqual(new Set(['coop', 'iou', 'municipal', 'der']));
  });

  it('every org has a unique id', () => {
    const ids = new Set(energy.organizations.map((o) => o.id));
    expect(ids.size).toBe(energy.organizations.length);
  });

  it('registers cleanly with CoreEngine and generates identities', () => {
    const core = new CoreEngine({
      demographics: US_DEMOGRAPHICS_DEFAULT,
      address: US_ADDRESS_DEFAULT,
    });
    core.registerIndustry(energy);
    const id = core.generateIdentity('seed', 'contact:1', { industry: 'energy' });
    expect(id.organizationName).toBeTruthy();
    expect(energy.organizations.map((o) => o.name)).toContain(id.organizationName);
  });
});
