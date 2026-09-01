export const roleSiteIdAll = '*';

export interface RoleSiteAdmission {
  siteIds: string[];
}

export function isRoleSiteAdmitted(
  siteId: string | undefined,
  roles: RoleSiteAdmission[] | undefined,
): boolean {
  if (!siteId) return false;
  return !!roles?.some(
    role => role.siteIds.includes(siteId) || role.siteIds.includes(roleSiteIdAll),
  );
}
