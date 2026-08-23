// eslint-disable
/** ssrMenu: begin */
export * from '../bean/ssrMenu.admin.ts';
export * from '../bean/ssrMenu.demo.ts';
import type { ISsrMenuOptionsAdmin } from '../bean/ssrMenu.admin.ts';
import type { ISsrMenuOptionsDemo } from '../bean/ssrMenu.demo.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {

    export interface ISsrMenuRecord {
      'demo-basic:admin': ISsrMenuOptionsAdmin;
'demo-basic:demo': ISsrMenuOptionsDemo;
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

        export interface SsrMenuDemo {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

          export interface SsrMenuDemo {
            get $beanFullName(): 'demo-basic.ssrMenu.demo';
            get $onionName(): 'demo-basic:demo';
            get $onionOptions(): ISsrMenuOptionsDemo;
          }
}
/** ssrMenu: end */
/** ssrMenuGroup: begin */
export * from '../bean/ssrMenuGroup.demo.ts';
import type { ISsrMenuGroupOptionsDemo } from '../bean/ssrMenuGroup.demo.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {

    export interface ISsrMenuGroupRecord {
      'demo-basic:demo': ISsrMenuGroupOptionsDemo;
    }


}
declare module 'vona-module-demo-basic' {

        export interface SsrMenuGroupDemo {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

          export interface SsrMenuGroupDemo {
            get $beanFullName(): 'demo-basic.ssrMenuGroup.demo';
            get $onionName(): 'demo-basic:demo';
            get $onionOptions(): ISsrMenuGroupOptionsDemo;
          }
}
/** ssrMenuGroup: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleDemoBasic extends BeanScopeBase {}

export interface ScopeModuleDemoBasic {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'demo-basic': ScopeModuleDemoBasic;
  }

  export interface IBeanScopeContainer {
    demoBasic: ScopeModuleDemoBasic;
  }



  export interface IBeanScopeLocale {
    'demo-basic': (typeof locales)[TypeLocaleBase];
  }


}
/** scope: end */
