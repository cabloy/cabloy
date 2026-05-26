import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldDateRangeProps } from '../../component/formFieldDateRange/controller.jsx';

import { ControllerFormFieldDateRange } from '../../component/formFieldDateRange/controller.jsx';
export type ZFormFieldDateRangeProps = {
  controllerRef?: (ref: ControllerFormFieldDateRange) => void;
} & ControllerFormFieldDateRangeProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldDateRangeProps,
  keyof typeof ControllerFormFieldDateRange.$propsDefault
>;
declare module 'zova-module-basic-date' {
  export interface ControllerFormFieldDateRange {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldDateRange = defineComponent((_props: ZFormFieldDateRangeProps) => {
  useController(ControllerFormFieldDateRange, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldDateRange.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-date:formFieldDateRange': ControllerFormFieldDateRangeProps;
  }
}
