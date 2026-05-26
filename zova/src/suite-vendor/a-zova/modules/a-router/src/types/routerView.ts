import type { RouteLocationNormalizedLoaded } from '@cabloy/vue-router';
import type { ComponentInternalInstance } from 'vue';

import type { IPageMeta } from './pageMeta.js';

export interface IRouteViewRouteItemBase {
  componentKey: string;
  fullPath: string;
  keepAlive?: boolean;
}

export interface IRouteViewRouteItem extends IRouteViewRouteItemBase {
  updatedAt: number;
  pageMeta?: IPageMeta;
}

export interface IRouteViewRouteMeta extends IRouteViewRouteItemBase {
  tabKey: string;
}

export interface IRouterViewSlotParams {
  Component: ComponentInternalInstance;
  route: RouteLocationNormalizedLoaded;
}
