import type { VonaApplication } from 'vona';

import type { IConfigDatashardingClient } from '../types/datasharding.ts';

export function config(_app: VonaApplication) {
  return {
    client: {
      reads: [],
      writes: [],
      randomRead: undefined,
      randomWrite: undefined,
    } as IConfigDatashardingClient,
    check: {
      methodsForWrite: ['POST', 'PATCH', 'DELETE', 'PUT'],
    },
  };
}
