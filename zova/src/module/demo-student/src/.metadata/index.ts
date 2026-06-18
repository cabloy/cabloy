// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleDemoStudent extends BeanScopeBase {}

export interface ScopeModuleDemoStudent {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'demo-student': ScopeModuleDemoStudent;
  }
  
  

  

  
}
  
/** scope: end */
