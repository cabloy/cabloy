// eslint-disable
/** interceptor: begin */
export * from '../bean/interceptor.rateLimit.ts';
import type { IInterceptorOptionsRateLimit } from '../bean/interceptor.rateLimit.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {

    export interface IInterceptorRecordGlobal {
      'a-ratelimit:rateLimit': IInterceptorOptionsRateLimit;
    }


}
declare module 'vona-module-a-ratelimit' {

        export interface InterceptorRateLimit {
          /** @internal */
          get scope(): ScopeModuleARatelimit;
        }

          export interface InterceptorRateLimit {
            get $beanFullName(): 'a-ratelimit.interceptor.rateLimit';
            get $onionName(): 'a-ratelimit:rateLimit';
            get $onionOptions(): IInterceptorOptionsRateLimit;
          }
}
/** interceptor: end */
/** middlewareSystem: begin */
export * from '../bean/middlewareSystem.aggregate.ts';
import type { IMiddlewareSystemOptionsAggregate } from '../bean/middlewareSystem.aggregate.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {

    export interface IMiddlewareSystemRecord {
      'a-ratelimit:aggregate': IMiddlewareSystemOptionsAggregate;
    }


}
declare module 'vona-module-a-ratelimit' {

        export interface MiddlewareSystemAggregate {
          /** @internal */
          get scope(): ScopeModuleARatelimit;
        }

          export interface MiddlewareSystemAggregate {
            get $beanFullName(): 'a-ratelimit.middlewareSystem.aggregate';
            get $onionName(): 'a-ratelimit:aggregate';
            get $onionOptions(): IMiddlewareSystemOptionsAggregate;
          }
}
/** middlewareSystem: end */
/** service: begin */
export * from '../service/rateLimit.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'a-ratelimit:rateLimit': never;
    }


}
declare module 'vona-module-a-ratelimit' {

        export interface ServiceRateLimit {
          /** @internal */
          get scope(): ScopeModuleARatelimit;
        }

          export interface ServiceRateLimit {
            get $beanFullName(): 'a-ratelimit.service.rateLimit';
            get $onionName(): 'a-ratelimit:rateLimit';
          }
}
/** service: end */
/** service: begin */
import type { ServiceRateLimit } from '../service/rateLimit.ts';
export interface IModuleService {
  'rateLimit': ServiceRateLimit;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-ratelimit.service.rateLimit': ServiceRateLimit;
  }
}
/** service: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleARatelimit extends BeanScopeBase {}

export interface ScopeModuleARatelimit {
  util: BeanScopeUtil;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-ratelimit': ScopeModuleARatelimit;
  }

  export interface IBeanScopeContainer {
    ratelimit: ScopeModuleARatelimit;
  }






}
/** scope: end */
