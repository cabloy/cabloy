// eslint-disable
/** ssrMenu: begin */
export * from '../bean/ssrMenu.admin.ts';
import type { ISsrMenuOptionsAdmin } from '../bean/ssrMenu.admin.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'demo-basic:admin': ISsrMenuOptionsAdmin;
    }

  
}
declare module 'vona-module-demo-basic' {
  
        export interface SsrMenuAdmin {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

          export interface SsrMenuAdmin {
            get $beanFullName(): 'demo-basic.ssrMenu.admin';
            get $onionName(): 'demo-basic:admin';
            get $onionOptions(): ISsrMenuOptionsAdmin;
          } 
}
/** ssrMenu: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleDemoBasic extends BeanScopeBase {}

export interface ScopeModuleDemoBasic {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'demo-basic': ScopeModuleDemoBasic;
  }

  export interface IBeanScopeContainer {
    demoBasic: ScopeModuleDemoBasic;
  }
  
  

  

  
}
/** scope: end */
