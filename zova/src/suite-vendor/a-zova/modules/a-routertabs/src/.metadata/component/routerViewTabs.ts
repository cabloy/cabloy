import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerRouterViewTabsProps } from '../../component/routerViewTabs/controller.jsx';

import { ControllerRouterViewTabs } from '../../component/routerViewTabs/controller.jsx';
export type ZRouterViewTabsProps = {
  controllerRef?: (ref: ControllerRouterViewTabs) => void;
} & ControllerRouterViewTabsProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerRouterViewTabsProps,
  keyof typeof ControllerRouterViewTabs.$propsDefault
>;
declare module 'zova-module-a-routertabs' {
  export interface ControllerRouterViewTabs {
    $props: ControllerInnerProps;
  }
}

export const ZRouterViewTabs = defineComponent((_props: ZRouterViewTabsProps) => {
  useController(ControllerRouterViewTabs, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'a-routertabs:routerViewTabs': ControllerRouterViewTabsProps;
  }
}
