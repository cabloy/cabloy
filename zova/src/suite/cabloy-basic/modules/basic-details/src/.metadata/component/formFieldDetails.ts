import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldDetailsProps } from '../../component/formFieldDetails/controller.jsx';

import { ControllerFormFieldDetails } from '../../component/formFieldDetails/controller.jsx';
export type ZFormFieldDetailsProps = {
  controllerRef?: (ref: ControllerFormFieldDetails) => void;
} & ControllerFormFieldDetailsProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldDetailsProps,
  keyof typeof ControllerFormFieldDetails.$propsDefault
>;
declare module 'zova-module-basic-details' {
  export interface ControllerFormFieldDetails {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldDetails = defineComponent((_props: ZFormFieldDetailsProps) => {
  useController(ControllerFormFieldDetails, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldDetails.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-details:formFieldDetails': ControllerFormFieldDetailsProps;
  }
}
