// eslint-disable
import type { TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** meta: begin */
export * from '../bean/meta.printTip.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'home-index:printTip': never;
    }

  
}
declare module 'vona-module-home-index' {
  
        export interface MetaPrintTip {
          /** @internal */
          get scope(): ScopeModuleHomeIndex;
        }

          export interface MetaPrintTip {
            get $beanFullName(): 'home-index.meta.printTip';
            get $onionName(): 'home-index:printTip';
            
          } 
}
/** meta: end */
/** controller: begin */
export * from '../controller/home.ts';
import type { IControllerOptionsHome } from '../controller/home.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'home-index:home': IControllerOptionsHome;
    }

  
}
declare module 'vona-module-home-index' {
  
        export interface ControllerHome {
          /** @internal */
          get scope(): ScopeModuleHomeIndex;
        }

          export interface ControllerHome {
            get $beanFullName(): 'home-index.controller.home';
            get $onionName(): 'home-index:home';
            get $onionOptions(): IControllerOptionsHome;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerHome } from '../controller/home.ts';
declare module 'vona-module-home-index' {
  
    export interface IControllerOptionsHome {
      actions?: TypeControllerOptionsActions<ControllerHome>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '//': undefined;
    }

}

/** controller: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleHomeIndex extends BeanScopeBase {}

export interface ScopeModuleHomeIndex {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'home-index': ScopeModuleHomeIndex;
  }

  export interface IBeanScopeContainer {
    homeIndex: ScopeModuleHomeIndex;
  }
  
  

  export interface IBeanScopeLocale {
    'home-index': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
