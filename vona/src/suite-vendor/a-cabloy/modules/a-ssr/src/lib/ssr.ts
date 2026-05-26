import { Aspect } from 'vona-module-a-aspect';

import type { IInterceptorOptionsSsrRedirect } from '../bean/interceptor.ssrRedirect.ts';
import type { IInterceptorOptionsSsrRender } from '../bean/interceptor.ssrRender.ts';
import type { ISsrSiteRecord } from '../types/ssrSite.ts';

function Redirect<
  SITE extends keyof ISsrSiteRecord,
  PAGEPATH extends keyof ISsrSiteRecord[SITE]['pages'],
  PAGEOPTIONS extends Omit<ISsrSiteRecord[SITE]['pages'][PAGEPATH], 'data'>,
>(
  site: SITE,
  pagePath: PAGEPATH,
  pageOptions?: PAGEOPTIONS,
  options?: Partial<Omit<IInterceptorOptionsSsrRedirect, 'site' | 'pagePath' | 'pageOptions'>>,
): MethodDecorator {
  return Aspect.interceptor(
    'a-ssr:ssrRedirect',
    Object.assign({}, options, {
      site: site as any,
      pagePath: pagePath as any,
      pageOptions: pageOptions as any,
    }),
  );
}

function Render<
  SITE extends keyof ISsrSiteRecord,
  PAGEPATH extends keyof ISsrSiteRecord[SITE]['pages'],
  PAGEOPTIONS extends Omit<ISsrSiteRecord[SITE]['pages'][PAGEPATH], 'data'>,
>(
  site: SITE,
  pagePath: PAGEPATH,
  pageOptions?: PAGEOPTIONS,
  options?: Partial<Omit<IInterceptorOptionsSsrRender, 'site' | 'pagePath' | 'pageOptions'>>,
): MethodDecorator {
  return Aspect.interceptor(
    'a-ssr:ssrRender',
    Object.assign({}, options, {
      site: site as any,
      pagePath: pagePath as any,
      pageOptions: pageOptions as any,
    }),
  );
}

export const Ssr = {
  redirect: Redirect,
  render: Render,
};
