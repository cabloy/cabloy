import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerTableCellActionShipProps } from '../../component/tableCellActionShip/controller.jsx';

import { ControllerTableCellActionShip } from '../../component/tableCellActionShip/controller.jsx';
export type ZTableCellActionShipProps = {
  controllerRef?: (ref: ControllerTableCellActionShip) => void;
} & ControllerTableCellActionShipProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerTableCellActionShipProps,
  keyof typeof ControllerTableCellActionShip.$propsDefault
>;
declare module 'zova-module-commerce-trade' {
  export interface ControllerTableCellActionShip {
    $props: ControllerInnerProps;
  }
}

export const ZTableCellActionShip = defineComponent((_props: ZTableCellActionShipProps) => {
  useController(ControllerTableCellActionShip, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'commerce-trade:tableCellActionShip': ControllerTableCellActionShipProps;
  }
}
