// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** service: begin */
export * from '../service/payMock.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'pay-mock:payMock': never;
    }


}
declare module 'vona-module-pay-mock' {

        export interface ServicePayMock {
          /** @internal */
          get scope(): ScopeModulePayMock;
        }

          export interface ServicePayMock {
            get $beanFullName(): 'pay-mock.service.payMock';
            get $onionName(): 'pay-mock:payMock';
          }
}
/** service: end */
/** service: begin */
import type { ServicePayMock } from '../service/payMock.ts';
export interface IModuleService {
  'payMock': ServicePayMock;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'pay-mock.service.payMock': ServicePayMock;
  }
}
/** service: end */
/** dto: begin */
export * from '../dto/mockPaymentComplete.tsx';
export * from '../dto/mockPaymentReceipt.tsx';
export * from '../dto/mockRefundComplete.tsx';
export * from '../dto/mockRefundReceipt.tsx';
import type { IDtoOptionsMockPaymentComplete } from '../dto/mockPaymentComplete.tsx';
import type { IDtoOptionsMockPaymentReceipt } from '../dto/mockPaymentReceipt.tsx';
import type { IDtoOptionsMockRefundComplete } from '../dto/mockRefundComplete.tsx';
import type { IDtoOptionsMockRefundReceipt } from '../dto/mockRefundReceipt.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'pay-mock:mockPaymentComplete': IDtoOptionsMockPaymentComplete;
'pay-mock:mockPaymentReceipt': IDtoOptionsMockPaymentReceipt;
'pay-mock:mockRefundComplete': IDtoOptionsMockRefundComplete;
'pay-mock:mockRefundReceipt': IDtoOptionsMockRefundReceipt;
    }


}
declare module 'vona-module-pay-mock' {

}
/** dto: end */
/** dto: begin */
import type { DtoMockPaymentComplete } from '../dto/mockPaymentComplete.tsx';
import type { DtoMockPaymentReceipt } from '../dto/mockPaymentReceipt.tsx';
import type { DtoMockRefundComplete } from '../dto/mockRefundComplete.tsx';
import type { DtoMockRefundReceipt } from '../dto/mockRefundReceipt.tsx';
declare module 'vona-module-pay-mock' {

    export interface IDtoOptionsMockPaymentComplete {
      fields?: TypeEntityOptionsFields<DtoMockPaymentComplete, IDtoOptionsMockPaymentComplete[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsMockPaymentReceipt {
      fields?: TypeEntityOptionsFields<DtoMockPaymentReceipt, IDtoOptionsMockPaymentReceipt[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsMockRefundComplete {
      fields?: TypeEntityOptionsFields<DtoMockRefundComplete, IDtoOptionsMockRefundComplete[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsMockRefundReceipt {
      fields?: TypeEntityOptionsFields<DtoMockRefundReceipt, IDtoOptionsMockRefundReceipt[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/mockPayment.ts';
import type { IControllerOptionsMockPayment } from '../controller/mockPayment.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'pay-mock:mockPayment': IControllerOptionsMockPayment;
    }


}
declare module 'vona-module-pay-mock' {

        export interface ControllerMockPayment {
          /** @internal */
          get scope(): ScopeModulePayMock;
        }

          export interface ControllerMockPayment {
            get $beanFullName(): 'pay-mock.controller.mockPayment';
            get $onionName(): 'pay-mock:mockPayment';
            get $onionOptions(): IControllerOptionsMockPayment;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerMockPayment } from '../controller/mockPayment.ts';
declare module 'vona-module-pay-mock' {

    export interface IControllerOptionsMockPayment {
      actions?: TypeControllerOptionsActions<ControllerMockPayment>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/pay/mock/payment-session/:id/complete': undefined;
'/pay/mock/payment-session/refund-operation/:id/complete': undefined;
    }

}

/** controller: end */
/** payProvider: begin */
export * from '../bean/payProvider.mock.ts';
import type { IPayProviderOptionsMock } from '../bean/payProvider.mock.ts';
import 'vona-module-a-pay';
declare module 'vona-module-a-pay' {

    export interface IPayProviderRecord {
      'pay-mock:mock': IPayProviderOptionsMock;
    }


}
declare module 'vona-module-pay-mock' {

        export interface PayProviderMock {
          /** @internal */
          get scope(): ScopeModulePayMock;
        }

          export interface PayProviderMock {
            get $beanFullName(): 'pay-mock.payProvider.mock';
            get $onionName(): 'pay-mock:mock';
            get $onionOptions(): IPayProviderOptionsMock;
          }
}
/** payProvider: end */
/** payProvider: begin */
import type { PayProviderMock } from '../bean/payProvider.mock.ts';
export interface IModulePayProvider {
  'mock': PayProviderMock;
}
/** payProvider: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModulePayMock extends BeanScopeBase {}

export interface ScopeModulePayMock {
  util: BeanScopeUtil;
service: IModuleService;
payProvider: IModulePayProvider;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'pay-mock': ScopeModulePayMock;
  }

  export interface IBeanScopeContainer {
    payMock: ScopeModulePayMock;
  }






}
/** scope: end */
