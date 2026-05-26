import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { pathMatching } from 'egg-path-matching';
import assert from 'node:assert';
import { BeanBase, compose } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

import securityMiddlewares from '../lib/middlewares/index.ts';

export type SecurityMiddlewareName =
  | 'csrf'
  | 'hsts'
  | 'methodnoallow'
  | 'noopen'
  | 'nosniff'
  | 'csp'
  | 'xssProtection'
  | 'xframe'
  | 'dta';

export interface IMiddlewareSystemOptionsSecurities extends IDecoratorMiddlewareSystemOptions {
  domainWhiteList: string[];
  protocolWhiteList: string[];
  defaultMiddleware: string | SecurityMiddlewareName | SecurityMiddlewareName[];
  csrf: {
    match?: any;
    ignore?: any;
    enable: boolean;
    type: 'ctoken' | 'referer' | 'all' | 'any';
    ignoreJSON: boolean;
    cookieName: string | string[];
    sessionName: string;
    headerName: string;
    bodyName: string | string[];
    queryName: string | string[];
    rotateWhenInvalid: boolean;
    useSession: boolean;
    cookieDomain?: string | Function;
    supportedRequests: any;
    refererWhiteList: string[];
    cookieOptions: {
      signed: boolean;
      httpOnly: boolean;
      overwrite: boolean;
    };
  };
  xframe: {
    match?: any;
    ignore?: any;
    enable: boolean;
    value: string;
  };
  hsts: {
    match?: any;
    ignore?: any;
    enable: boolean;
    maxAge: number;
    includeSubdomains: boolean;
  };
  methodnoallow: {
    match?: any;
    ignore?: any;
    enable: boolean;
  };
  noopen: {
    match?: any;
    ignore?: any;
    enable: boolean;
  };
  nosniff: {
    match?: any;
    ignore?: any;
    enable: boolean;
  };
  xssProtection: {
    match?: any;
    ignore?: any;
    enable: boolean;
    value: string;
  };
  csp: {
    match?: any;
    ignore?: any;
    enable: boolean;
    policy: any;
    reportOnly?: boolean;
    supportIE?: boolean;
  };
  referrerPolicy: {
    match?: any;
    ignore?: any;
    enable: boolean;
    value: string;
  };
  dta: {
    match?: any;
    ignore?: any;
    enable: boolean;
  };
  ssrf: {
    ipBlackList?: string[];
    ipExceptionList?: string[];
    hostnameExceptionList?: string[];
    checkAddress?: any;
  };
}

@MiddlewareSystem<IMiddlewareSystemOptionsSecurities>({
  dependencies: 'a-security:cors',
  domainWhiteList: [],
  protocolWhiteList: [],
  defaultMiddleware: 'csrf,hsts,methodnoallow,noopen,nosniff,csp,xssProtection,xframe,dta',
  csrf: {
    enable: false,
    type: 'ctoken',
    ignoreJSON: false,
    cookieName: 'csrfToken',
    sessionName: 'csrfToken',
    headerName: 'x-csrf-token',
    bodyName: '_csrf',
    queryName: '_csrf',
    rotateWhenInvalid: false,
    useSession: false,
    cookieDomain: undefined,
    supportedRequests: [{ path: /^\//, methods: ['POST', 'PATCH', 'DELETE', 'PUT', 'CONNECT'] }],
    refererWhiteList: [],
    cookieOptions: {
      signed: false,
      httpOnly: false,
      overwrite: true,
    },
  },
  xframe: {
    enable: true,
    value: 'SAMEORIGIN',
  },
  hsts: {
    enable: true,
    maxAge: 365 * 24 * 3600,
    includeSubdomains: true,
  },
  methodnoallow: {
    enable: true,
  },
  noopen: {
    enable: true,
  },
  nosniff: {
    enable: true,
  },
  xssProtection: {
    enable: true,
    value: '1; mode=block',
  },
  csp: {
    enable: true,
    policy: {},
    reportOnly: undefined,
    supportIE: undefined,
  },
  referrerPolicy: {
    enable: true,
    value: 'no-referrer-when-downgrade',
  },
  dta: {
    enable: true,
  },
  ssrf: {
    ipBlackList: undefined,
    ipExceptionList: undefined,
    hostnameExceptionList: undefined,
    checkAddress: undefined,
  },
})
export class MiddlewareSystemSecurities extends BeanBase implements IMiddlewareSystemExecute {
  private _composer: any;

  async execute(options: IMiddlewareSystemOptionsSecurities, next: Next) {
    return this._getComposer(options)(this.ctx, next);
  }

  _getComposer(options: IMiddlewareSystemOptionsSecurities) {
    if (!this._composer) {
      const middlewares = this._createMiddlewares(options);
      this._composer = compose(middlewares);
    }
    return this._composer;
  }

  _createMiddlewares(options: IMiddlewareSystemOptionsSecurities) {
    const middlewares: Function[] = [];
    const defaultMiddlewares =
      typeof options.defaultMiddleware === 'string'
        ? (options.defaultMiddleware
            .split(',')
            .map(m => m.trim())
            .filter(m => !!m) as SecurityMiddlewareName[])
        : options.defaultMiddleware;

    if (options.match || options.ignore) {
      // this.app.coreLogger.warn('[@eggjs/security/middleware/securities] Please set `match` or `ignore` on sub config');
    }

    // format csrf.cookieDomain
    const originalCookieDomain = options.csrf.cookieDomain;
    if (originalCookieDomain && typeof originalCookieDomain !== 'function') {
      options.csrf.cookieDomain = () => originalCookieDomain;
    }

    defaultMiddlewares.forEach(middlewareName => {
      const opt = Reflect.get(options, middlewareName) as any;
      if (opt === false) {
        // this.app.coreLogger.warn(
        //   '[egg-security] Please use `config.security.%s = { enable: false }` instead of `config.security.%s = false`',
        //   middlewareName,
        //   middlewareName,
        // );
      }

      assert(
        opt === false || typeof opt === 'object',
        `config.security.${middlewareName} must be an object, or false(if you turn it off)`,
      );

      if (opt === false || (opt && opt.enable === false)) {
        return;
      }

      if (middlewareName === 'csrf' && opt.useSession) {
        throw new Error('csrf.useSession enabled, but session plugin is disabled');
      }
      // if (middlewareName === 'csrf' && opt.useSession && !this.app.plugins.session) {
      //   throw new Error('csrf.useSession enabled, but session plugin is disabled');
      // }

      // use opt.match first (compatibility)
      if (opt.match && opt.ignore) {
        // this.app.coreLogger.warn(
        //   '[@eggjs/security/middleware/securities] `options.match` and `options.ignore` are both set, using `options.match`',
        // );
        opt.ignore = undefined;
      }
      if (!opt.ignore && opt.blackUrls) {
        // this.app.deprecate(
        //   '[@eggjs/security/middleware/securities] Please use `config.security.xframe.ignore` instead, `config.security.xframe.blackUrls` will be removed very soon',
        // );
        opt.ignore = opt.blackUrls;
      }
      // set matching function to security middleware options
      opt.matching = pathMatching(opt);

      const createMiddleware = securityMiddlewares[middlewareName];
      const fn = createMiddleware(opt);
      middlewares.push(fn);
      // this.app.coreLogger.info('[@eggjs/security/middleware/securities] use %s middleware', middlewareName);
    });

    // this.app.coreLogger.info(
    //   '[@eggjs/security/middleware/securities] compose %d middlewares into one security middleware',
    //   middlewares.length,
    // );
    return middlewares;
  }
}
