import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormProps } from '../../component/form/controller.jsx';

import { ControllerForm } from '../../component/form/controller.jsx';
import { RenderForm } from '../../component/form/render.jsx';
export type ZFormProps<TFormData extends {} = {}, TSubmitMeta = never> = {
  controllerRef?: (ref: ControllerForm<TFormData, TSubmitMeta>) => void;
} & ControllerFormProps<TFormData, TSubmitMeta>;

type ControllerInnerProps<
  TFormData extends {} = {},
  TSubmitMeta = never,
> = TypeControllerInnerProps<
  ControllerFormProps<TFormData, TSubmitMeta>,
  keyof typeof ControllerForm.$propsDefault
>;
declare module 'zova-module-a-form' {
  export interface ControllerForm<TFormData extends {} = {}, TSubmitMeta = never> {
    $props: ControllerInnerProps<TFormData, TSubmitMeta>;
  }
}
declare module 'zova-module-a-form' {
  export interface RenderForm<
    TFormData extends {} = {},
    TSubmitMeta = never,
  > extends ControllerForm<TFormData, TSubmitMeta> {}
}
export const ZForm = defineComponent(
  <TFormData extends {} = {}, TSubmitMeta = never>(_props: ZFormProps<TFormData, TSubmitMeta>) => {
    useController(ControllerForm, RenderForm, undefined);
    return () => {};
  },
  prepareComponentOptions(),
);
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'a-form:form': ControllerFormProps;
  }
}
