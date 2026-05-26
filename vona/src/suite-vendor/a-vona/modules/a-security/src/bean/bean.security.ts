import { URL } from 'node:url';
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IMiddlewareSystemOptionsCors } from './middlewareSystem.cors.ts';

import { isSafeDomain } from '../lib/utils.ts';

@Bean()
export class BeanSecurity extends BeanBase {
  checkOrigin(origin: string | undefined | null, hostCurrent?: string): string {
    if (!origin || origin === 'null' || origin === null) origin = 'null';
    // origin is {protocol}{hostname}{port}...
    if (this.isSafeDomain(origin, hostCurrent)) {
      return origin;
    }
    return '';
  }

  isSafeDomain(origin: string | undefined | null, hostCurrent?: string): boolean {
    // origin is {protocol}{hostname}{port}...
    if (!origin || origin === 'null' || origin === null) return true;

    let parsedUrl;
    try {
      parsedUrl = new URL(origin);
    } catch (_) {
      return false;
    }

    if (parsedUrl.host === hostCurrent) return true;

    // whiteList
    // todo: combine app config
    const onionCors = this.bean.onion.middlewareSystem.getOnionSlice('a-security:cors');
    let whiteListCors = (<IMiddlewareSystemOptionsCors>onionCors.beanOptions.options).whiteList;
    if (whiteListCors === '*') return true;
    if (!whiteListCors) return false;
    if (typeof whiteListCors === 'string') {
      whiteListCors = whiteListCors.split(',');
    }

    if (isSafeDomain(parsedUrl.hostname, whiteListCors) || isSafeDomain(origin, whiteListCors)) {
      return true;
    }
    return false;
  }
}

// getWhiteListCors(ctx) {
//   let whiteListCors;
//   const _config = ctx.app.bean._getScope('a-base').config;
//   const _whiteList = (_config && _config.cors && _config.cors.whiteList) || [];
//   if (!Array.isArray(_whiteList)) {
//     whiteListCors = _whiteList.split(',');
//   } else {
//     whiteListCors = _whiteList.concat();
//   }
//   // inherits from jsonp
//   let _whiteListJsonp = _config && _config.jsonp && _config.jsonp.whiteList;
//   if (_whiteListJsonp) {
//     if (!Array.isArray(_whiteListJsonp)) {
//       _whiteListJsonp = _whiteListJsonp.split(',');
//     }
//     whiteListCors = whiteListCors.concat(_whiteListJsonp);
//   }
//   // hostSelf
//   const hostSelf = ctx.app.bean.base.getAbsoluteUrl();
//   if (hostSelf) {
//     whiteListCors.push(hostSelf);
//   }
//   // ok
//   return whiteListCors;
// }
