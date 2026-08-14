// eslint-disable
/** bean: begin */
export * from '../bean/bean.markdown.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-markdown' {
  
        export interface BeanMarkdown {
          /** @internal */
          get scope(): ScopeModuleAMarkdown;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanMarkdown } from '../bean/bean.markdown.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'markdown': BeanMarkdown;
  }
}
/** bean: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAMarkdown extends BeanScopeBase {}

export interface ScopeModuleAMarkdown {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-markdown': ScopeModuleAMarkdown;
  }

  export interface IBeanScopeContainer {
    markdown: ScopeModuleAMarkdown;
  }
  
  

  

  
}
/** scope: end */
