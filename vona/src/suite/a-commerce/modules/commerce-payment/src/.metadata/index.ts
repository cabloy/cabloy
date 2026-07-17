// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleCommercePayment extends BeanScopeBase {}

export interface ScopeModuleCommercePayment {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-payment': ScopeModuleCommercePayment;
  }

  export interface IBeanScopeContainer {
    commercePayment: ScopeModuleCommercePayment;
  }
  
  

  

  
}
/** scope: end */
