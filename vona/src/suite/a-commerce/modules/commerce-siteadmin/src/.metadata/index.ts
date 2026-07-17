// eslint-disable
/** ssrSite: begin */
export * from '../bean/ssrSite.commerceAdmin.ts';
import type { ISsrSiteOptionsCommerceAdmin } from '../bean/ssrSite.commerceAdmin.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrSiteRecord {
      'commerce-siteadmin:commerceAdmin': ISsrSiteOptionsCommerceAdmin;
    }

  
}
declare module 'vona-module-commerce-siteadmin' {
  
        export interface SsrSiteCommerceAdmin {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteadmin;
        }

          export interface SsrSiteCommerceAdmin {
            get $beanFullName(): 'commerce-siteadmin.ssrSite.commerceAdmin';
            get $onionName(): 'commerce-siteadmin:commerceAdmin';
            get $onionOptions(): ISsrSiteOptionsCommerceAdmin;
          } 
}
/** ssrSite: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.home.ts';
import type { ISsrMenuOptionsHome } from '../bean/ssrMenu.home.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'commerce-siteadmin:home': ISsrMenuOptionsHome;
    }

  
}
declare module 'vona-module-commerce-siteadmin' {
  
        export interface SsrMenuHome {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteadmin;
        }

          export interface SsrMenuHome {
            get $beanFullName(): 'commerce-siteadmin.ssrMenu.home';
            get $onionName(): 'commerce-siteadmin:home';
            get $onionOptions(): ISsrMenuOptionsHome;
          } 
}
/** ssrMenu: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleCommerceSiteadmin extends BeanScopeBase {}

export interface ScopeModuleCommerceSiteadmin {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-siteadmin': ScopeModuleCommerceSiteadmin;
  }

  export interface IBeanScopeContainer {
    commerceSiteadmin: ScopeModuleCommerceSiteadmin;
  }
  
  

  

  
}
/** scope: end */
