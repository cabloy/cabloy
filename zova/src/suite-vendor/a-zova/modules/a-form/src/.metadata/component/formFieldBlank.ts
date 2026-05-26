import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldBlankProps } from '../../component/formFieldBlank/controller.jsx';

import { ControllerFormFieldBlank } from '../../component/formFieldBlank/controller.jsx';
export type ZFormFieldBlankProps<TParentData extends {} = {}, TSubmitMeta = never> = {
  controllerRef?: (ref: ControllerFormFieldBlank<TParentData, TSubmitMeta>) => void;
} & ControllerFormFieldBlankProps<TParentData, TSubmitMeta>;

type ControllerInnerProps<
  TParentData extends {} = {},
  TSubmitMeta = never,
> = TypeControllerInnerProps<
  ControllerFormFieldBlankProps<TParentData, TSubmitMeta>,
  keyof typeof ControllerFormFieldBlank.$propsDefault
>;
declare module 'zova-module-a-form' {
  export interface ControllerFormFieldBlank<TParentData extends {} = {}, TSubmitMeta = never> {
    $props: ControllerInnerProps<TParentData, TSubmitMeta>;
  }
}

export const ZFormFieldBlank = defineComponent(
  <TParentData extends {} = {}, TSubmitMeta = never>(
    _props: ZFormFieldBlankProps<TParentData, TSubmitMeta>,
  ) => {
    useController(ControllerFormFieldBlank, undefined, undefined);
    return () => {};
  },
  prepareComponentOptions(ControllerFormFieldBlank.$componentOptions),
);
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'a-form:formFieldBlank': ControllerFormFieldBlankProps;
  }
}
