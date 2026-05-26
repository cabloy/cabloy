import type { Next, VonaContext } from 'vona';

import type { IMiddlewareSystemOptionsSecurities } from '../../bean/middlewareSystem.securities.ts';

import { checkIfIgnore } from '../utils.ts';

// Set Strict-Transport-Security header
export default (options: IMiddlewareSystemOptionsSecurities['hsts']) => {
  return async function hsts(ctx: VonaContext, next: Next) {
    await next();
    if (checkIfIgnore(options, ctx)) return;
    let val = `max-age=${options.maxAge}`;
    // If opts.includeSubdomains is defined,
    // the rule is also valid for all the sub domains of the website
    if (options.includeSubdomains) {
      val += '; includeSubdomains';
    }
    ctx.set('strict-transport-security', val);
  };
};
