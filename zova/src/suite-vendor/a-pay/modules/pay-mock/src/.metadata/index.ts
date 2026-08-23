// eslint-disable
/** model: begin */
export * from '../model/payMockPayment.js';
import { IModelOptionsPayMockPayment } from '../model/payMockPayment.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'pay-mock:payMockPayment': IModelOptionsPayMockPayment;
    }

  
}
declare module 'zova-module-pay-mock' {
  
        export interface ModelPayMockPayment {
          /** @internal */
          get scope(): ScopeModulePayMock;
        }

        export interface ModelPayMockPayment {
          get $beanFullName(): 'pay-mock.model.payMockPayment';
          get $onionName(): 'pay-mock:payMockPayment';
          get $onionOptions(): IModelOptionsPayMockPayment;
        } 
}
/** model: end */
/** model: begin */
import { ModelPayMockPayment } from '../model/payMockPayment.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'pay-mock.model.payMockPayment': ModelPayMockPayment;
  }
}
/** model: end */
/** api: begin */
export * from '../api/payMockMockPayment.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-pay-mock' {
  
        export interface ApiPayMockMockPayment {
          /** @internal */
          get scope(): ScopeModulePayMock;
        }

        export interface ApiPayMockMockPayment {
          get $beanFullName(): 'pay-mock.api.payMockMockPayment';
          get $onionName(): 'pay-mock:payMockMockPayment';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiPayMockMockPayment } from '../api/payMockMockPayment.js';
export interface IModuleApi {
  'payMockMockPayment': ApiPayMockMockPayment;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'pay-mock.api.payMockMockPayment': ApiPayMockMockPayment;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/payMockMockPayment.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-pay-mock' {
  
        export interface ApiSchemaPayMockMockPayment {
          /** @internal */
          get scope(): ScopeModulePayMock;
        }

        export interface ApiSchemaPayMockMockPayment {
          get $beanFullName(): 'pay-mock.apiSchema.payMockMockPayment';
          get $onionName(): 'pay-mock:payMockMockPayment';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaPayMockMockPayment } from '../apiSchema/payMockMockPayment.js';
export interface IModuleApiSchema {
  'payMockMockPayment': ApiSchemaPayMockMockPayment;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'pay-mock.apiSchema.payMockMockPayment': ApiSchemaPayMockMockPayment;
  }
}
/** apiSchema: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModulePayMock extends BeanScopeBase {}

export interface ScopeModulePayMock {
  util: BeanScopeUtil;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'pay-mock': ScopeModulePayMock;
  }
  
  

  

  
}

/** scope: end */
