import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockResourcePickerActionsProps } from '../../component/blockResourcePickerActions/controller.jsx';

import { ControllerBlockResourcePickerActions } from '../../component/blockResourcePickerActions/controller.jsx';
export type ZBlockResourcePickerActionsProps = {
  controllerRef?: (ref: ControllerBlockResourcePickerActions) => void;
} & ControllerBlockResourcePickerActionsProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockResourcePickerActionsProps,
  keyof typeof ControllerBlockResourcePickerActions.$propsDefault
>;
declare module 'zova-module-basic-resource' {
  export interface ControllerBlockResourcePickerActions {
    $props: ControllerInnerProps;
  }
}

export const ZBlockResourcePickerActions = defineComponent(
  (_props: ZBlockResourcePickerActionsProps) => {
    useController(ControllerBlockResourcePickerActions, undefined, undefined);
    return () => {};
  },
  prepareComponentOptions(ControllerBlockResourcePickerActions.$componentOptions),
);
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-resource:blockResourcePickerActions': ControllerBlockResourcePickerActionsProps;
  }
}
