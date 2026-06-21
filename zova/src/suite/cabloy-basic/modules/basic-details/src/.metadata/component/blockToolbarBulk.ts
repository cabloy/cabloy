import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockToolbarBulkProps } from '../../component/blockToolbarBulk/controller.jsx';

import { ControllerBlockToolbarBulk } from '../../component/blockToolbarBulk/controller.jsx';
export type ZBlockToolbarBulkProps = {
  controllerRef?: (ref: ControllerBlockToolbarBulk) => void;
} & ControllerBlockToolbarBulkProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockToolbarBulkProps,
  keyof typeof ControllerBlockToolbarBulk.$propsDefault
>;
declare module 'zova-module-basic-details' {
  export interface ControllerBlockToolbarBulk {
    $props: ControllerInnerProps;
  }
}

export const ZBlockToolbarBulk = defineComponent((_props: ZBlockToolbarBulkProps) => {
  useController(ControllerBlockToolbarBulk, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockToolbarBulk.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-details:blockToolbarBulk': ControllerBlockToolbarBulkProps;
  }
}
