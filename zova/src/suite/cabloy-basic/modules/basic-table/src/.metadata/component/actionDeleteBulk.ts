import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerActionDeleteBulkProps } from '../../component/actionDeleteBulk/controller.jsx';

import { ControllerActionDeleteBulk } from '../../component/actionDeleteBulk/controller.jsx';
export type ZActionDeleteBulkProps = {
  controllerRef?: (ref: ControllerActionDeleteBulk) => void;
} & ControllerActionDeleteBulkProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerActionDeleteBulkProps,
  keyof typeof ControllerActionDeleteBulk.$propsDefault
>;
declare module 'zova-module-basic-table' {
  export interface ControllerActionDeleteBulk {
    $props: ControllerInnerProps;
  }
}

export const ZActionDeleteBulk = defineComponent((_props: ZActionDeleteBulkProps) => {
  useController(ControllerActionDeleteBulk, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerActionDeleteBulk.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-table:actionDeleteBulk': ControllerActionDeleteBulkProps;
  }
}
