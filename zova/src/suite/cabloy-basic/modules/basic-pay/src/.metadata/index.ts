// eslint-disable
/** controller: begin */
export * from '../component/paymentNextAction/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-pay' {

        export interface ControllerPaymentNextAction {
          /** @internal */
          get scope(): ScopeModuleBasicPay;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerPaymentNextAction } from '../component/paymentNextAction/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-pay.controller.paymentNextAction': ControllerPaymentNextAction;
  }
}
/** controller: end */

/** components: begin */
export * from './component/paymentNextAction.ts';
import { ZPaymentNextAction } from './component/paymentNextAction.ts';
export const components = {
  'paymentNextAction': ZPaymentNextAction,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-pay:paymentNextAction': ControllerPaymentNextAction;
}
export interface IZovaComponentRecord {
  'basic-pay:paymentNextAction': typeof ZPaymentNextAction;
}
}
/** components: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicPay extends BeanScopeBase {}

export interface ScopeModuleBasicPay {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-pay': ScopeModuleBasicPay;
  }






}

/** scope: end */
