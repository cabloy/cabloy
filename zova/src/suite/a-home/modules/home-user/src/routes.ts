import { IModuleRoute } from 'zova-module-a-router';

import { ZPageAccount } from './.metadata/page/account.ts';
import { ZPageActivation } from './.metadata/page/activation.ts';
import { ZPagePasswordReset } from './.metadata/page/passwordReset.ts';
import { ZPagePasswordSet } from './.metadata/page/passwordSet.ts';

export const routes: IModuleRoute[] = [
  {
    path: 'account',
    component: ZPageAccount,
    meta: {
      requiresAuth: true,
      ssrProfile: 'session',
    },
  },
  {
    path: 'activation',
    component: ZPageActivation,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'public',
    },
  },
  {
    path: 'password-set',
    component: ZPagePasswordSet,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'public',
    },
  },
  {
    path: 'password-reset',
    component: ZPagePasswordReset,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'public',
    },
  },
];
