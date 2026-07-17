// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleCommerceSiteadmin extends BeanScopeBase {}

export interface ScopeModuleCommerceSiteadmin {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'commerce-siteadmin': ScopeModuleCommerceSiteadmin;
  }
  
  

  

  
}
  
/** scope: end */
