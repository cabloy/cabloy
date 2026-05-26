import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageAuthCallback } from './.metadata/page/authCallback.js';
import { ZPageErrorExpired } from './.metadata/page/errorExpired.js';
import { ZPageErrorNotFound } from './.metadata/page/errorNotFound.js';

export const routes: IModuleRoute[] = [
  {
    path: '/:catchAll(.*)*',
    component: ZPageErrorNotFound,
    meta: {
      absolute: true,
      layout: 'empty',
      requiresAuth: false,
    },
  },
  {
    path: 'errorNotFound',
    component: ZPageErrorNotFound,
    meta: {
      layout: 'empty',
      requiresAuth: false,
    },
  },
  {
    path: 'errorExpired',
    component: ZPageErrorExpired,
    meta: {
      layout: 'empty',
      requiresAuth: false,
    },
  },
  {
    path: 'authCallback',
    component: ZPageAuthCallback,
    meta: {
      layout: 'empty',
      requiresAuth: false,
    },
  },
];
