import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerActionCreateProps } from '../../component/actionCreate/controller.jsx';

import { ControllerActionCreate } from '../../component/actionCreate/controller.jsx';
export type ZActionCreateProps = {
  controllerRef?: (ref: ControllerActionCreate) => void;
} & ControllerActionCreateProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerActionCreateProps,
  keyof typeof ControllerActionCreate.$propsDefault
>;
declare module 'zova-module-basic-table' {
  export interface ControllerActionCreate {
    $props: ControllerInnerProps;
  }
}

export const ZActionCreate = defineComponent((_props: ZActionCreateProps) => {
  useController(ControllerActionCreate, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerActionCreate.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-table:actionCreate': ControllerActionCreateProps;
  }
}
