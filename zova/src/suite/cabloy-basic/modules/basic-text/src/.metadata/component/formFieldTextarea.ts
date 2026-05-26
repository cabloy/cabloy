import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldTextareaProps } from '../../component/formFieldTextarea/controller.jsx';

import { ControllerFormFieldTextarea } from '../../component/formFieldTextarea/controller.jsx';
export type ZFormFieldTextareaProps = {
  controllerRef?: (ref: ControllerFormFieldTextarea) => void;
} & ControllerFormFieldTextareaProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldTextareaProps,
  keyof typeof ControllerFormFieldTextarea.$propsDefault
>;
declare module 'zova-module-basic-text' {
  export interface ControllerFormFieldTextarea {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldTextarea = defineComponent((_props: ZFormFieldTextareaProps) => {
  useController(ControllerFormFieldTextarea, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldTextarea.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-text:formFieldTextarea': ControllerFormFieldTextareaProps;
  }
}
