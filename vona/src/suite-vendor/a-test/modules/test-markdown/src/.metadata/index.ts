// eslint-disable
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTestMarkdown extends BeanScopeBase {}

export interface ScopeModuleTestMarkdown {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'test-markdown': ScopeModuleTestMarkdown;
  }

  export interface IBeanScopeContainer {
    testMarkdown: ScopeModuleTestMarkdown;
  }
  
  

  

  
}
/** scope: end */
