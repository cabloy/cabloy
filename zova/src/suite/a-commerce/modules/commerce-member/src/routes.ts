import { IModuleRoute } from 'zova-module-a-router';

import { ZPageAddress } from './.metadata/page/address.js';

export const routes: IModuleRoute[] = [
  {
    name: 'address',
    path: 'address/:locale?',
    component: ZPageAddress,
    meta: { locale: true, requiresAuth: true },
  },
];
