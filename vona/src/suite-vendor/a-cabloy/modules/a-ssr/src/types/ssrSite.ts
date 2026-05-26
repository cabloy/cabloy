import type http from 'node:http';
import type { IInstanceRecord, OmitNever } from 'vona';
import type {
  IOnionOptionsEnable,
  IOnionOptionsMatch,
  ServiceOnion,
  TypeOnionOptionsMatchRule,
} from 'vona-module-a-onion';

import type { ZovaConfigEnv } from './env.ts';

export type TypeSsrSitePerformAction = (data: ISsrSitePerformActionOptions) => Promise<any>;
export type TypeSsrSitePerformActionMethod = 'get' | 'post' | 'delete' | 'put' | 'patch';

export interface ISsrSitePerformActionOptions {
  method: TypeSsrSitePerformActionMethod;
  path: string;
  query?: object;
  body?: any;
  headers?: object;
}

export interface ISsrRenderOptionsBase {
  params?: unknown;
  query?: unknown;
}

export interface ISsrHandlerRenderOptionsBase {
  req: http.IncomingMessage;
  res: http.ServerResponse<http.IncomingMessage>;
}

export interface ISsrHandlerRenderOptions extends ISsrHandlerRenderOptionsBase {
  returnHtml?: boolean;
}

export interface ISsrHandlerRenderOptionsInner extends ISsrHandlerRenderOptionsBase {
  performAction?: TypeSsrSitePerformAction;
  state?: SSRContextState;
}

export interface SSRContextState {
  envClient?: ZovaConfigEnv;
  pagePathFull?: string;
  pagePath?: string;
  pageData?: unknown;
}

export interface ISsrSitePublicPathRecord {}

export interface ISsrSiteRecord {}

export type TypeMergePagesAndPagesData<Pages extends {} = {}, PagesData extends {} = {}> = {
  // @ts-ignore: ignore
  [K in keyof Pages]: Pages[K] & { data?: PagesData[K] };
};

export interface IDecoratorSsrSiteOptions<
  Pages extends {} = {},
  PagesData extends {} = {},
  Icons extends {} = {},
>
  extends
    IOnionOptionsEnable,
    IOnionOptionsMatch<TypeOnionOptionsMatchRule<keyof IInstanceRecord>> {
  publicPath: keyof ISsrSitePublicPathRecord;
  bundlePath: string;
  envServer?: ZovaConfigEnv;
  envClient?: ZovaConfigEnv;
  apiType: 'performAction' | 'api' | 'dev';
  dev: {
    host: string;
  };
  pages: TypeMergePagesAndPagesData<Pages, PagesData>;
  icons: Icons;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    ssrSite: ServiceOnion<ISsrSiteRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    ssrSite: OmitNever<ISsrSiteRecord>;
  }

  export interface IBeanSceneRecord {
    ssrSite: never;
  }
}
