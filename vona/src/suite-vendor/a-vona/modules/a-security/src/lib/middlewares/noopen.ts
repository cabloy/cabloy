import type { Next, VonaContext } from 'vona';

import type { IMiddlewareSystemOptionsSecurities } from '../../bean/middlewareSystem.securities.ts';

import { checkIfIgnore } from '../utils.ts';

// @see http://blogs.msdn.com/b/ieinternals/archive/2009/06/30/internet-explorer-custom-http-headers.aspx
export default (options: IMiddlewareSystemOptionsSecurities['noopen']) => {
  return async function noopen(ctx: VonaContext, next: Next) {
    await next();
    if (checkIfIgnore(options, ctx)) return;
    ctx.set('x-download-options', 'noopen');
  };
};
