import type {
  DefineModelOptions,
  TypePropUpdateFromModel,
  TypePropValueFromModel,
  TypeControllerInnerProps,
} from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type {
  ControllerDateModels,
  ControllerDateProps,
} from '../../component/date/controller.jsx';

import { ControllerDate } from '../../component/date/controller.jsx';
export type ZDateProps = {
  controllerRef?: (ref: ControllerDate) => void;
} & ControllerDateProps &
  ControllerDateModels & {
    [KEY in keyof ControllerDateModels as TypePropValueFromModel<KEY>]: ControllerDateModels[KEY];
  } & {
    [KEY in keyof ControllerDateModels as TypePropUpdateFromModel<KEY>]: (
      value: ControllerDateModels[KEY],
    ) => void;
  };
type TypeModelArguments = {
  [KEY in keyof ControllerDateModels as TypePropValueFromModel<KEY>]: ControllerDateModels[KEY];
};
type ControllerInnerProps = TypeControllerInnerProps<
  ControllerDateProps & {
    [KEY in keyof ControllerDateModels as TypePropValueFromModel<KEY>]: ControllerDateModels[KEY];
  },
  keyof typeof ControllerDate.$propsDefault
>;
declare module 'zova-module-basic-date' {
  export interface ControllerDate {
    $props: ControllerInnerProps;
    $useModel<K extends keyof TypeModelArguments>(
      name: K,
      options?: DefineModelOptions<TypeModelArguments[K]>,
    ): ControllerInnerProps[K];
  }
}

export const ZDate = defineComponent((_props: ZDateProps) => {
  useController(ControllerDate, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-date:date': ControllerDateProps &
      ControllerDateModels & {
        [KEY in keyof ControllerDateModels as TypePropValueFromModel<KEY>]: ControllerDateModels[KEY];
      } & {
        [KEY in keyof ControllerDateModels as TypePropUpdateFromModel<KEY>]: (
          value: ControllerDateModels[KEY],
        ) => void;
      };
  }
}
