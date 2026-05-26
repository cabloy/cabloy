import type {
  DefineModelOptions,
  TypePropUpdateFromModel,
  TypePropValueFromModel,
  TypeControllerInnerProps,
} from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type {
  ControllerDateRangeModels,
  ControllerDateRangeProps,
} from '../../component/dateRange/controller.jsx';

import { ControllerDateRange } from '../../component/dateRange/controller.jsx';
export type ZDateRangeProps = {
  controllerRef?: (ref: ControllerDateRange) => void;
} & ControllerDateRangeProps &
  ControllerDateRangeModels & {
    [KEY in keyof ControllerDateRangeModels as TypePropValueFromModel<KEY>]: ControllerDateRangeModels[KEY];
  } & {
    [KEY in keyof ControllerDateRangeModels as TypePropUpdateFromModel<KEY>]: (
      value: ControllerDateRangeModels[KEY],
    ) => void;
  };
type TypeModelArguments = {
  [KEY in keyof ControllerDateRangeModels as TypePropValueFromModel<KEY>]: ControllerDateRangeModels[KEY];
};
type ControllerInnerProps = TypeControllerInnerProps<
  ControllerDateRangeProps & {
    [KEY in keyof ControllerDateRangeModels as TypePropValueFromModel<KEY>]: ControllerDateRangeModels[KEY];
  },
  keyof typeof ControllerDateRange.$propsDefault
>;
declare module 'zova-module-basic-date' {
  export interface ControllerDateRange {
    $props: ControllerInnerProps;
    $useModel<K extends keyof TypeModelArguments>(
      name: K,
      options?: DefineModelOptions<TypeModelArguments[K]>,
    ): ControllerInnerProps[K];
  }
}

export const ZDateRange = defineComponent((_props: ZDateRangeProps) => {
  useController(ControllerDateRange, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-date:dateRange': ControllerDateRangeProps &
      ControllerDateRangeModels & {
        [KEY in keyof ControllerDateRangeModels as TypePropValueFromModel<KEY>]: ControllerDateRangeModels[KEY];
      } & {
        [KEY in keyof ControllerDateRangeModels as TypePropUpdateFromModel<KEY>]: (
          value: ControllerDateRangeModels[KEY],
        ) => void;
      };
  }
}
