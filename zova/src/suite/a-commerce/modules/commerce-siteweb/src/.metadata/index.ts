// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleCommerceSiteweb extends BeanScopeBase {}

export interface ScopeModuleCommerceSiteweb {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'commerce-siteweb': ScopeModuleCommerceSiteweb;
  }
  
  

  

  
}
  
/** scope: end */
