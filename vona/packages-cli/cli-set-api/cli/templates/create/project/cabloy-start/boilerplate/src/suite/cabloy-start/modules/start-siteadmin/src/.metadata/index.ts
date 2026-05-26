// eslint-disable
/** ssrSite: begin */
export * from '../bean/ssrSite.admin.ts';
import type { ISsrSiteOptionsAdmin } from '../bean/ssrSite.admin.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrSiteRecord {
      'start-siteadmin:admin': ISsrSiteOptionsAdmin;
    }

  
}
declare module 'vona-module-start-siteadmin' {
  
        export interface SsrSiteAdmin {
          /** @internal */
          get scope(): ScopeModuleStartSiteadmin;
        }

          export interface SsrSiteAdmin {
            get $beanFullName(): 'start-siteadmin.ssrSite.admin';
            get $onionName(): 'start-siteadmin:admin';
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
      'start-siteadmin:home': ISsrMenuOptionsHome;
    }

  
}
declare module 'vona-module-start-siteadmin' {
  
        export interface SsrMenuHome {
          /** @internal */
          get scope(): ScopeModuleStartSiteadmin;
        }

          export interface SsrMenuHome {
            get $beanFullName(): 'start-siteadmin.ssrMenu.home';
            get $onionName(): 'start-siteadmin:home';
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
      'start-siteadmin:management': ISsrMenuGroupOptionsManagement;
    }

  
}
declare module 'vona-module-start-siteadmin' {
  
        export interface SsrMenuGroupManagement {
          /** @internal */
          get scope(): ScopeModuleStartSiteadmin;
        }

          export interface SsrMenuGroupManagement {
            get $beanFullName(): 'start-siteadmin.ssrMenuGroup.management';
            get $onionName(): 'start-siteadmin:management';
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
export class ScopeModuleStartSiteadmin extends BeanScopeBase {}

export interface ScopeModuleStartSiteadmin {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'start-siteadmin': ScopeModuleStartSiteadmin;
  }

  export interface IBeanScopeContainer {
    startSiteadmin: ScopeModuleStartSiteadmin;
  }
  
  

  export interface IBeanScopeLocale {
    'start-siteadmin': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
