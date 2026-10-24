import { IModuleRoute } from 'zova-module-a-router';

import { ZPageConsent } from './.metadata/page/consent.ts';

export const routes: IModuleRoute[] = [
  {
    path: 'consent',
    component: ZPageConsent,
    meta: { layout: 'empty', requiresAuth: true, ssrProfile: 'session' },
  },
];
