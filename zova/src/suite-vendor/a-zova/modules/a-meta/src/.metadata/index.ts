// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAMeta extends BeanScopeBase {}

export interface ScopeModuleAMeta {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-meta': ScopeModuleAMeta;
  }
  
  

  

  
}
  
/** scope: end */
