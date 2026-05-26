import type { Next, VonaContext } from 'vona';

import type { IMiddlewareSystemOptionsSecurities } from '../../bean/middlewareSystem.securities.ts';

import { checkIfIgnore } from '../utils.ts';

// https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referrer-Policy
const ALLOWED_POLICIES_ENUM = [
  'no-referrer',
  'no-referrer-when-downgrade',
  'origin',
  'origin-when-cross-origin',
  'same-origin',
  'strict-origin',
  'strict-origin-when-cross-origin',
  'unsafe-url',
  '',
];

export default (options: IMiddlewareSystemOptionsSecurities['referrerPolicy']) => {
  return async function referrerPolicy(ctx: VonaContext, next: Next) {
    await next();
    // check refererPolicy for backward compatibility
    // typo on the old version
    // @see https://github.com/eggjs/security/blob/e3408408adec5f8d009d37f75126ed082481d0ac/lib/middlewares/referrerPolicy.js#L21C59-L21C72
    if (checkIfIgnore(options, ctx)) return;
    const policy = options.value;
    if (!ALLOWED_POLICIES_ENUM.includes(policy)) {
      throw new Error(`"${policy}" is not available.`);
    }
    ctx.set('referrer-policy', policy);
  };
};
