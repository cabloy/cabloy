import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageLogin } from './.metadata/page/login.ts';
import { ZPagePasswordResetRequest } from './.metadata/page/passwordResetRequest.ts';
import { ZPageRegister } from './.metadata/page/register.ts';

export const routes: IModuleRoute[] = [
  //
  {
    path: '',
    component: ZPageLogin,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'public',
    },
  },
  {
    path: 'register',
    component: ZPageRegister,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'public',
    },
  },
  {
    path: 'password-reset',
    component: ZPagePasswordResetRequest,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'public',
    },
  },
];
