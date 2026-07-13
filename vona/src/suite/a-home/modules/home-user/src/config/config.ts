import type { VonaApplication } from 'vona';

export function config(_app: VonaApplication) {
  return {
    passwordDefault: {
      admin: '123456',
    },
    disableBootstrapSystemAdmin: false,
    disableUserAdmin: false,
  };
}
