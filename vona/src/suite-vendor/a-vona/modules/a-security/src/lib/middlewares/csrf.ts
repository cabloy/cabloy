import type { Next, VonaContext } from 'vona';

import typeis from 'type-is';

import type { IMiddlewareSystemOptionsSecurities } from '../../bean/middlewareSystem.securities.ts';

import { checkIfIgnore } from '../utils.ts';

export default (options: IMiddlewareSystemOptionsSecurities['csrf']) => {
  return function csrf(ctx: VonaContext, next: Next) {
    if (checkIfIgnore(options, ctx)) {
      return next();
    }

    // // ensure csrf token exists
    // if (['any', 'all', 'ctoken'].includes(options.type)) {
    //   ctx.ensureCsrfSecret();
    // }

    // supported requests
    const method = ctx.method;
    let isSupported = false;
    for (const eachRule of options.supportedRequests) {
      if (eachRule.path.test(ctx.path)) {
        if (eachRule.methods.includes(method)) {
          isSupported = true;
          break;
        }
      }
    }
    if (!isSupported) {
      return next();
    }

    if (options.ignoreJSON && typeis.is(ctx.get('content-type'), 'json')) {
      return next();
    }

    // ctx.assertCsrf();
    return next();
  };
};
