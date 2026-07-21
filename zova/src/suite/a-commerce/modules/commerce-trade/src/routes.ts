import { IModuleRoute } from 'zova-module-a-router';

import { ZPageCart } from './.metadata/page/cart.js';

export const routes: IModuleRoute[] = [
  {
    name: 'cart',
    path: 'cart/:locale?',
    component: ZPageCart,
    meta: { locale: true, requiresAuth: true },
  },
];
