// eslint-disable
/** interceptor: begin */
export * from '../bean/interceptor.body.ts';
export * from '../bean/interceptor.headers.ts';
export * from '../bean/interceptor.jwt.ts';
export * from '../bean/interceptor.mock.ts';
export * from '../bean/interceptor.performAction.ts';
import { IInterceptorOptionsBody } from '../bean/interceptor.body.ts';
import { IInterceptorOptionsHeaders } from '../bean/interceptor.headers.ts';
import { IInterceptorOptionsJwt } from '../bean/interceptor.jwt.ts';
import { IInterceptorOptionsMock } from '../bean/interceptor.mock.ts';
import { IInterceptorOptionsPerformAction } from '../bean/interceptor.performAction.ts';
import 'zova-module-a-fetch';
declare module 'zova-module-a-fetch' {

    export interface IInterceptorRecord {
      'a-interceptor:body': IInterceptorOptionsBody;
'a-interceptor:headers': IInterceptorOptionsHeaders;
'a-interceptor:jwt': IInterceptorOptionsJwt;
'a-interceptor:mock': IInterceptorOptionsMock;
'a-interceptor:performAction': IInterceptorOptionsPerformAction;
    }


}
declare module 'zova-module-a-interceptor' {

        export interface InterceptorBody {
          /** @internal */
          get scope(): ScopeModuleAInterceptor;
        }

        export interface InterceptorBody {
          get $beanFullName(): 'a-interceptor.interceptor.body';
          get $onionName(): 'a-interceptor:body';
          get $onionOptions(): IInterceptorOptionsBody;
        }

        export interface InterceptorHeaders {
          /** @internal */
          get scope(): ScopeModuleAInterceptor;
        }

        export interface InterceptorHeaders {
          get $beanFullName(): 'a-interceptor.interceptor.headers';
          get $onionName(): 'a-interceptor:headers';
          get $onionOptions(): IInterceptorOptionsHeaders;
        }

        export interface InterceptorJwt {
          /** @internal */
          get scope(): ScopeModuleAInterceptor;
        }

        export interface InterceptorJwt {
          get $beanFullName(): 'a-interceptor.interceptor.jwt';
          get $onionName(): 'a-interceptor:jwt';
          get $onionOptions(): IInterceptorOptionsJwt;
        }

        export interface InterceptorMock {
          /** @internal */
          get scope(): ScopeModuleAInterceptor;
        }

        export interface InterceptorMock {
          get $beanFullName(): 'a-interceptor.interceptor.mock';
          get $onionName(): 'a-interceptor:mock';
          get $onionOptions(): IInterceptorOptionsMock;
        }

        export interface InterceptorPerformAction {
          /** @internal */
          get scope(): ScopeModuleAInterceptor;
        }

        export interface InterceptorPerformAction {
          get $beanFullName(): 'a-interceptor.interceptor.performAction';
          get $onionName(): 'a-interceptor:performAction';
          get $onionOptions(): IInterceptorOptionsPerformAction;
        }
}
/** interceptor: end */
/** interceptor: begin */
import type { InterceptorBody } from '../bean/interceptor.body.ts';
import type { InterceptorHeaders } from '../bean/interceptor.headers.ts';
import type { InterceptorJwt } from '../bean/interceptor.jwt.ts';
import type { InterceptorMock } from '../bean/interceptor.mock.ts';
import type { InterceptorPerformAction } from '../bean/interceptor.performAction.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-interceptor.interceptor.body': InterceptorBody;
'a-interceptor.interceptor.headers': InterceptorHeaders;
'a-interceptor.interceptor.jwt': InterceptorJwt;
'a-interceptor.interceptor.mock': InterceptorMock;
'a-interceptor.interceptor.performAction': InterceptorPerformAction;
  }
}
/** interceptor: end */
/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAInterceptor extends BeanScopeBase {}

export interface ScopeModuleAInterceptor {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-interceptor': ScopeModuleAInterceptor;
  }

  export interface IBeanScopeConfig {
    'a-interceptor': ReturnType<typeof config>;
  }




}

/** scope: end */
