// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** service: begin */
export * from '../service/operator.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'commerce-siteadmin:operator': never;
    }

  
}
declare module 'vona-module-commerce-siteadmin' {
  
        export interface ServiceOperator {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteadmin;
        }

          export interface ServiceOperator {
            get $beanFullName(): 'commerce-siteadmin.service.operator';
            get $onionName(): 'commerce-siteadmin:operator';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceOperator } from '../service/operator.ts';
export interface IModuleService {
  'operator': ServiceOperator;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-siteadmin.service.operator': ServiceOperator;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'commerce-siteadmin:version': never;
    }

  
}
declare module 'vona-module-commerce-siteadmin' {
  
        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteadmin;
        }

          export interface MetaVersion {
            get $beanFullName(): 'commerce-siteadmin.meta.version';
            get $onionName(): 'commerce-siteadmin:version';
            
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/operatorContext.ts';
import type { IDtoOptionsOperatorContext } from '../dto/operatorContext.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'commerce-siteadmin:operatorContext': IDtoOptionsOperatorContext;
    }

  
}
declare module 'vona-module-commerce-siteadmin' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoOperatorContext } from '../dto/operatorContext.ts';
declare module 'vona-module-commerce-siteadmin' {
  
    export interface IDtoOptionsOperatorContext {
      fields?: TypeEntityOptionsFields<DtoOperatorContext, IDtoOptionsOperatorContext[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/operator.ts';
import type { IControllerOptionsOperator } from '../controller/operator.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'commerce-siteadmin:operator': IControllerOptionsOperator;
    }

  
}
declare module 'vona-module-commerce-siteadmin' {
  
        export interface ControllerOperator {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteadmin;
        }

          export interface ControllerOperator {
            get $beanFullName(): 'commerce-siteadmin.controller.operator';
            get $onionName(): 'commerce-siteadmin:operator';
            get $onionOptions(): IControllerOptionsOperator;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerOperator } from '../controller/operator.ts';
declare module 'vona-module-commerce-siteadmin' {
  
    export interface IControllerOptionsOperator {
      actions?: TypeControllerOptionsActions<ControllerOperator>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/commerce/siteadmin/operator/context': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'commerce-siteadmin:operator': never;
    }
  }
  
/** controller: end */
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
/** ssrMenuGroup: begin */
export * from '../bean/ssrMenuGroup.catalog.ts';
export * from '../bean/ssrMenuGroup.inventory.ts';
import type { ISsrMenuGroupOptionsCatalog } from '../bean/ssrMenuGroup.catalog.ts';
import type { ISsrMenuGroupOptionsInventory } from '../bean/ssrMenuGroup.inventory.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuGroupRecord {
      'commerce-siteadmin:catalog': ISsrMenuGroupOptionsCatalog;
'commerce-siteadmin:inventory': ISsrMenuGroupOptionsInventory;
    }

  
}
declare module 'vona-module-commerce-siteadmin' {
  
        export interface SsrMenuGroupCatalog {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteadmin;
        }

          export interface SsrMenuGroupCatalog {
            get $beanFullName(): 'commerce-siteadmin.ssrMenuGroup.catalog';
            get $onionName(): 'commerce-siteadmin:catalog';
            get $onionOptions(): ISsrMenuGroupOptionsCatalog;
          }

        export interface SsrMenuGroupInventory {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteadmin;
        }

          export interface SsrMenuGroupInventory {
            get $beanFullName(): 'commerce-siteadmin.ssrMenuGroup.inventory';
            get $onionName(): 'commerce-siteadmin:inventory';
            get $onionOptions(): ISsrMenuGroupOptionsInventory;
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
export class ScopeModuleCommerceSiteadmin extends BeanScopeBase {}

export interface ScopeModuleCommerceSiteadmin {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-siteadmin': ScopeModuleCommerceSiteadmin;
  }

  export interface IBeanScopeContainer {
    commerceSiteadmin: ScopeModuleCommerceSiteadmin;
  }
  
  

  export interface IBeanScopeLocale {
    'commerce-siteadmin': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
