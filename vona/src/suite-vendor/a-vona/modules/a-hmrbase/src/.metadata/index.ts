// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAHmrbase extends BeanScopeBase {}

export interface ScopeModuleAHmrbase {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-hmrbase': ScopeModuleAHmrbase;
  }

  export interface IBeanScopeContainer {
    hmrbase: ScopeModuleAHmrbase;
  }
  
  

  

  
}
/** scope: end */
