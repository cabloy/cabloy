import { IModuleRoute } from 'zova-module-a-router';

import { ZPageCatalogue } from './.metadata/page/catalogue.js';
import { ZPageProduct } from './.metadata/page/product.js';

export const routes: IModuleRoute[] = [
  {
    name: 'catalogue',
    path: 'catalogue/:locale?',
    component: ZPageCatalogue,
    meta: { requiresAuth: false, locale: true, ssrProfile: 'public' },
  },
  {
    name: 'product',
    path: 'product/:id/:locale?',
    component: ZPageProduct,
    meta: { requiresAuth: false, locale: true, ssrProfile: 'public' },
  },
];
