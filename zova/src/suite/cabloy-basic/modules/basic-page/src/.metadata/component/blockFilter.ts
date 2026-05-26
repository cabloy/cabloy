import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockFilterProps } from '../../component/blockFilter/controller.jsx';

import { ControllerBlockFilter } from '../../component/blockFilter/controller.jsx';
export type ZBlockFilterProps = {
  controllerRef?: (ref: ControllerBlockFilter) => void;
} & ControllerBlockFilterProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockFilterProps,
  keyof typeof ControllerBlockFilter.$propsDefault
>;
declare module 'zova-module-basic-page' {
  export interface ControllerBlockFilter {
    $props: ControllerInnerProps;
  }
}

export const ZBlockFilter = defineComponent((_props: ZBlockFilterProps) => {
  useController(ControllerBlockFilter, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockFilter.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-page:blockFilter': ControllerBlockFilterProps;
  }
}
