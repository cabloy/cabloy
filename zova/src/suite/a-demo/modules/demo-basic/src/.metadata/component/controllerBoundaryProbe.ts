import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerControllerBoundaryProbeProps } from '../../component/controllerBoundaryProbe/controller.jsx';

import { ControllerControllerBoundaryProbe } from '../../component/controllerBoundaryProbe/controller.jsx';
export type ZControllerBoundaryProbeProps = {
  controllerRef?: (ref: ControllerControllerBoundaryProbe) => void;
} & ControllerControllerBoundaryProbeProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerControllerBoundaryProbeProps,
  keyof typeof ControllerControllerBoundaryProbe.$propsDefault
>;
declare module 'zova-module-demo-basic' {
  export interface ControllerControllerBoundaryProbe {
    $props: ControllerInnerProps;
  }
}

export const ZControllerBoundaryProbe = defineComponent((_props: ZControllerBoundaryProbeProps) => {
  useController(ControllerControllerBoundaryProbe, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerControllerBoundaryProbe.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'demo-basic:controllerBoundaryProbe': ControllerControllerBoundaryProbeProps;
  }
}
