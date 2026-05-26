// eslint-disable
/** middlewareSystem: begin */
export * from '../bean/middlewareSystem.cors.ts';
export * from '../bean/middlewareSystem.securities.ts';
import type { IMiddlewareSystemOptionsCors } from '../bean/middlewareSystem.cors.ts';
import type { IMiddlewareSystemOptionsSecurities } from '../bean/middlewareSystem.securities.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IMiddlewareSystemRecord {
      'a-security:cors': IMiddlewareSystemOptionsCors;
'a-security:securities': IMiddlewareSystemOptionsSecurities;
    }

  
}
declare module 'vona-module-a-security' {
  
        export interface MiddlewareSystemCors {
          /** @internal */
          get scope(): ScopeModuleASecurity;
        }

          export interface MiddlewareSystemCors {
            get $beanFullName(): 'a-security.middlewareSystem.cors';
            get $onionName(): 'a-security:cors';
            get $onionOptions(): IMiddlewareSystemOptionsCors;
          }

        export interface MiddlewareSystemSecurities {
          /** @internal */
          get scope(): ScopeModuleASecurity;
        }

          export interface MiddlewareSystemSecurities {
            get $beanFullName(): 'a-security.middlewareSystem.securities';
            get $onionName(): 'a-security:securities';
            get $onionOptions(): IMiddlewareSystemOptionsSecurities;
          } 
}
/** middlewareSystem: end */
/** bean: begin */
export * from '../bean/bean.security.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-security' {
  
        export interface BeanSecurity {
          /** @internal */
          get scope(): ScopeModuleASecurity;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanSecurity } from '../bean/bean.security.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'security': BeanSecurity;
  }
}
/** bean: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleASecurity extends BeanScopeBase {}

export interface ScopeModuleASecurity {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-security': ScopeModuleASecurity;
  }

  export interface IBeanScopeContainer {
    security: ScopeModuleASecurity;
  }
  
  

  

  
}
/** scope: end */
