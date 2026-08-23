// eslint-disable
/** ssrSite: begin */
export * from '../bean/ssrSite.commerce.ts';
import type { ISsrSiteOptionsCommerce } from '../bean/ssrSite.commerce.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {

    export interface ISsrSiteRecord {
      'commerce-siteweb:commerce': ISsrSiteOptionsCommerce;
    }


}
declare module 'vona-module-commerce-siteweb' {

        export interface SsrSiteCommerce {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteweb;
        }

          export interface SsrSiteCommerce {
            get $beanFullName(): 'commerce-siteweb.ssrSite.commerce';
            get $onionName(): 'commerce-siteweb:commerce';
            get $onionOptions(): ISsrSiteOptionsCommerce;
          }
}
/** ssrSite: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.home.ts';
import type { ISsrMenuOptionsHome } from '../bean/ssrMenu.home.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {

    export interface ISsrMenuRecord {
      'commerce-siteweb:home': ISsrMenuOptionsHome;
    }


}
declare module 'vona-module-commerce-siteweb' {

        export interface SsrMenuHome {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteweb;
        }

          export interface SsrMenuHome {
            get $beanFullName(): 'commerce-siteweb.ssrMenu.home';
            get $onionName(): 'commerce-siteweb:home';
            get $onionOptions(): ISsrMenuOptionsHome;
          }
}
/** ssrMenu: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleCommerceSiteweb extends BeanScopeBase {}

export interface ScopeModuleCommerceSiteweb {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-siteweb': ScopeModuleCommerceSiteweb;
  }

  export interface IBeanScopeContainer {
    commerceSiteweb: ScopeModuleCommerceSiteweb;
  }



  export interface IBeanScopeLocale {
    'commerce-siteweb': (typeof locales)[TypeLocaleBase];
  }


}
/** scope: end */
