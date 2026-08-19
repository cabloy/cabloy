import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageAuthCallback } from './.metadata/page/authCallback.js';
import { ZPageErrorAccessDenied } from './.metadata/page/errorAccessDenied.js';
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
      ssrProfile: 'session',
    },
  },
  {
    path: 'errorAccessDenied',
    component: ZPageErrorAccessDenied,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'session',
    },
  },
  {
    path: 'errorNotFound',
    component: ZPageErrorNotFound,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'session',
    },
  },
  {
    path: 'errorExpired',
    component: ZPageErrorExpired,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'session',
    },
  },
  {
    path: 'authCallback',
    component: ZPageAuthCallback,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'session',
    },
  },
];
