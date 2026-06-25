// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicResource extends BeanScopeBase {}

export interface ScopeModuleBasicResource {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-resource': ScopeModuleBasicResource;
  }
  
  

  

  
}
  
/** scope: end */
