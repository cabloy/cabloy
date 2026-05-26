import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerTableCellTestProps } from '../../component/tableCellTest/controller.jsx';

import { ControllerTableCellTest } from '../../component/tableCellTest/controller.jsx';
export type ZTableCellTestProps = {
  controllerRef?: (ref: ControllerTableCellTest) => void;
} & ControllerTableCellTestProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerTableCellTestProps,
  keyof typeof ControllerTableCellTest.$propsDefault
>;
declare module 'zova-module-demo-basic' {
  export interface ControllerTableCellTest {
    $props: ControllerInnerProps;
  }
}

export const ZTableCellTest = defineComponent((_props: ZTableCellTestProps) => {
  useController(ControllerTableCellTest, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'demo-basic:tableCellTest': ControllerTableCellTestProps;
  }
}
