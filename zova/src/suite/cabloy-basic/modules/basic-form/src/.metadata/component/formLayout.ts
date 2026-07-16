import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormLayoutProps } from '../../component/formLayout/controller.jsx';

import { ControllerFormLayout } from '../../component/formLayout/controller.jsx';
export type ZFormLayoutProps = {
  controllerRef?: (ref: ControllerFormLayout) => void;
} & ControllerFormLayoutProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormLayoutProps,
  keyof typeof ControllerFormLayout.$propsDefault
>;
declare module 'zova-module-basic-form' {
  export interface ControllerFormLayout {
    $props: ControllerInnerProps;
  }
}

export const ZFormLayout = defineComponent((_props: ZFormLayoutProps) => {
  useController(ControllerFormLayout, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormLayout.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-form:formLayout': ControllerFormLayoutProps;
  }
}
