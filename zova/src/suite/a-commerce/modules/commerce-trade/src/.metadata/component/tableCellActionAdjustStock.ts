import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerTableCellActionAdjustStockProps } from '../../component/tableCellActionAdjustStock/controller.jsx';

import { ControllerTableCellActionAdjustStock } from '../../component/tableCellActionAdjustStock/controller.jsx';
export type ZTableCellActionAdjustStockProps = {
  controllerRef?: (ref: ControllerTableCellActionAdjustStock) => void;
} & ControllerTableCellActionAdjustStockProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerTableCellActionAdjustStockProps,
  keyof typeof ControllerTableCellActionAdjustStock.$propsDefault
>;
declare module 'zova-module-commerce-trade' {
  export interface ControllerTableCellActionAdjustStock {
    $props: ControllerInnerProps;
  }
}

export const ZTableCellActionAdjustStock = defineComponent(
  (_props: ZTableCellActionAdjustStockProps) => {
    useController(ControllerTableCellActionAdjustStock, undefined, undefined);
    return () => {};
  },
  prepareComponentOptions(),
);
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'commerce-trade:tableCellActionAdjustStock': ControllerTableCellActionAdjustStockProps;
  }
}
