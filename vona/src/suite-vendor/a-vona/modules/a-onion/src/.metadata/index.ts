// eslint-disable
/** bean: begin */
export * from '../bean/bean.onion.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-onion' {
  
        export interface BeanOnion {
          /** @internal */
          get scope(): ScopeModuleAOnion;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanOnion } from '../bean/bean.onion.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'onion': BeanOnion;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/onion_.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
  
}
declare module 'vona-module-a-onion' {
   
}
/** service: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAOnion extends BeanScopeBase {}

export interface ScopeModuleAOnion {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-onion': ScopeModuleAOnion;
  }

  export interface IBeanScopeContainer {
    onion: ScopeModuleAOnion;
  }
  
  

  

  
}
/** scope: end */
