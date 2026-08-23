import type { VonaApplication } from 'vona';

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

export function config(_app: VonaApplication): IHomeUserConfig {
  return {
    passwordDefault: {
      admin: '123456',
    },
    disableBootstrapSystemAdmin: false,
    disableUserAdmin: false,
    builtinRoles,
  };
}
