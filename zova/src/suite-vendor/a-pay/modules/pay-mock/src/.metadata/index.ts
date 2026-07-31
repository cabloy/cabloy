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
export * from '../api/payMockPayment.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-pay-mock' {
  
        export interface ApiPayMockPayment {
          /** @internal */
          get scope(): ScopeModulePayMock;
        }

        export interface ApiPayMockPayment {
          get $beanFullName(): 'pay-mock.api.payMockPayment';
          get $onionName(): 'pay-mock:payMockPayment';
          
        } 
}
/** api: end */
/** api: begin */
import { ApiPayMockPayment } from '../api/payMockPayment.js';
export interface IModuleApi {
  'payMockPayment': ApiPayMockPayment;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'pay-mock.api.payMockPayment': ApiPayMockPayment;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/payMockPayment.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-pay-mock' {
  
        export interface ApiSchemaPayMockPayment {
          /** @internal */
          get scope(): ScopeModulePayMock;
        }

        export interface ApiSchemaPayMockPayment {
          get $beanFullName(): 'pay-mock.apiSchema.payMockPayment';
          get $onionName(): 'pay-mock:payMockPayment';
          
        } 
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaPayMockPayment } from '../apiSchema/payMockPayment.js';
export interface IModuleApiSchema {
  'payMockPayment': ApiSchemaPayMockPayment;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'pay-mock.apiSchema.payMockPayment': ApiSchemaPayMockPayment;
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
