import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerImageUploaderProps } from '../../component/imageUploader/controller.jsx';

import { ControllerImageUploader } from '../../component/imageUploader/controller.jsx';
export type ZImageUploaderProps = {
  controllerRef?: (ref: ControllerImageUploader) => void;
} & ControllerImageUploaderProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerImageUploaderProps,
  keyof typeof ControllerImageUploader.$propsDefault
>;
declare module 'zova-module-basic-image' {
  export interface ControllerImageUploader {
    $props: ControllerInnerProps;
  }
}

export const ZImageUploader = defineComponent((_props: ZImageUploaderProps) => {
  useController(ControllerImageUploader, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerImageUploader.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-image:imageUploader': ControllerImageUploaderProps;
  }
}
