// eslint-disable
/** interceptor: begin */
export * from '../bean/interceptor.bodyReq.ts';
export * from '../bean/interceptor.bodyRes.ts';
import type { IInterceptorOptionsBodyReq } from '../bean/interceptor.bodyReq.ts';
import type { IInterceptorOptionsBodyRes } from '../bean/interceptor.bodyRes.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IInterceptorRecordGlobal {
      'a-body:bodyReq': IInterceptorOptionsBodyReq;
'a-body:bodyRes': IInterceptorOptionsBodyRes;
    }

  
}
declare module 'vona-module-a-body' {
  
        export interface InterceptorBodyReq {
          /** @internal */
          get scope(): ScopeModuleABody;
        }

          export interface InterceptorBodyReq {
            get $beanFullName(): 'a-body.interceptor.bodyReq';
            get $onionName(): 'a-body:bodyReq';
            get $onionOptions(): IInterceptorOptionsBodyReq;
          }

        export interface InterceptorBodyRes {
          /** @internal */
          get scope(): ScopeModuleABody;
        }

          export interface InterceptorBodyRes {
            get $beanFullName(): 'a-body.interceptor.bodyRes';
            get $onionName(): 'a-body:bodyRes';
            get $onionOptions(): IInterceptorOptionsBodyRes;
          } 
}
/** interceptor: end */
/** bean: begin */
export * from '../bean/bean.bodyReq.ts';
export * from '../bean/bean.bodyRes.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-body' {
  
        export interface BeanBodyReq {
          /** @internal */
          get scope(): ScopeModuleABody;
        }

        export interface BeanBodyRes {
          /** @internal */
          get scope(): ScopeModuleABody;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanBodyReq } from '../bean/bean.bodyReq.ts';
import type { BeanBodyRes } from '../bean/bean.bodyRes.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'bodyReq': BeanBodyReq;
'bodyRes': BeanBodyRes;
  }
}
/** bean: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleABody extends BeanScopeBase {}

export interface ScopeModuleABody {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-body': ScopeModuleABody;
  }

  export interface IBeanScopeContainer {
    body: ScopeModuleABody;
  }
  
  

  

  
}
/** scope: end */
