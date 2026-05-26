// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleABoundary extends BeanScopeBase {}

export interface ScopeModuleABoundary {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-boundary': ScopeModuleABoundary;
  }
  
  

  

  
}
  
/** scope: end */
