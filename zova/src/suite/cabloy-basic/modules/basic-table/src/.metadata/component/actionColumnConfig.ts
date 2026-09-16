import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerActionColumnConfigProps } from '../../component/actionColumnConfig/controller.jsx';

import { ControllerActionColumnConfig } from '../../component/actionColumnConfig/controller.jsx';
export type ZActionColumnConfigProps = {
  controllerRef?: (ref: ControllerActionColumnConfig) => void;
} & ControllerActionColumnConfigProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerActionColumnConfigProps,
  keyof typeof ControllerActionColumnConfig.$propsDefault
>;
declare module 'zova-module-basic-table' {
  export interface ControllerActionColumnConfig {
    $props: ControllerInnerProps;
  }
}

export const ZActionColumnConfig = defineComponent((_props: ZActionColumnConfigProps) => {
  useController(ControllerActionColumnConfig, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerActionColumnConfig.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-table:actionColumnConfig': ControllerActionColumnConfigProps;
  }
}
