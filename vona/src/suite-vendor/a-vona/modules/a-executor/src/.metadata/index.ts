// eslint-disable
/** bean: begin */
export * from '../bean/bean.executor.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-executor' {
  
        export interface BeanExecutor {
          /** @internal */
          get scope(): ScopeModuleAExecutor;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanExecutor } from '../bean/bean.executor.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'executor': BeanExecutor;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/executor.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-executor:executor': never;
    }

  
}
declare module 'vona-module-a-executor' {
  
        export interface ServiceExecutor {
          /** @internal */
          get scope(): ScopeModuleAExecutor;
        }

          export interface ServiceExecutor {
            get $beanFullName(): 'a-executor.service.executor';
            get $onionName(): 'a-executor:executor';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceExecutor } from '../service/executor.ts';
export interface IModuleService {
  'executor': ServiceExecutor;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-executor.service.executor': ServiceExecutor;
  }
}
/** service: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAExecutor extends BeanScopeBase {}

export interface ScopeModuleAExecutor {
  util: BeanScopeUtil;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-executor': ScopeModuleAExecutor;
  }

  export interface IBeanScopeContainer {
    executor: ScopeModuleAExecutor;
  }
  
  

  

  
}
/** scope: end */
