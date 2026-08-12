// eslint-disable
/** model: begin */
export * from '../model/address.js';
export * from '../model/addressMine.js';
import { IModelOptionsAddress } from '../model/address.js';
import { IModelOptionsAddressMine } from '../model/addressMine.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'commerce-member:address': IModelOptionsAddress;
'commerce-member:addressMine': IModelOptionsAddressMine;
    }

  
}
declare module 'zova-module-commerce-member' {
  
        export interface ModelAddress {
          /** @internal */
          get scope(): ScopeModuleCommerceMember;
        }

        export interface ModelAddress {
          get $beanFullName(): 'commerce-member.model.address';
          get $onionName(): 'commerce-member:address';
          get $onionOptions(): IModelOptionsAddress;
        }

        export interface ModelAddressMine {
          /** @internal */
          get scope(): ScopeModuleCommerceMember;
        }

        export interface ModelAddressMine {
          get $beanFullName(): 'commerce-member.model.addressMine';
          get $onionName(): 'commerce-member:addressMine';
          get $onionOptions(): IModelOptionsAddressMine;
        } 
}
/** model: end */
/** model: begin */
import { ModelAddress } from '../model/address.js';
import { ModelAddressMine } from '../model/addressMine.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-member.model.address': ModelAddress;
'commerce-member.model.addressMine': ModelAddressMine;
  }
}
/** model: end */
/** api: begin */
export * from '../api/commerceMemberAddress.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-member' {
  
        export interface ApiCommerceMemberAddress {
          /** @internal */
          get scope(): ScopeModuleCommerceMember;
        }

        export interface ApiCommerceMemberAddress {
          get $beanFullName(): 'commerce-member.api.commerceMemberAddress';
          get $onionName(): 'commerce-member:commerceMemberAddress';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiCommerceMemberAddress } from '../api/commerceMemberAddress.js';
export interface IModuleApi {
  'commerceMemberAddress': ApiCommerceMemberAddress;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-member.api.commerceMemberAddress': ApiCommerceMemberAddress;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/commerceMemberAddress.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-member' {
  
        export interface ApiSchemaCommerceMemberAddress {
          /** @internal */
          get scope(): ScopeModuleCommerceMember;
        }

        export interface ApiSchemaCommerceMemberAddress {
          get $beanFullName(): 'commerce-member.apiSchema.commerceMemberAddress';
          get $onionName(): 'commerce-member:commerceMemberAddress';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaCommerceMemberAddress } from '../apiSchema/commerceMemberAddress.js';
export interface IModuleApiSchema {
  'commerceMemberAddress': ApiSchemaCommerceMemberAddress;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-member.apiSchema.commerceMemberAddress': ApiSchemaCommerceMemberAddress;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../page/address/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-commerce-member' {
  
        export interface ControllerPageAddress {
          /** @internal */
          get scope(): ScopeModuleCommerceMember;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerPageAddress } from '../page/address/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'commerce-member.controller.pageAddress': ControllerPageAddress;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/address.js';
import { NSControllerPageAddress } from './page/address.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/commerce/member/address': TypePagePathSchema<NSControllerPageAddress.ParamsInput,NSControllerPageAddress.QueryInput>;
}
export interface IPageNameRecord {
  
}
}
export const pagePathSchemas = {
'/commerce/member/address': {
          query: NSControllerPageAddress.querySchema,
        },
};
export const pageNameSchemas = {

};
declare module 'zova-module-commerce-member' {
  export interface ControllerPageAddress {
        $params: NSControllerPageAddress.ParamsOutput;
$query: NSControllerPageAddress.QueryOutput;
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
export class ScopeModuleCommerceMember extends BeanScopeBase {}

export interface ScopeModuleCommerceMember {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'commerce-member': ScopeModuleCommerceMember;
  }
  
  

  export interface IBeanScopeLocale {
    'commerce-member': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `commerce-member::${K}` {
  return `commerce-member::${key}`;
}
/** scope: end */
