// eslint-disable
/** aopMethod: begin */
export * from '../bean/aopMethod.retryable.ts';
import type { IAopMethodOptionsRetryable } from '../bean/aopMethod.retryable.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IAopMethodRecord {
      'a-retryable:retryable': IAopMethodOptionsRetryable;
    }

  
}
declare module 'vona-module-a-retryable' {
  
        export interface AopMethodRetryable {
          /** @internal */
          get scope(): ScopeModuleARetryable;
        }

          export interface AopMethodRetryable {
            get $beanFullName(): 'a-retryable.aopMethod.retryable';
            get $onionName(): 'a-retryable:retryable';
            get $onionOptions(): IAopMethodOptionsRetryable;
          } 
}
/** aopMethod: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleARetryable extends BeanScopeBase {}

export interface ScopeModuleARetryable {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-retryable': ScopeModuleARetryable;
  }

  export interface IBeanScopeContainer {
    retryable: ScopeModuleARetryable;
  }
  
  

  

  
}
/** scope: end */
