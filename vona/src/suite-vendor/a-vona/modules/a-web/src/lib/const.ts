import type { Constructable, VonaApplication } from 'vona';
import type { IResourceRecord } from 'vona-module-a-openapi';

import type { ContextRoute } from '../types/router.ts';

export interface IRecordResourceNameToRoutePathItem {
  apiPath: string;
  routePathRaw: string;
  controller: Constructable;
}

export const SymbolCacheControllerRoutes = Symbol('SymbolCacheControllerRoutes');
export const recordResourceNameToRoutePath: Record<
  keyof IResourceRecord,
  IRecordResourceNameToRoutePathItem
> = {} as any;

export function getCacheControllerRoutes(app: VonaApplication): Record<string, ContextRoute[]> {
  if (!app.meta[SymbolCacheControllerRoutes]) app.meta[SymbolCacheControllerRoutes] = {};
  return app.meta[SymbolCacheControllerRoutes];
}
