import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockTableProps } from '../../component/blockTable/controller.jsx';

import { ControllerBlockTable } from '../../component/blockTable/controller.jsx';
export type ZBlockTableProps = {
  controllerRef?: (ref: ControllerBlockTable) => void;
} & ControllerBlockTableProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockTableProps,
  keyof typeof ControllerBlockTable.$propsDefault
>;
declare module 'zova-module-basic-page' {
  export interface ControllerBlockTable {
    $props: ControllerInnerProps;
  }
}

export const ZBlockTable = defineComponent((_props: ZBlockTableProps) => {
  useController(ControllerBlockTable, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockTable.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-page:blockTable': ControllerBlockTableProps;
  }
}
