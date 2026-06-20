import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldLevelProps } from '../../component/formFieldLevel/controller.jsx';

import { ControllerFormFieldLevel } from '../../component/formFieldLevel/controller.jsx';
export type ZFormFieldLevelProps = {
  controllerRef?: (ref: ControllerFormFieldLevel) => void;
} & ControllerFormFieldLevelProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldLevelProps,
  keyof typeof ControllerFormFieldLevel.$propsDefault
>;
declare module 'zova-module-training-student' {
  export interface ControllerFormFieldLevel {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldLevel = defineComponent((_props: ZFormFieldLevelProps) => {
  useController(ControllerFormFieldLevel, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldLevel.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'training-student:formFieldLevel': ControllerFormFieldLevelProps;
  }
}
