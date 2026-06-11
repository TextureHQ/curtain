import type { OrganizationEntry, SeededRandom } from '../types.js';

export class EmptyOrganizationsError extends Error {
  constructor() {
    super(
      "selectOrganization: industry configuration must include at least one organization.",
    );
    this.name = "EmptyOrganizationsError";
  }
}

export function selectOrganization(
  rng: SeededRandom,
  organizations: ReadonlyArray<OrganizationEntry>,
): OrganizationEntry {
  if (organizations.length === 0) {
    throw new EmptyOrganizationsError();
  }
  return organizations[rng.nextInt(organizations.length)]!;
}
