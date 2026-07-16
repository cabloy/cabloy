import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockFormLayoutProps } from '../../component/blockFormLayout/controller.jsx';

import { ControllerBlockFormLayout } from '../../component/blockFormLayout/controller.jsx';
export type ZBlockFormLayoutProps = {
  controllerRef?: (ref: ControllerBlockFormLayout) => void;
} & ControllerBlockFormLayoutProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockFormLayoutProps,
  keyof typeof ControllerBlockFormLayout.$propsDefault
>;
declare module 'zova-module-basic-form' {
  export interface ControllerBlockFormLayout {
    $props: ControllerInnerProps;
  }
}

export const ZBlockFormLayout = defineComponent((_props: ZBlockFormLayoutProps) => {
  useController(ControllerBlockFormLayout, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockFormLayout.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-form:blockFormLayout': ControllerBlockFormLayoutProps;
  }
}
