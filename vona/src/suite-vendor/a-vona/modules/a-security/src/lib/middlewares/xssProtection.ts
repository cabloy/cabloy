import type { Next, VonaContext } from 'vona';

import type { IMiddlewareSystemOptionsSecurities } from '../../bean/middlewareSystem.securities.ts';

import { checkIfIgnore } from '../utils.ts';

export default (options: IMiddlewareSystemOptionsSecurities['xssProtection']) => {
  return async function xssProtection(ctx: VonaContext, next: Next) {
    await next();
    if (checkIfIgnore(options, ctx)) return;
    ctx.set('x-xss-protection', options.value);
  };
};
