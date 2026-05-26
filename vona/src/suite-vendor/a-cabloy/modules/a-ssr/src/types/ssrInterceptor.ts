import type { IParamsAndQuery } from '@cabloy/utils';

import type { ISsrSiteRecord } from './ssrSite.ts';

export type TypeSsrRenderType = 'auto' | 'html' | 'json';

export interface IInterceptorOptionsSsrBase {
  site: keyof ISsrSiteRecord;
  pagePath: string;
  pageOptions?: IParamsAndQuery;
}
