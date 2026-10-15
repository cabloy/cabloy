import type { BeanRouter } from '../bean/bean.router.js';

export type TypeRouteDiscardReason = 'back' | 'taskClose' | 'workspaceClose';

export interface IRouteDiscardItem {
  readonly fullPath: string;
  readonly componentKey?: string;
  readonly tabKey?: string;
}

export interface IRouteDiscardEvent {
  readonly router: BeanRouter;
  readonly reason: TypeRouteDiscardReason;
  readonly items: readonly IRouteDiscardItem[];
  readonly ownerSelector?: string;
  // Register cleanup synchronously so outgoing writers can be invalidated before navigation.
  readonly waitUntil: (cleanup: Promise<void>) => void;
}

declare module 'zova' {
  export interface IEventRecord {
    'a-router:routeDiscard': { data: IRouteDiscardEvent; result: void };
  }
}
