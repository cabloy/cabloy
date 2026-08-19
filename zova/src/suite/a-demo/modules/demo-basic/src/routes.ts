import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageComponent } from './.metadata/page/component.js';
import { ZPageLocale } from './.metadata/page/locale.js';
import { ZPageRouteParams } from './.metadata/page/routeParams.js';
import { ZPageRouteQuery } from './.metadata/page/routeQuery.js';
import { ZPageRouteQueryB } from './.metadata/page/routeQueryB.js';
import { ZPageState } from './.metadata/page/state.js';
import { ZPageStyle } from './.metadata/page/style.js';
import { ZPageToolMinimal } from './.metadata/page/toolMinimal.js';
import { ZPageToolOne } from './.metadata/page/toolOne.js';
import { ZPageToolTwo } from './.metadata/page/toolTwo.js';

export const routes: IModuleRoute[] = [
  { path: 'state', component: ZPageState, meta: { requiresAuth: false, ssrProfile: 'session' } },
  {
    path: 'component',
    component: ZPageComponent,
    meta: { requiresAuth: false, ssrProfile: 'session' },
  },
  { path: 'locale', component: ZPageLocale, meta: { requiresAuth: false, ssrProfile: 'session' } },
  { path: 'style', component: ZPageStyle, meta: { requiresAuth: false, ssrProfile: 'session' } },
  {
    path: 'routeQuery',
    component: ZPageRouteQuery,
    meta: { requiresAuth: false, ssrProfile: 'session' },
  },
  {
    name: 'routeParams',
    path: 'routeParams/:id?',
    component: ZPageRouteParams,
    meta: {
      componentKeyMode: 'nameOnly',
      requiresAuth: false,
      ssrProfile: 'session',
    },
  },
  {
    path: 'routeQueryB',
    component: ZPageRouteQueryB,
    meta: {
      requiresAuth: false,
      ssrProfile: 'session',
    },
  },
  {
    path: 'toolMinimal',
    component: ZPageToolMinimal,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'session',
    },
  },
  {
    name: 'toolOne',
    path: 'toolOne/:id?',
    component: ZPageToolOne,
    meta: { requiresAuth: false, ssrProfile: 'session' },
  },
  {
    name: 'toolTwo',
    path: 'toolTwo/:id?',
    component: ZPageToolTwo,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'session',
    },
  },
];
