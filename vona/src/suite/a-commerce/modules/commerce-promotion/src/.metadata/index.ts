// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleCommercePromotion extends BeanScopeBase {}

export interface ScopeModuleCommercePromotion {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-promotion': ScopeModuleCommercePromotion;
  }

  export interface IBeanScopeContainer {
    commercePromotion: ScopeModuleCommercePromotion;
  }
  
  

  

  
}
/** scope: end */
