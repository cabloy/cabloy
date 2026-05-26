import type { ComponentInternalInstance, VNode } from 'vue';
import type { ZovaConfigEnv } from 'zova';

import type { CtxSSR } from '../lib/ssr.js';
import 'zova';

export interface ErrorSSR extends Error {
  pagePath?: string;
  url?: string;
}

export interface SSRContext {
  _meta: SSRContextMeta;
  state: SSRContextState;
  stateDefer: SSRContextStateDefer;
  req: Request;
  res: Response;
  pagePath?: string;
  pageData?: any;
  performAction?: TypeSsrSitePerformAction;
  /** The global "nonce" attribute to use */
  nonce?: string;
  /**
   * Registers a function to be executed server-side after
   * app has been rendered with Vue. You might need this
   * to access ssrContext again after it has been fully processed.
   * Example: ssrContext.onRendered(() => { ... })
   */
  onRendered: (fn: (err?: Error) => void) => void;
  rendered: () => void;
  __qMetaList: SSRMetaOptions[];
  modules: Set<string>;
}

export interface SSRContextMeta {
  htmlAttrs: string;
  headTags: string;
  endingHeadTags: string;
  bodyClasses: string;
  bodyAttrs: string;
  bodyTags: string;
  endingBodyTags: string;
  baseUrl: string;
  renderError: ErrorSSR | string;
}

export interface SSRContextState {
  envClient?: ZovaConfigEnv;
  pagePathFull?: string;
  pagePath?: string;
  pageData?: unknown;
}
export interface SSRContextStateDefer {}

// from: quasar/dist/types/meta.d.ts
// Cannot use `Record<string, string>` as TS would error out about `template` signature
// See: https://basarat.gitbook.io/typescript/type-system/index-signatures#all-members-must-conform-to-the-string-index-signature
type SSRMetaTagOptions = Record<string, any> & {
  template?: (attributeValue: string) => string;
};

export interface SSRMetaOptions {
  title?: string;
  titleTemplate?(title: string): string;
  meta?: { [name: string]: SSRMetaTagOptions };
  link?: { [name: string]: Record<string, string> };
  script?: { [name: string]: Record<string, string> };
  htmlAttr?: { [name: string]: string | undefined };
  bodyAttr?: { [name: string]: string | undefined };
  bodyStyle?: { [name: string]: string | undefined };
  bodyClass?: { [name: string]: boolean };
  noscript?: { [name: string]: string };
}

export interface SSRMetaOptionsWrapper {
  active: boolean;
  val?: SSRMetaOptions;
}

export interface OnHydratePropHasMismatchResult {
  ignore?: boolean;
  clientValue?: any;
}

export type OnHydratePropHasMismatch = (
  el: Element,
  key: string,
  clientValue: any,
  vnode: VNode,
  instance: ComponentInternalInstance | null,
) => OnHydratePropHasMismatchResult;

export interface SSREnv {
  ssr: boolean;
  server: boolean;
  client: boolean;
}

export type TypeSsrSitePerformAction = (data: ISsrSitePerformActionOptions) => Promise<any>;
export type TypeSsrSitePerformActionMethod = 'get' | 'post' | 'delete' | 'put' | 'patch';
export interface ISsrSitePerformActionOptions {
  method: TypeSsrSitePerformActionMethod;
  path: string;
  query?: object;
  body?: any;
  headers?: object;
}

declare module 'zova' {
  export interface CtxMeta {
    $ssr: CtxSSR;
  }

  export interface BeanBase {
    $ssr: CtxSSR;
    $useMeta(options: SSRMetaOptions | (() => SSRMetaOptions)): void;
  }

  export interface ZovaConfigEnv {
    SSR_COOKIE_THEMEDARK_DEFAULT: string | undefined;
    SSR_BODYREADYOBSERVER: string | undefined;
    SSR_TRANSFERCACHE: string | undefined;
    SSR_TRANSFERCACHE_EXPIRES: string | undefined;
  }
}

declare global {
  interface Window {
    ssr_load_local<T>(key: string): T | undefined;
    ssr_themedark: boolean;
    ssr_cookie_themedark: boolean;
    ssr_local_themedark: boolean;
    ssr_local_themename?: string;
  }
}
