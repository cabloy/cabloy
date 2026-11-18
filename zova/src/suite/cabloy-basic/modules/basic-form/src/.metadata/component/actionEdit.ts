import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerActionEditProps } from '../../component/actionEdit/controller.tsx';

import { ControllerActionEdit } from '../../component/actionEdit/controller.tsx';
export type ZActionEditProps = {
  controllerRef?: (ref: ControllerActionEdit) => void;
} & ControllerActionEditProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerActionEditProps,
  keyof typeof ControllerActionEdit.$propsDefault
>;
declare module 'zova-module-basic-form' {
  export interface ControllerActionEdit {
    $props: ControllerInnerProps;
  }
}

export const ZActionEdit = defineComponent((_props: ZActionEditProps) => {
  useController(ControllerActionEdit, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerActionEdit.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-form:actionEdit': ControllerActionEditProps;
  }
}
