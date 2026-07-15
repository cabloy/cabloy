import type { VonaApplication } from 'vona';

import { builtinRoles } from './roles.ts';

export { builtinRoles } from './roles.ts';
export type { IRoleConfig } from './roles.ts';

export function config(_app: VonaApplication) {
  return {
    passwordDefault: {
      admin: '123456',
    },
    disableBootstrapSystemAdmin: false,
    disableUserAdmin: false,
    roles: builtinRoles,
  };
}
