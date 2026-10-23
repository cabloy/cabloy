import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageComponent } from './.metadata/page/component.ts';
import { ZPageControllerBoundary } from './.metadata/page/controllerBoundary.ts';
import { ZPageLocale } from './.metadata/page/locale.ts';
import { ZPageRoutedDialog } from './.metadata/page/routedDialog.ts';
import { ZPageRoutedDialogDetail } from './.metadata/page/routedDialogDetail.ts';
import { ZPageRoutedDialogEntry } from './.metadata/page/routedDialogEntry.ts';
import { ZPageRouteParams } from './.metadata/page/routeParams.ts';
import { ZPageRouteQuery } from './.metadata/page/routeQuery.ts';
import { ZPageRouteQueryB } from './.metadata/page/routeQueryB.ts';
import { ZPageState } from './.metadata/page/state.ts';
import { ZPageStyle } from './.metadata/page/style.ts';
import { ZPageToolMinimal } from './.metadata/page/toolMinimal.ts';
import { ZPageToolOne } from './.metadata/page/toolOne.ts';
import { ZPageToolTwo } from './.metadata/page/toolTwo.ts';

export const routes: IModuleRoute[] = [
  { path: 'state', component: ZPageState, meta: { requiresAuth: false, ssrProfile: 'public' } },
  {
    path: 'component',
    component: ZPageComponent,
    meta: { requiresAuth: false, ssrProfile: 'public' },
  },
  { path: 'locale', component: ZPageLocale, meta: { requiresAuth: false, ssrProfile: 'public' } },
  { path: 'style', component: ZPageStyle, meta: { requiresAuth: false, ssrProfile: 'public' } },
  {
    path: 'routeQuery',
    component: ZPageRouteQuery,
    meta: { requiresAuth: false, ssrProfile: 'public' },
  },
  {
    name: 'routeParams',
    path: 'routeParams/:id?',
    component: ZPageRouteParams,
    meta: {
      componentKeyMode: 'nameOnly',
      requiresAuth: false,
      ssrProfile: 'public',
    },
  },
  {
    path: 'routeQueryB',
    component: ZPageRouteQueryB,
    meta: {
      requiresAuth: false,
      ssrProfile: 'public',
      ssrProfileOptions: { responseCache: { expires: '5m' } },
    },
  },
  {
    name: 'toolMinimal',
    path: 'toolMinimal',
    component: ZPageToolMinimal,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'public',
    },
  },
  {
    name: 'toolOne',
    path: 'toolOne/:id?',
    component: ZPageToolOne,
    meta: { requiresAuth: false, ssrProfile: 'public' },
  },
  {
    name: 'toolTwo',
    path: 'toolTwo/:id?',
    component: ZPageToolTwo,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'public',
    },
  },
  {
    path: 'routedDialog',
    component: ZPageRoutedDialog,
    meta: { requiresAuth: false },
  },
  {
    path: 'routedDialogEntry',
    component: ZPageRoutedDialogEntry,
    meta: { requiresAuth: false },
  },
  {
    name: 'routedDialogDetail',
    path: 'routedDialogDetail/:id',
    component: ZPageRoutedDialogDetail,
    meta: { requiresAuth: false },
  },
  {
    path: 'controllerBoundary',
    component: ZPageControllerBoundary,
    meta: { requiresAuth: false, ssrProfile: 'public' },
  },
];
