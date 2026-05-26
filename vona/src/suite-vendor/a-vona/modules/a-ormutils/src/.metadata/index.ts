// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAOrmutils extends BeanScopeBase {}

export interface ScopeModuleAOrmutils {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-ormutils': ScopeModuleAOrmutils;
  }

  export interface IBeanScopeContainer {
    ormutils: ScopeModuleAOrmutils;
  }
  
  

  

  
}
/** scope: end */
