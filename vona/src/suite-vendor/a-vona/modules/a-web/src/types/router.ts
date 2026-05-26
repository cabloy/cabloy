import type Router from 'find-my-way';
import type { Constructable } from 'vona';

import type { TypeRequestMethod } from './request.ts';

export interface ContextRouteMetadata {
  meta: any;
}

export interface ContextRouteBase {
  controller: Constructable;
  controllerBeanFullName: string;
  action: string;
}

export interface ContextRoute extends ContextRouteBase {
  actionDescriptor: PropertyDescriptor;
  route: ContextRouteMetadata;
  routeMethod: TypeRequestMethod;
  routePath: string;
  routePathRaw: string;
  routePathOriginal: string;
}

declare module 'vona' {
  export interface VonaApplication {
    router: Router.Instance<Router.HTTPVersion.V1>;
  }

  export interface VonaContext {
    route: ContextRoute;
  }
}

declare module 'koa' {
  export interface Request {
    params: { [key: string]: string };
    query: { [key: string]: string };
  }
}
