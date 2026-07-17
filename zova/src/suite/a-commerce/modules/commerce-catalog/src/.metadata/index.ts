// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleCommerceCatalog extends BeanScopeBase {}

export interface ScopeModuleCommerceCatalog {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'commerce-catalog': ScopeModuleCommerceCatalog;
  }
  
  

  

  
}
  
/** scope: end */
