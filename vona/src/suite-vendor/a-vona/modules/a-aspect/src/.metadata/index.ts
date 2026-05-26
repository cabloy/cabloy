// eslint-disable
/** hmr: begin */
export * from '../bean/hmr.aop.ts';
export * from '../bean/hmr.aopMethod.ts';
export * from '../bean/hmr.filter.ts';
export * from '../bean/hmr.guard.ts';
export * from '../bean/hmr.interceptor.ts';
export * from '../bean/hmr.middleware.ts';
export * from '../bean/hmr.middlewareSystem.ts';
export * from '../bean/hmr.pipe.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-aspect:aop': never;
'a-aspect:aopMethod': never;
'a-aspect:filter': never;
'a-aspect:guard': never;
'a-aspect:interceptor': never;
'a-aspect:middleware': never;
'a-aspect:middlewareSystem': never;
'a-aspect:pipe': never;
    }

  
}
declare module 'vona-module-a-aspect' {
  
        export interface HmrAop {
          /** @internal */
          get scope(): ScopeModuleAAspect;
        }

          export interface HmrAop {
            get $beanFullName(): 'a-aspect.hmr.aop';
            get $onionName(): 'a-aspect:aop';
            
          }

        export interface HmrAopMethod {
          /** @internal */
          get scope(): ScopeModuleAAspect;
        }

          export interface HmrAopMethod {
            get $beanFullName(): 'a-aspect.hmr.aopMethod';
            get $onionName(): 'a-aspect:aopMethod';
            
          }

        export interface HmrFilter {
          /** @internal */
          get scope(): ScopeModuleAAspect;
        }

          export interface HmrFilter {
            get $beanFullName(): 'a-aspect.hmr.filter';
            get $onionName(): 'a-aspect:filter';
            
          }

        export interface HmrGuard {
          /** @internal */
          get scope(): ScopeModuleAAspect;
        }

          export interface HmrGuard {
            get $beanFullName(): 'a-aspect.hmr.guard';
            get $onionName(): 'a-aspect:guard';
            
          }

        export interface HmrInterceptor {
          /** @internal */
          get scope(): ScopeModuleAAspect;
        }

          export interface HmrInterceptor {
            get $beanFullName(): 'a-aspect.hmr.interceptor';
            get $onionName(): 'a-aspect:interceptor';
            
          }

        export interface HmrMiddleware {
          /** @internal */
          get scope(): ScopeModuleAAspect;
        }

          export interface HmrMiddleware {
            get $beanFullName(): 'a-aspect.hmr.middleware';
            get $onionName(): 'a-aspect:middleware';
            
          }

        export interface HmrMiddlewareSystem {
          /** @internal */
          get scope(): ScopeModuleAAspect;
        }

          export interface HmrMiddlewareSystem {
            get $beanFullName(): 'a-aspect.hmr.middlewareSystem';
            get $onionName(): 'a-aspect:middlewareSystem';
            
          }

        export interface HmrPipe {
          /** @internal */
          get scope(): ScopeModuleAAspect;
        }

          export interface HmrPipe {
            get $beanFullName(): 'a-aspect.hmr.pipe';
            get $onionName(): 'a-aspect:pipe';
            
          } 
}
/** hmr: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAAspect extends BeanScopeBase {}

export interface ScopeModuleAAspect {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-aspect': ScopeModuleAAspect;
  }

  export interface IBeanScopeContainer {
    aspect: ScopeModuleAAspect;
  }
  
  

  

  
}
/** scope: end */
