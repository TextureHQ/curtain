/**
 * Curtain — Pack Merge (pure helpers)
 *
 * Loaded by manifest.json BEFORE content.js so the content script can merge
 * enabled industry-pack data into the core masking pools. Attaches to the
 * window scope using the same IIFE pattern as data.js (Chrome content scripts
 * share a scope and cannot use ES module imports).
 *
 * This file is intentionally dependency-free (no chrome.* APIs) so it can be
 * unit-tested in isolation.
 */
(function () {
  /**
   * Merge a list of enabled industry packs into the core masking pools.
   *
   * Each pack may carry an optional `filters` object that gates which org
   * types, program buckets, and devices are included. When `filters` is
   * absent (or a particular sub-field is absent), all entries for that
   * entity type are included (backward-compatible default).
   *
   * Filter shape per pack:
   *   filters: {
   *     organization: { <type>: true|false, ... }  // omit = all-on
   *     program:      { <bucketKey>: true|false }  // omit = all-on
   *     device:       true|false                  // omit = all-on
   *   }
   *
   * @param {{organizations: Array, programs: Object, devices: Array}} core
   *   The core bundle pools. Not mutated.
   * @param {Array<{name: string, data: Object, filters?: Object}>} packDataList
   *   Enabled packs. Each `data` is a serialized IndustryConfig.
   * @returns {{organizations: Array, programs: Object, devices: Array}}
   *   Fresh merged pools (inputs are never mutated).
   */
  function mergePackData(core, packDataList) {
    const organizations = Array.isArray(core?.organizations) ? [...core.organizations] : [];
    const programs = core?.programs ? { ...core.programs } : {};
    const devices = Array.isArray(core?.devices) ? [...core.devices] : [];

    const seenOrgIds = new Set(organizations.map((o) => o?.id));
    const seenDevices = new Set(devices);
    const seenProgramNames = new Map(
      Object.entries(programs).map(([key, bucket]) => [key, new Set(bucket?.names || [])]),
    );

    for (const pack of packDataList || []) {
      const data = pack?.data;
      if (!data) continue;
      const f = pack.filters;

      // Organizations: gate by type if filters.organization is set.
      if (Array.isArray(data.organizations)) {
        for (const org of data.organizations) {
          if (!org?.id || seenOrgIds.has(org.id)) continue;
          if (f?.organization && f.organization[org.type] === false) continue;
          seenOrgIds.add(org.id);
          organizations.push(org);
        }
      }

      // Devices: gate by the device flag.
      if (Array.isArray(data.devices)) {
        if (f && f.device === false) { /* skip all devices from this pack */ }
        else {
          for (const device of data.devices) {
            if (typeof device !== 'string' || seenDevices.has(device)) continue;
            seenDevices.add(device);
            devices.push(device);
          }
        }
      }

      // Programs: gate by bucket key if filters.program is set.
      if (data.programs && typeof data.programs === 'object') {
        for (const [key, bucket] of Object.entries(data.programs)) {
          if (!bucket || !Array.isArray(bucket.names)) continue;
          if (f?.program && f.program[key] === false) continue;
          if (programs[key]) {
            const mergedNames = [...programs[key].names];
            const existing = seenProgramNames.get(key);
            for (const name of bucket.names) {
              if (existing.has(name)) continue;
              existing.add(name);
              mergedNames.push(name);
            }
            programs[key] = {
              weight: (programs[key].weight || 0) + (bucket.weight || 0),
              names: mergedNames,
            };
          } else {
            programs[key] = { weight: bucket.weight || 0, names: [...bucket.names] };
            seenProgramNames.set(key, new Set(bucket.names));
          }
        }
      }
    }

    return { organizations, programs, devices };
  }

  if (typeof window !== 'undefined') {
    window.CurtainPackMerge = { mergePackData };
  }
})();