import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockFormProps } from '../../component/blockForm/controller.jsx';

import { ControllerBlockForm } from '../../component/blockForm/controller.jsx';
export type ZBlockFormProps = {
  controllerRef?: (ref: ControllerBlockForm) => void;
} & ControllerBlockFormProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockFormProps,
  keyof typeof ControllerBlockForm.$propsDefault
>;
declare module 'zova-module-basic-pageentry' {
  export interface ControllerBlockForm {
    $props: ControllerInnerProps;
  }
}

export const ZBlockForm = defineComponent((_props: ZBlockFormProps) => {
  useController(ControllerBlockForm, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockForm.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-pageentry:blockForm': ControllerBlockFormProps;
  }
}
