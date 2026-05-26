import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerRouterViewStackProps } from '../../component/routerViewStack/controller.jsx';

import { ControllerRouterViewStack } from '../../component/routerViewStack/controller.jsx';
export type ZRouterViewStackProps = {
  controllerRef?: (ref: ControllerRouterViewStack) => void;
} & ControllerRouterViewStackProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerRouterViewStackProps,
  keyof typeof ControllerRouterViewStack.$propsDefault
>;
declare module 'zova-module-a-routerstack' {
  export interface ControllerRouterViewStack {
    $props: ControllerInnerProps;
  }
}

export const ZRouterViewStack = defineComponent((_props: ZRouterViewStackProps) => {
  useController(ControllerRouterViewStack, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'a-routerstack:routerViewStack': ControllerRouterViewStackProps;
  }
}
