import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerButtonProps } from '../../component/button/controller.jsx';

import { ControllerButton } from '../../component/button/controller.jsx';
export type ZButtonProps = {
  controllerRef?: (ref: ControllerButton) => void;
} & ControllerButtonProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerButtonProps,
  keyof typeof ControllerButton.$propsDefault
>;
declare module 'zova-module-basic-button' {
  export interface ControllerButton {
    $props: ControllerInnerProps;
  }
}

export const ZButton = defineComponent((_props: ZButtonProps) => {
  useController(ControllerButton, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerButton.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-button:button': ControllerButtonProps;
  }
}
