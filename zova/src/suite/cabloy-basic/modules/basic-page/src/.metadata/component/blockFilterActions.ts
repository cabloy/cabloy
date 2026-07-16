import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockFilterActionsProps } from '../../component/blockFilterActions/controller.jsx';

import { ControllerBlockFilterActions } from '../../component/blockFilterActions/controller.jsx';
export type ZBlockFilterActionsProps = {
  controllerRef?: (ref: ControllerBlockFilterActions) => void;
} & ControllerBlockFilterActionsProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockFilterActionsProps,
  keyof typeof ControllerBlockFilterActions.$propsDefault
>;
declare module 'zova-module-basic-page' {
  export interface ControllerBlockFilterActions {
    $props: ControllerInnerProps;
  }
}

export const ZBlockFilterActions = defineComponent((_props: ZBlockFilterActionsProps) => {
  useController(ControllerBlockFilterActions, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockFilterActions.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-page:blockFilterActions': ControllerBlockFilterActionsProps;
  }
}
