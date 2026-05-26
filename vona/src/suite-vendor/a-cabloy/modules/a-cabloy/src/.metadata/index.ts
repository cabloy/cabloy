// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleACabloy extends BeanScopeBase {}

export interface ScopeModuleACabloy {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-cabloy': ScopeModuleACabloy;
  }

  export interface IBeanScopeContainer {
    cabloy: ScopeModuleACabloy;
  }
  
  

  

  
}
/** scope: end */
