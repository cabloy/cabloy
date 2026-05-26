import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerIconProps } from '../../component/icon/controller.jsx';

import { ControllerIcon } from '../../component/icon/controller.jsx';
export type ZIconProps = {
  controllerRef?: (ref: ControllerIcon) => void;
} & ControllerIconProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerIconProps,
  keyof typeof ControllerIcon.$propsDefault
>;
declare module 'zova-module-a-icon' {
  export interface ControllerIcon {
    $props: ControllerInnerProps;
  }
}

export const ZIcon = defineComponent((_props: ZIconProps) => {
  useController(ControllerIcon, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'a-icon:icon': ControllerIconProps;
  }
}
