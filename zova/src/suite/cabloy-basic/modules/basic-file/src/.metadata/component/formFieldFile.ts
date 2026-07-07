import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldFileProps } from '../../component/formFieldFile/controller.jsx';

import { ControllerFormFieldFile } from '../../component/formFieldFile/controller.jsx';
export type ZFormFieldFileProps = {
  controllerRef?: (ref: ControllerFormFieldFile) => void;
} & ControllerFormFieldFileProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldFileProps,
  keyof typeof ControllerFormFieldFile.$propsDefault
>;
declare module 'zova-module-basic-file' {
  export interface ControllerFormFieldFile {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldFile = defineComponent((_props: ZFormFieldFileProps) => {
  useController(ControllerFormFieldFile, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldFile.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-file:formFieldFile': ControllerFormFieldFileProps;
  }
}
