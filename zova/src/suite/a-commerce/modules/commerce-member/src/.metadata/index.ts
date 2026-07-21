// eslint-disable
/** model: begin */
export * from '../model/address.js';
import { IModelOptionsAddress } from '../model/address.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'commerce-member:address': IModelOptionsAddress;
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
}
/** model: end */
/** model: begin */
import { ModelAddress } from '../model/address.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-member.model.address': ModelAddress;
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
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleCommerceMember extends BeanScopeBase {}

export interface ScopeModuleCommerceMember {
  util: BeanScopeUtil;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'commerce-member': ScopeModuleCommerceMember;
  }
  
  

  

  
}

/** scope: end */
