import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerTableCellActionRefundProps } from '../../component/tableCellActionRefund/controller.jsx';

import { ControllerTableCellActionRefund } from '../../component/tableCellActionRefund/controller.jsx';
export type ZTableCellActionRefundProps = {
  controllerRef?: (ref: ControllerTableCellActionRefund) => void;
} & ControllerTableCellActionRefundProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerTableCellActionRefundProps,
  keyof typeof ControllerTableCellActionRefund.$propsDefault
>;
declare module 'zova-module-commerce-trade' {
  export interface ControllerTableCellActionRefund {
    $props: ControllerInnerProps;
  }
}

export const ZTableCellActionRefund = defineComponent((_props: ZTableCellActionRefundProps) => {
  useController(ControllerTableCellActionRefund, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'commerce-trade:tableCellActionRefund': ControllerTableCellActionRefundProps;
  }
}
