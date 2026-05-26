import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageComponent } from './.metadata/page/component.js';
import { ZPageLocale } from './.metadata/page/locale.js';
import { ZPageRouteParams } from './.metadata/page/routeParams.js';
import { ZPageRouteQuery } from './.metadata/page/routeQuery.js';
import { ZPageRouteQueryB } from './.metadata/page/routeQueryB.js';
import { ZPageState } from './.metadata/page/state.js';
import { ZPageStyle } from './.metadata/page/style.js';
import { ZPageToolOne } from './.metadata/page/toolOne.js';
import { ZPageToolTwo } from './.metadata/page/toolTwo.js';

export const routes: IModuleRoute[] = [
  { path: 'state', component: ZPageState },
  { path: 'component', component: ZPageComponent },
  { path: 'locale', component: ZPageLocale },
  { path: 'style', component: ZPageStyle },
  { path: 'routeQuery', component: ZPageRouteQuery },
  {
    name: 'routeParams',
    path: 'routeParams/:id?',
    component: ZPageRouteParams,
    meta: {
      componentKeyMode: 'nameOnly',
    },
  },
  { path: 'routeQueryB', component: ZPageRouteQueryB },
  {
    name: 'toolOne',
    path: 'toolOne/:id?',
    component: ZPageToolOne,
  },
  {
    name: 'toolTwo',
    path: 'toolTwo/:id?',
    component: ZPageToolTwo,
    meta: {
      layout: 'empty',
      requiresAuth: false,
    },
  },
];
