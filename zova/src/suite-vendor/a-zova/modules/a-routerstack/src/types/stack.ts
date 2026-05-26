import type { IRouteViewRouteMeta } from 'zova-module-a-router';

export interface ModelStackOptionsBase {
  /** -1: infinite 0: Affix Only  */
  max?: number;
}

export interface ModelStackOptions extends ModelStackOptionsBase {}

export interface RouteTabBase {
  tabKey: string;
}

export interface RouteTabTransient extends IRouteViewRouteMeta {}

export interface RouteTab extends RouteTabBase {
  updatedAt: number;
}
