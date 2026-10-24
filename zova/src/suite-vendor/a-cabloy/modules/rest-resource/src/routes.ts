import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageEntry } from './.metadata/page/entry.ts';
import { ZPageEntryCreate } from './.metadata/page/entryCreate.ts';
import { ZPageResource } from './.metadata/page/resource.ts';
import { ZPageResourcePicker } from './.metadata/page/resourcePicker.ts';
import { resourceRouteMeta, resourceTabKey } from './lib/resourceRouteMeta.ts';

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
    name: 'resourcePicker',
    path: ':resource/picker',
    component: ZPageResourcePicker,
    meta: {
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
