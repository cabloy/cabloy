import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBehaviorProps } from '../../component/behavior/controller.jsx';

import { ControllerBehavior } from '../../component/behavior/controller.jsx';
export type ZBehaviorProps = {
  controllerRef?: (ref: ControllerBehavior) => void;
} & ControllerBehaviorProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBehaviorProps,
  keyof typeof ControllerBehavior.$propsDefault
>;
declare module 'zova-module-a-behavior' {
  export interface ControllerBehavior {
    $props: ControllerInnerProps;
  }
}

export const ZBehavior = defineComponent((_props: ZBehaviorProps) => {
  useController(ControllerBehavior, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBehavior.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'a-behavior:behavior': ControllerBehaviorProps;
  }
}
