import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerRowOperationsProps } from '../../component/rowOperations/controller.tsx';

import { ControllerRowOperations } from '../../component/rowOperations/controller.tsx';
export type ZRowOperationsProps = {
  controllerRef?: (ref: ControllerRowOperations) => void;
} & ControllerRowOperationsProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerRowOperationsProps,
  keyof typeof ControllerRowOperations.$propsDefault
>;
declare module 'zova-module-basic-table' {
  export interface ControllerRowOperations {
    $props: ControllerInnerProps;
  }
}

export const ZRowOperations = defineComponent((_props: ZRowOperationsProps) => {
  useController(ControllerRowOperations, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-table:rowOperations': ControllerRowOperationsProps;
  }
}
