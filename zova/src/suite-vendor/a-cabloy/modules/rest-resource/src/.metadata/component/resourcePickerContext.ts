import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerResourcePickerContextProps } from '../../component/resourcePickerContext/controller.jsx';

import { ControllerResourcePickerContext } from '../../component/resourcePickerContext/controller.jsx';
export type ZResourcePickerContextProps = {
  controllerRef?: (ref: ControllerResourcePickerContext) => void;
} & ControllerResourcePickerContextProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerResourcePickerContextProps,
  keyof typeof ControllerResourcePickerContext.$propsDefault
>;
declare module 'zova-module-rest-resource' {
  export interface ControllerResourcePickerContext {
    $props: ControllerInnerProps;
  }
}

export const ZResourcePickerContext = defineComponent((_props: ZResourcePickerContextProps) => {
  useController(ControllerResourcePickerContext, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'rest-resource:resourcePickerContext': ControllerResourcePickerContextProps;
  }
}
