import type { VonaApplication } from 'vona';

import type { IDecoratorSsrSiteOptions } from '../types/ssrSite.ts';

export function config(_app: VonaApplication) {
  return {
    site: {
      default: {
        apiType: 'performAction',
        dev: {
          host: 'http://localhost:9000',
        },
      } as IDecoratorSsrSiteOptions,
    },
    menuItemLinkPreset: {
      presetLogin: '/login',
      presetErrorExpired: '/home/base/errorExpired',
      presetResource: '/rest/resource/:resource',
    },
  };
}
