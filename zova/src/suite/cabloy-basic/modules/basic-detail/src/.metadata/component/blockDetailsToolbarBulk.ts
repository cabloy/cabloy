import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockDetailsToolbarBulkProps } from '../../component/blockDetailsToolbarBulk/controller.jsx';

import { ControllerBlockDetailsToolbarBulk } from '../../component/blockDetailsToolbarBulk/controller.jsx';
export type ZBlockDetailsToolbarBulkProps = {
  controllerRef?: (ref: ControllerBlockDetailsToolbarBulk) => void;
} & ControllerBlockDetailsToolbarBulkProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockDetailsToolbarBulkProps,
  keyof typeof ControllerBlockDetailsToolbarBulk.$propsDefault
>;
declare module 'zova-module-basic-detail' {
  export interface ControllerBlockDetailsToolbarBulk {
    $props: ControllerInnerProps;
  }
}

export const ZBlockDetailsToolbarBulk = defineComponent((_props: ZBlockDetailsToolbarBulkProps) => {
  useController(ControllerBlockDetailsToolbarBulk, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockDetailsToolbarBulk.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-detail:blockDetailsToolbarBulk': ControllerBlockDetailsToolbarBulkProps;
  }
}
