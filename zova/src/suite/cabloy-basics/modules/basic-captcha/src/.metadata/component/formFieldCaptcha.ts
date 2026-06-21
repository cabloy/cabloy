import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldCaptchaProps } from '../../component/formFieldCaptcha/controller.jsx';

import { ControllerFormFieldCaptcha } from '../../component/formFieldCaptcha/controller.jsx';
export type ZFormFieldCaptchaProps = {
  controllerRef?: (ref: ControllerFormFieldCaptcha) => void;
} & ControllerFormFieldCaptchaProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldCaptchaProps,
  keyof typeof ControllerFormFieldCaptcha.$propsDefault
>;
declare module 'zova-module-basic-captcha' {
  export interface ControllerFormFieldCaptcha {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldCaptcha = defineComponent((_props: ZFormFieldCaptchaProps) => {
  useController(ControllerFormFieldCaptcha, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldCaptcha.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-captcha:formFieldCaptcha': ControllerFormFieldCaptchaProps;
  }
}
