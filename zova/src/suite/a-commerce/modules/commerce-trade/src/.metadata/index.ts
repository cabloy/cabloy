// eslint-disable
/** model: begin */
export * from '../model/cart.js';
import { IModelOptionsCart } from '../model/cart.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'commerce-trade:cart': IModelOptionsCart;
    }

  
}
declare module 'zova-module-commerce-trade' {
  
        export interface ModelCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ModelCart {
          get $beanFullName(): 'commerce-trade.model.cart';
          get $onionName(): 'commerce-trade:cart';
          get $onionOptions(): IModelOptionsCart;
        } 
}
/** model: end */
/** model: begin */
import { ModelCart } from '../model/cart.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-trade.model.cart': ModelCart;
  }
}
/** model: end */
/** api: begin */
export * from '../api/commerceTradeCart.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-trade' {
  
        export interface ApiCommerceTradeCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ApiCommerceTradeCart {
          get $beanFullName(): 'commerce-trade.api.commerceTradeCart';
          get $onionName(): 'commerce-trade:commerceTradeCart';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiCommerceTradeCart } from '../api/commerceTradeCart.js';
export interface IModuleApi {
  'commerceTradeCart': ApiCommerceTradeCart;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-trade.api.commerceTradeCart': ApiCommerceTradeCart;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/commerceTradeCart.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-trade' {
  
        export interface ApiSchemaCommerceTradeCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

        export interface ApiSchemaCommerceTradeCart {
          get $beanFullName(): 'commerce-trade.apiSchema.commerceTradeCart';
          get $onionName(): 'commerce-trade:commerceTradeCart';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaCommerceTradeCart } from '../apiSchema/commerceTradeCart.js';
export interface IModuleApiSchema {
  'commerceTradeCart': ApiSchemaCommerceTradeCart;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-trade.apiSchema.commerceTradeCart': ApiSchemaCommerceTradeCart;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../page/cart/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-trade' {
  
        export interface ControllerPageCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerPageCart } from '../page/cart/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'commerce-trade.controller.pageCart': ControllerPageCart;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/cart.js';
import { NSControllerPageCart } from './page/cart.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/commerce/trade/cart/:locale?': TypePagePathSchema<NSControllerPageCart.ParamsInput,NSControllerPageCart.QueryInput>;
}
export interface IPageNameRecord {
  'commerce-trade:cart': undefined;
}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {
'commerce-trade:cart': {
          params: NSControllerPageCart.paramsSchema,
          query: NSControllerPageCart.querySchema,
        },
};
declare module 'zova-module-commerce-trade' {
  export interface ControllerPageCart {
        $params: NSControllerPageCart.ParamsOutput;
$query: NSControllerPageCart.QueryOutput;
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
export class ScopeModuleCommerceTrade extends BeanScopeBase {}

export interface ScopeModuleCommerceTrade {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'commerce-trade': ScopeModuleCommerceTrade;
  }
  
  

  export interface IBeanScopeLocale {
    'commerce-trade': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `commerce-trade::${K}` {
  return `commerce-trade::${key}`;
}
/** scope: end */
