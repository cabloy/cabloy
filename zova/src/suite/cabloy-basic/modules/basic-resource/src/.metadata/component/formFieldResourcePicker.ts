import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldResourcePickerProps } from '../../component/formFieldResourcePicker/controller.jsx';

import { ControllerFormFieldResourcePicker } from '../../component/formFieldResourcePicker/controller.jsx';
export type ZFormFieldResourcePickerProps = {
  controllerRef?: (ref: ControllerFormFieldResourcePicker) => void;
} & ControllerFormFieldResourcePickerProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldResourcePickerProps,
  keyof typeof ControllerFormFieldResourcePicker.$propsDefault
>;
declare module 'zova-module-basic-resource' {
  export interface ControllerFormFieldResourcePicker {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldResourcePicker = defineComponent((_props: ZFormFieldResourcePickerProps) => {
  useController(ControllerFormFieldResourcePicker, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldResourcePicker.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-resource:formFieldResourcePicker': ControllerFormFieldResourcePickerProps;
  }
}
