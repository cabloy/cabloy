// eslint-disable
/** model: begin */
export * from '../model/catalogue.js';
import { IModelOptionsCatalogue } from '../model/catalogue.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'commerce-catalog:catalogue': IModelOptionsCatalogue;
    }


}
declare module 'zova-module-commerce-catalog' {

        export interface ModelCatalogue {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

        export interface ModelCatalogue {
          get $beanFullName(): 'commerce-catalog.model.catalogue';
          get $onionName(): 'commerce-catalog:catalogue';
          get $onionOptions(): IModelOptionsCatalogue;
        }
}
/** model: end */
/** model: begin */
import { ModelCatalogue } from '../model/catalogue.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-catalog.model.catalogue': ModelCatalogue;
  }
}
/** model: end */
/** api: begin */
export * from '../api/commerceCatalogProduct.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-commerce-catalog' {

        export interface ApiCommerceCatalogProduct {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

        export interface ApiCommerceCatalogProduct {
          get $beanFullName(): 'commerce-catalog.api.commerceCatalogProduct';
          get $onionName(): 'commerce-catalog:commerceCatalogProduct';

        }
}
/** api: end */
/** api: begin */
import { ApiCommerceCatalogProduct } from '../api/commerceCatalogProduct.js';
export interface IModuleApi {
  'commerceCatalogProduct': ApiCommerceCatalogProduct;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-catalog.api.commerceCatalogProduct': ApiCommerceCatalogProduct;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/commerceCatalogProduct.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-commerce-catalog' {

        export interface ApiSchemaCommerceCatalogProduct {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

        export interface ApiSchemaCommerceCatalogProduct {
          get $beanFullName(): 'commerce-catalog.apiSchema.commerceCatalogProduct';
          get $onionName(): 'commerce-catalog:commerceCatalogProduct';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaCommerceCatalogProduct } from '../apiSchema/commerceCatalogProduct.js';
export interface IModuleApiSchema {
  'commerceCatalogProduct': ApiSchemaCommerceCatalogProduct;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-catalog.apiSchema.commerceCatalogProduct': ApiSchemaCommerceCatalogProduct;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../page/catalogue/controller.jsx';
export * from '../page/product/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-commerce-catalog' {

        export interface ControllerPageCatalogue {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }

        export interface ControllerPageProduct {
          /** @internal */
          get scope(): ScopeModuleCommerceCatalog;
        }
}
/** controller: end */
/** controller: begin */
import { ControllerPageCatalogue } from '../page/catalogue/controller.jsx';
import { ControllerPageProduct } from '../page/product/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'commerce-catalog.controller.pageCatalogue': ControllerPageCatalogue;
'commerce-catalog.controller.pageProduct': ControllerPageProduct;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/catalogue.js';
import { NSControllerPageCatalogue } from './page/catalogue.js';
export * from './page/product.js';
import { NSControllerPageProduct } from './page/product.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/commerce/catalog/catalogue/:locale?': TypePagePathSchema<NSControllerPageCatalogue.ParamsInput,NSControllerPageCatalogue.QueryInput>;
'/commerce/catalog/product/:id/:locale?': TypePagePathSchema<NSControllerPageProduct.ParamsInput,NSControllerPageProduct.QueryInput>;
}
export interface IPageNameRecord {
  'commerce-catalog:catalogue': TypePagePathSchema<NSControllerPageCatalogue.ParamsInput,NSControllerPageCatalogue.QueryInput>;
'commerce-catalog:product': TypePagePathSchema<NSControllerPageProduct.ParamsInput,NSControllerPageProduct.QueryInput>;
}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {
'commerce-catalog:catalogue': {
          params: NSControllerPageCatalogue.paramsSchema,
          query: NSControllerPageCatalogue.querySchema,
        },
'commerce-catalog:product': {
          params: NSControllerPageProduct.paramsSchema,
          query: NSControllerPageProduct.querySchema,
        },
};
declare module 'zova-module-commerce-catalog' {
  export interface ControllerPageCatalogue {
        $params: NSControllerPageCatalogue.ParamsOutput;
$query: NSControllerPageCatalogue.QueryOutput;
      }
export interface ControllerPageProduct {
        $params: NSControllerPageProduct.ParamsOutput;
$query: NSControllerPageProduct.QueryOutput;
      }
}
/** pages: end */

/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleCommerceCatalog extends BeanScopeBase {}

export interface ScopeModuleCommerceCatalog {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'commerce-catalog': ScopeModuleCommerceCatalog;
  }



  export interface IBeanScopeLocale {
    'commerce-catalog': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `commerce-catalog::${K}` {
  return `commerce-catalog::${key}`;
}
/** scope: end */
