import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerPaymentNextActionProps } from '../../component/paymentNextAction/controller.jsx';

import { ControllerPaymentNextAction } from '../../component/paymentNextAction/controller.jsx';
export type ZPaymentNextActionProps = {
  controllerRef?: (ref: ControllerPaymentNextAction) => void;
} & ControllerPaymentNextActionProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerPaymentNextActionProps,
  keyof typeof ControllerPaymentNextAction.$propsDefault
>;
declare module 'zova-module-a-pay' {
  export interface ControllerPaymentNextAction {
    $props: ControllerInnerProps;
  }
}

export const ZPaymentNextAction = defineComponent((_props: ZPaymentNextActionProps) => {
  useController(ControllerPaymentNextAction, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'a-pay:paymentNextAction': ControllerPaymentNextActionProps;
  }
}
