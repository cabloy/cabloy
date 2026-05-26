import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldProps } from '../../component/formField/controller.jsx';

import { ControllerFormField } from '../../component/formField/controller.jsx';
import { RenderFormField } from '../../component/formField/render.jsx';
export type ZFormFieldProps<TParentData extends {} = {}> = {
  controllerRef?: (ref: ControllerFormField<TParentData>) => void;
} & ControllerFormFieldProps<TParentData>;

type ControllerInnerProps<TParentData extends {} = {}> = TypeControllerInnerProps<
  ControllerFormFieldProps<TParentData>,
  keyof typeof ControllerFormField.$propsDefault
>;
declare module 'zova-module-a-form' {
  export interface ControllerFormField<TParentData extends {} = {}> {
    $props: ControllerInnerProps<TParentData>;
  }
}
declare module 'zova-module-a-form' {
  export interface RenderFormField<
    TParentData extends {} = {},
  > extends ControllerFormField<TParentData> {}
}
export const ZFormField = defineComponent(
  <TParentData extends {} = {}>(_props: ZFormFieldProps<TParentData>) => {
    useController(ControllerFormField, RenderFormField, undefined);
    return () => {};
  },
  prepareComponentOptions(ControllerFormField.$componentOptions),
);
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'a-form:formField': ControllerFormFieldProps;
  }
}
