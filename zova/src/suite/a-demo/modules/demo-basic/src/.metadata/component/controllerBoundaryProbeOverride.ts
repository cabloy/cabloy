import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerControllerBoundaryProbeOverrideProps } from '../../component/controllerBoundaryProbeOverride/controller.jsx';

import { ControllerControllerBoundaryProbeOverride } from '../../component/controllerBoundaryProbeOverride/controller.jsx';
export type ZControllerBoundaryProbeOverrideProps = {
  controllerRef?: (ref: ControllerControllerBoundaryProbeOverride) => void;
} & ControllerControllerBoundaryProbeOverrideProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerControllerBoundaryProbeOverrideProps,
  keyof typeof ControllerControllerBoundaryProbeOverride.$propsDefault
>;
declare module 'zova-module-demo-basic' {
  export interface ControllerControllerBoundaryProbeOverride {
    $props: ControllerInnerProps;
  }
}

export const ZControllerBoundaryProbeOverride = defineComponent(
  (_props: ZControllerBoundaryProbeOverrideProps) => {
    useController(ControllerControllerBoundaryProbeOverride, undefined, undefined);
    return () => {};
  },
  prepareComponentOptions(ControllerControllerBoundaryProbeOverride.$componentOptions),
);
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'demo-basic:controllerBoundaryProbeOverride': ControllerControllerBoundaryProbeOverrideProps;
  }
}
