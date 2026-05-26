import type { Next, VonaContext } from 'vona';

import { deepExtend } from 'vona';

import type { IMiddlewareSystemOptionsSecurities } from '../../bean/middlewareSystem.securities.ts';

import { checkIfIgnore } from '../utils.ts';

const HEADER = ['x-content-security-policy', 'content-security-policy'];
const REPORT_ONLY_HEADER = [
  'x-content-security-policy-report-only',
  'content-security-policy-report-only',
];

// Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)
const MSIE_REGEXP = / MSIE /i;

export default (options: IMiddlewareSystemOptionsSecurities['csp']) => {
  return async function csp(ctx: VonaContext, next: Next) {
    await next();

    if (checkIfIgnore(options, ctx)) return;

    let finalHeader;
    const matchedOption = deepExtend({}, options.policy);
    const bufArray: any[] = [];

    const headers = options.reportOnly ? REPORT_ONLY_HEADER : HEADER;
    if (options.supportIE && MSIE_REGEXP.test(ctx.get('user-agent'))) {
      finalHeader = headers[0];
    } else {
      finalHeader = headers[1];
    }

    for (const key in matchedOption) {
      const value = matchedOption[key];
      // Other arrays are splitted into strings EXCEPT `sandbox`
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox
      if (key === 'sandbox' && value === true) {
        bufArray.push(key);
      } else {
        let values = (Array.isArray(value) ? value : [value]) as string[];
        // if (key === 'script-src') {
        //   const hasNonce = values.some(val => {
        //     return val.includes('nonce-');
        //   });

        //   if (!hasNonce) {
        //     values.push(`'nonce-${ctx.nonce}'`);
        //   }
        // }

        values = values.map(d => {
          if (d.startsWith('.')) {
            d = `*${d}`;
          }
          return d;
        });
        bufArray.push(`${key} ${values.join(' ')}`);
      }
    }
    const headerString = bufArray.join(';');
    ctx.set(finalHeader, headerString);
    // ctx.set('x-csp-nonce', ctx.nonce);
  };
};
