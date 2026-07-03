import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldImageProps } from '../../component/formFieldImage/controller.jsx';

import { ControllerFormFieldImage } from '../../component/formFieldImage/controller.jsx';
export type ZFormFieldImageProps = {
  controllerRef?: (ref: ControllerFormFieldImage) => void;
} & ControllerFormFieldImageProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldImageProps,
  keyof typeof ControllerFormFieldImage.$propsDefault
>;
declare module 'zova-module-basic-image' {
  export interface ControllerFormFieldImage {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldImage = defineComponent((_props: ZFormFieldImageProps) => {
  useController(ControllerFormFieldImage, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldImage.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-image:formFieldImage': ControllerFormFieldImageProps;
  }
}
