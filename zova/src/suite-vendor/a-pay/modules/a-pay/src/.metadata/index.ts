// eslint-disable
/** model: begin */
export * from '../model/paymentSession.js';
import { IModelOptionsPaymentSession } from '../model/paymentSession.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'a-pay:paymentSession': IModelOptionsPaymentSession;
    }


}
declare module 'zova-module-a-pay' {

        export interface ModelPaymentSession {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

        export interface ModelPaymentSession {
          get $beanFullName(): 'a-pay.model.paymentSession';
          get $onionName(): 'a-pay:paymentSession';
          get $onionOptions(): IModelOptionsPaymentSession;
        }
}
/** model: end */
/** model: begin */
import type { ModelPaymentSession } from '../model/paymentSession.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-pay.model.paymentSession': ModelPaymentSession;
  }
}
/** model: end */
/** api: begin */
export * from '../api/payPaymentSession.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-pay' {

        export interface ApiPayPaymentSession {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

        export interface ApiPayPaymentSession {
          get $beanFullName(): 'a-pay.api.payPaymentSession';
          get $onionName(): 'a-pay:payPaymentSession';

        }
}
/** api: end */
/** api: begin */
import type { ApiPayPaymentSession } from '../api/payPaymentSession.js';
export interface IModuleApi {
  'payPaymentSession': ApiPayPaymentSession;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-pay.api.payPaymentSession': ApiPayPaymentSession;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/payPaymentSession.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-pay' {

        export interface ApiSchemaPayPaymentSession {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

        export interface ApiSchemaPayPaymentSession {
          get $beanFullName(): 'a-pay.apiSchema.payPaymentSession';
          get $onionName(): 'a-pay:payPaymentSession';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import type { ApiSchemaPayPaymentSession } from '../apiSchema/payPaymentSession.js';
export interface IModuleApiSchema {
  'payPaymentSession': ApiSchemaPayPaymentSession;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-pay.apiSchema.payPaymentSession': ApiSchemaPayPaymentSession;
  }
}
/** apiSchema: end */
/** service: begin */
export * from '../service/paymentCoordinator.js';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {

    export interface IServiceRecord {
      'a-pay:paymentCoordinator': never;
    }


}
declare module 'zova-module-a-pay' {

        export interface ServicePaymentCoordinator {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

        export interface ServicePaymentCoordinator {
          get $beanFullName(): 'a-pay.service.paymentCoordinator';
          get $onionName(): 'a-pay:paymentCoordinator';

        }
}
/** service: end */
/** service: begin */
import type { ServicePaymentCoordinator } from '../service/paymentCoordinator.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-pay.service.paymentCoordinator': ServicePaymentCoordinator;
  }
}
/** service: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAPay extends BeanScopeBase {}

export interface ScopeModuleAPay {
  util: BeanScopeUtil;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-pay': ScopeModuleAPay;
  }






}

/** scope: end */
