import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerPageProps } from '../../component/page/controller.jsx';

import { ControllerPage } from '../../component/page/controller.jsx';
export type ZPageProps = {
  controllerRef?: (ref: ControllerPage) => void;
} & ControllerPageProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerPageProps,
  keyof typeof ControllerPage.$propsDefault
>;
declare module 'zova-module-home-base' {
  export interface ControllerPage {
    $props: ControllerInnerProps;
  }
}

export const ZPage = defineComponent((_props: ZPageProps) => {
  useController(ControllerPage, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'home-base:page': ControllerPageProps;
  }
}
