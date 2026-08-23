import type { VonaApplication } from 'vona';
import type { IServiceRecord } from 'vona-module-a-bean';

export function config(_app: VonaApplication) {
  return {
    adapter: {
      rbacScope: 'admin-rbac:rbacScopeAdapter' as keyof IServiceRecord,
    },
  };
}
