import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageEntry } from './.metadata/page/entry.js';
import { ZPageEntryCreate } from './.metadata/page/entryCreate.js';
import { ZPageResource } from './.metadata/page/resource.js';
import { resourceRouteMeta, resourceTabKey } from './lib/resourceRouteMeta.js';

export const routes: IModuleRoute[] = [
  {
    name: 'resource',
    path: ':resource',
    component: ZPageResource,
    meta: resourceRouteMeta,
  },
  {
    name: 'entryCreate',
    path: ':resource/create',
    component: ZPageEntryCreate,
    meta: {
      tabKey: resourceTabKey,
      ssrProfile: 'session',
    },
  },
  {
    name: 'entry',
    path: ':resource/:id/:formScene?',
    component: ZPageEntry,
    meta: {
      tabKey: resourceTabKey,
      ssrProfile: 'session',
    },
  },
];
