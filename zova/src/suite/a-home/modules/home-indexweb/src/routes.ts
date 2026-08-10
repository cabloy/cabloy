import { IModuleRoute } from 'zova-module-a-router';

import { ZPageHome } from './.metadata/page/home.js';

export const routes: IModuleRoute[] = [
  {
    name: 'home',
    path: 'home/:locale?',
    component: ZPageHome,
    meta: {
      requiresAuth: false,
      locale: true,
      ssrProfile: 'public',
    },
  },
];
