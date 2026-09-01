import type { VonaApplication } from 'vona';

import { roleSiteIdAll } from 'vona-module-a-openapiutils';

import { builtinRoles } from './roles.ts';

export { builtinRoles } from './roles.ts';
export type { IRoleConfig } from './roles.ts';

export interface IHomeUserConfig {
  passwordDefault: {
    admin: string;
  };
  disableBootstrapSystemAdmin: boolean;
  disableUserAdmin: boolean;
  builtinRoles: typeof builtinRoles;
}

export function config(app: VonaApplication): IHomeUserConfig {
  return {
    passwordDefault: {
      admin: '123456',
    },
    disableBootstrapSystemAdmin: false,
    disableUserAdmin: false,
    builtinRoles: {
      ...builtinRoles,
      registeredUser: {
        ...builtinRoles.registeredUser,
        siteIds: parseBuiltinRoleSiteIds(
          app.meta.env.HOME_USER_BUILTIN_ROLE_REGISTERED_USER_SITE_IDS,
          'HOME_USER_BUILTIN_ROLE_REGISTERED_USER_SITE_IDS',
        ),
      },
      systemAdmin: {
        ...builtinRoles.systemAdmin,
        siteIds: parseBuiltinRoleSiteIds(
          app.meta.env.HOME_USER_BUILTIN_ROLE_SYSTEM_ADMIN_SITE_IDS,
          'HOME_USER_BUILTIN_ROLE_SYSTEM_ADMIN_SITE_IDS',
        ),
      },
    },
  };
}

function parseBuiltinRoleSiteIds(value: string | undefined, variableName: string): string[] {
  const siteIds = value
    ?.split(',')
    .map(siteId => siteId.trim())
    .filter(Boolean) ?? [roleSiteIdAll];
  if (siteIds.length === 0) return [roleSiteIdAll];
  if (siteIds.includes(roleSiteIdAll) && siteIds.length !== 1) {
    throw new Error(`${variableName} must contain only "${roleSiteIdAll}" or concrete site IDs`);
  }
  return siteIds;
}
