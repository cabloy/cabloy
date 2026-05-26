import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageEntry } from './.metadata/page/entry.js';
import { ZPageEntryCreate } from './.metadata/page/entryCreate.js';
import { ZPageResource } from './.metadata/page/resource.js';

export const routes: IModuleRoute[] = [
  {
    name: 'resource',
    path: ':resource',
    component: ZPageResource,
    meta: {
      tabKey,
    },
  },
  {
    name: 'entryCreate',
    path: ':resource/create',
    component: ZPageEntryCreate,
    meta: {
      tabKey,
    },
  },
  {
    name: 'entry',
    path: ':resource/:id/:formScene?',
    component: ZPageEntry,
    meta: {
      tabKey,
    },
  },
];

function tabKey(route) {
  return `/rest/resource/${encodeURIComponent(route.params.resource)}`;
}
