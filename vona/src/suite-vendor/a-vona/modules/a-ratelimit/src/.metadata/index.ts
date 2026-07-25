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
/** service: begin */
export * from '../service/rateLimit_.ts';
import type { ServiceRateLimit } from '../service/rateLimit_.ts';
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
export interface IModuleService {
  rateLimit: ServiceRateLimit;
}
/** service: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';
@Scope()
export class ScopeModuleARatelimit extends BeanScopeBase {}
export interface ScopeModuleARatelimit {
  util: BeanScopeUtil;
  config: TypeModuleConfig<typeof config>;
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
  export interface IBeanScopeConfig {
    'a-ratelimit': ReturnType<typeof config>;
  }
}
/** scope: end */
