// eslint-disable
/** model: begin */
export * from '../model/operator.js';
import { IModelOptionsOperator } from '../model/operator.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'commerce-siteadmin:operator': IModelOptionsOperator;
    }

  
}
declare module 'zova-module-commerce-siteadmin' {
  
        export interface ModelOperator {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteadmin;
        }

        export interface ModelOperator {
          get $beanFullName(): 'commerce-siteadmin.model.operator';
          get $onionName(): 'commerce-siteadmin:operator';
          get $onionOptions(): IModelOptionsOperator;
        } 
}
/** model: end */
/** model: begin */
import { ModelOperator } from '../model/operator.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-siteadmin.model.operator': ModelOperator;
  }
}
/** model: end */
/** api: begin */
export * from '../api/commerceSiteadminOperator.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-siteadmin' {
  
        export interface ApiCommerceSiteadminOperator {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteadmin;
        }

        export interface ApiCommerceSiteadminOperator {
          get $beanFullName(): 'commerce-siteadmin.api.commerceSiteadminOperator';
          get $onionName(): 'commerce-siteadmin:commerceSiteadminOperator';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiCommerceSiteadminOperator } from '../api/commerceSiteadminOperator.js';
export interface IModuleApi {
  'commerceSiteadminOperator': ApiCommerceSiteadminOperator;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-siteadmin.api.commerceSiteadminOperator': ApiCommerceSiteadminOperator;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/commerceSiteadminOperator.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-siteadmin' {
  
        export interface ApiSchemaCommerceSiteadminOperator {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteadmin;
        }

        export interface ApiSchemaCommerceSiteadminOperator {
          get $beanFullName(): 'commerce-siteadmin.apiSchema.commerceSiteadminOperator';
          get $onionName(): 'commerce-siteadmin:commerceSiteadminOperator';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaCommerceSiteadminOperator } from '../apiSchema/commerceSiteadminOperator.js';
export interface IModuleApiSchema {
  'commerceSiteadminOperator': ApiSchemaCommerceSiteadminOperator;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-siteadmin.apiSchema.commerceSiteadminOperator': ApiSchemaCommerceSiteadminOperator;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../page/dashboard/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-siteadmin' {
  
        export interface ControllerPageDashboard {
          /** @internal */
          get scope(): ScopeModuleCommerceSiteadmin;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerPageDashboard } from '../page/dashboard/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'commerce-siteadmin.controller.pageDashboard': ControllerPageDashboard;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/dashboard.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/commerce/siteadmin/dashboard': TypePagePathSchema<undefined,undefined>;
}
export interface IPageNameRecord {
  
}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {

};
declare module 'zova-module-commerce-siteadmin' {
  
}
/** pages: end */

/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleCommerceSiteadmin extends BeanScopeBase {}

export interface ScopeModuleCommerceSiteadmin {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'commerce-siteadmin': ScopeModuleCommerceSiteadmin;
  }
  
  

  export interface IBeanScopeLocale {
    'commerce-siteadmin': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `commerce-siteadmin::${K}` {
  return `commerce-siteadmin::${key}`;
}
/** scope: end */
