// eslint-disable
/** ssrSite: begin */
export * from '../bean/ssrSite.admin.ts';
import type { ISsrSiteOptionsAdmin } from '../bean/ssrSite.admin.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrSiteRecord {
      'basic-siteadmin:admin': ISsrSiteOptionsAdmin;
    }

  
}
declare module 'vona-module-basic-siteadmin' {
  
        export interface SsrSiteAdmin {
          /** @internal */
          get scope(): ScopeModuleBasicSiteadmin;
        }

          export interface SsrSiteAdmin {
            get $beanFullName(): 'basic-siteadmin.ssrSite.admin';
            get $onionName(): 'basic-siteadmin:admin';
            get $onionOptions(): ISsrSiteOptionsAdmin;
          } 
}
/** ssrSite: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.home.ts';
import type { ISsrMenuOptionsHome } from '../bean/ssrMenu.home.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'basic-siteadmin:home': ISsrMenuOptionsHome;
    }

  
}
declare module 'vona-module-basic-siteadmin' {
  
        export interface SsrMenuHome {
          /** @internal */
          get scope(): ScopeModuleBasicSiteadmin;
        }

          export interface SsrMenuHome {
            get $beanFullName(): 'basic-siteadmin.ssrMenu.home';
            get $onionName(): 'basic-siteadmin:home';
            get $onionOptions(): ISsrMenuOptionsHome;
          } 
}
/** ssrMenu: end */
/** ssrMenuGroup: begin */
export * from '../bean/ssrMenuGroup.management.ts';
import type { ISsrMenuGroupOptionsManagement } from '../bean/ssrMenuGroup.management.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuGroupRecord {
      'basic-siteadmin:management': ISsrMenuGroupOptionsManagement;
    }

  
}
declare module 'vona-module-basic-siteadmin' {
  
        export interface SsrMenuGroupManagement {
          /** @internal */
          get scope(): ScopeModuleBasicSiteadmin;
        }

          export interface SsrMenuGroupManagement {
            get $beanFullName(): 'basic-siteadmin.ssrMenuGroup.management';
            get $onionName(): 'basic-siteadmin:management';
            get $onionOptions(): ISsrMenuGroupOptionsManagement;
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
export class ScopeModuleBasicSiteadmin extends BeanScopeBase {}

export interface ScopeModuleBasicSiteadmin {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'basic-siteadmin': ScopeModuleBasicSiteadmin;
  }

  export interface IBeanScopeContainer {
    basicSiteadmin: ScopeModuleBasicSiteadmin;
  }
  
  

  export interface IBeanScopeLocale {
    'basic-siteadmin': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
