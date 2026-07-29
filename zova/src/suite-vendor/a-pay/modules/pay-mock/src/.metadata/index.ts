// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModulePayMock extends BeanScopeBase {}

export interface ScopeModulePayMock {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'pay-mock': ScopeModulePayMock;
  }
  
  

  

  
}

/** scope: end */
