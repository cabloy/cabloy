// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleCommerceMember extends BeanScopeBase {}

export interface ScopeModuleCommerceMember {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-member': ScopeModuleCommerceMember;
  }

  export interface IBeanScopeContainer {
    commerceMember: ScopeModuleCommerceMember;
  }
  
  

  

  
}
/** scope: end */
