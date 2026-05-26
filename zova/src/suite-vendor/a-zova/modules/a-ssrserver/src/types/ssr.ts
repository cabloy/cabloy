import type http from 'node:http';
import type { SSRContextState, TypeSsrSitePerformAction } from 'zova-module-a-ssr';

import type { ServiceSsrHandler } from '../service/ssrHandler.js';
import 'zova';

export type TypeEventResolvePathResult = string | true | undefined;

export interface ISsrHandlerRenderOptionsInner {
  req: http.IncomingMessage;
  res: http.ServerResponse<http.IncomingMessage>;
  performAction?: TypeSsrSitePerformAction;
  state?: SSRContextState;
}

declare module 'zova' {
  export interface SysMeta {
    $getSsrHandler(siteAssetDir: string): Promise<ServiceSsrHandler>;
  }
}
