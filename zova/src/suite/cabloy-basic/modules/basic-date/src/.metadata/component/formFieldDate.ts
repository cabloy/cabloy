import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldDateProps } from '../../component/formFieldDate/controller.jsx';

import { ControllerFormFieldDate } from '../../component/formFieldDate/controller.jsx';
export type ZFormFieldDateProps = {
  controllerRef?: (ref: ControllerFormFieldDate) => void;
} & ControllerFormFieldDateProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldDateProps,
  keyof typeof ControllerFormFieldDate.$propsDefault
>;
declare module 'zova-module-basic-date' {
  export interface ControllerFormFieldDate {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldDate = defineComponent((_props: ZFormFieldDateProps) => {
  useController(ControllerFormFieldDate, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldDate.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-date:formFieldDate': ControllerFormFieldDateProps;
  }
}
