import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerControllerBoundaryProbeInlineProps } from '../../component/controllerBoundaryProbeInline/controller.jsx';

import { ControllerControllerBoundaryProbeInline } from '../../component/controllerBoundaryProbeInline/controller.jsx';
export type ZControllerBoundaryProbeInlineProps = {
  controllerRef?: (ref: ControllerControllerBoundaryProbeInline) => void;
} & ControllerControllerBoundaryProbeInlineProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerControllerBoundaryProbeInlineProps,
  keyof typeof ControllerControllerBoundaryProbeInline.$propsDefault
>;
declare module 'zova-module-demo-basic' {
  export interface ControllerControllerBoundaryProbeInline {
    $props: ControllerInnerProps;
  }
}

export const ZControllerBoundaryProbeInline = defineComponent(
  (_props: ZControllerBoundaryProbeInlineProps) => {
    useController(ControllerControllerBoundaryProbeInline, undefined, undefined);
    return () => {};
  },
  prepareComponentOptions(ControllerControllerBoundaryProbeInline.$componentOptions),
);
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'demo-basic:controllerBoundaryProbeInline': ControllerControllerBoundaryProbeInlineProps;
  }
}
