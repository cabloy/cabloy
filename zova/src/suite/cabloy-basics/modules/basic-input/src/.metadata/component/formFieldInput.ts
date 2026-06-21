import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldInputProps } from '../../component/formFieldInput/controller.jsx';

import { ControllerFormFieldInput } from '../../component/formFieldInput/controller.jsx';
export type ZFormFieldInputProps = {
  controllerRef?: (ref: ControllerFormFieldInput) => void;
} & ControllerFormFieldInputProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldInputProps,
  keyof typeof ControllerFormFieldInput.$propsDefault
>;
declare module 'zova-module-basic-input' {
  export interface ControllerFormFieldInput {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldInput = defineComponent((_props: ZFormFieldInputProps) => {
  useController(ControllerFormFieldInput, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldInput.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-input:formFieldInput': ControllerFormFieldInputProps;
  }
}
