import { IModuleRoute } from 'zova-module-a-router';

import { ZPageAddress } from './.metadata/page/address.js';

export const routes: IModuleRoute[] = [
  {
    path: 'address',
    component: ZPageAddress,
    meta: { requiresAuth: true, ssrProfile: 'session' },
  },
];
