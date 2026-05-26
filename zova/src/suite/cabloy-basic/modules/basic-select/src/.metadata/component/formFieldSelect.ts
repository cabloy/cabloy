import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldSelectProps } from '../../component/formFieldSelect/controller.jsx';

import { ControllerFormFieldSelect } from '../../component/formFieldSelect/controller.jsx';
export type ZFormFieldSelectProps = {
  controllerRef?: (ref: ControllerFormFieldSelect) => void;
} & ControllerFormFieldSelectProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldSelectProps,
  keyof typeof ControllerFormFieldSelect.$propsDefault
>;
declare module 'zova-module-basic-select' {
  export interface ControllerFormFieldSelect {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldSelect = defineComponent((_props: ZFormFieldSelectProps) => {
  useController(ControllerFormFieldSelect, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldSelect.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-select:formFieldSelect': ControllerFormFieldSelectProps;
  }
}
