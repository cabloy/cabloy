// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleCommerceCatalog extends BeanScopeBase {}

export interface ScopeModuleCommerceCatalog {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-catalog': ScopeModuleCommerceCatalog;
  }

  export interface IBeanScopeContainer {
    commerceCatalog: ScopeModuleCommerceCatalog;
  }
  
  

  

  
}
/** scope: end */
