// eslint-disable
/** ssrSite: begin */
export * from '../bean/ssrSite.web.ts';
import type { ISsrSiteOptionsWeb } from '../bean/ssrSite.web.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {

    export interface ISsrSiteRecord {
      'basic-siteweb:web': ISsrSiteOptionsWeb;
    }


}
declare module 'vona-module-basic-siteweb' {

        export interface SsrSiteWeb {
          /** @internal */
          get scope(): ScopeModuleBasicSiteweb;
        }

          export interface SsrSiteWeb {
            get $beanFullName(): 'basic-siteweb.ssrSite.web';
            get $onionName(): 'basic-siteweb:web';
            get $onionOptions(): ISsrSiteOptionsWeb;
          }
}
/** ssrSite: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.home.ts';
import type { ISsrMenuOptionsHome } from '../bean/ssrMenu.home.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {

    export interface ISsrMenuRecord {
      'basic-siteweb:home': ISsrMenuOptionsHome;
    }


}
declare module 'vona-module-basic-siteweb' {

        export interface SsrMenuHome {
          /** @internal */
          get scope(): ScopeModuleBasicSiteweb;
        }

          export interface SsrMenuHome {
            get $beanFullName(): 'basic-siteweb.ssrMenu.home';
            get $onionName(): 'basic-siteweb:home';
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
export class ScopeModuleBasicSiteweb extends BeanScopeBase {}

export interface ScopeModuleBasicSiteweb {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'basic-siteweb': ScopeModuleBasicSiteweb;
  }

  export interface IBeanScopeContainer {
    basicSiteweb: ScopeModuleBasicSiteweb;
  }



  export interface IBeanScopeLocale {
    'basic-siteweb': (typeof locales)[TypeLocaleBase];
  }


}
/** scope: end */
