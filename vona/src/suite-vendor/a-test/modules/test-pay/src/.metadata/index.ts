// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTestPay extends BeanScopeBase {}

export interface ScopeModuleTestPay {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'test-pay': ScopeModuleTestPay;
  }

  export interface IBeanScopeContainer {
    testPay: ScopeModuleTestPay;
  }
  
  

  

  
}
/** scope: end */
