import type {
  DefineModelOptions,
  TypePropUpdateFromModel,
  TypePropValueFromModel,
  TypeControllerInnerProps,
} from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type {
  ControllerSelectModels,
  ControllerSelectProps,
} from '../../component/select/controller.jsx';

import { ControllerSelect } from '../../component/select/controller.jsx';
export type ZSelectProps = {
  controllerRef?: (ref: ControllerSelect) => void;
} & ControllerSelectProps &
  ControllerSelectModels & {
    [KEY in keyof ControllerSelectModels as TypePropValueFromModel<KEY>]: ControllerSelectModels[KEY];
  } & {
    [KEY in keyof ControllerSelectModels as TypePropUpdateFromModel<KEY>]: (
      value: ControllerSelectModels[KEY],
    ) => void;
  };
type TypeModelArguments = {
  [KEY in keyof ControllerSelectModels as TypePropValueFromModel<KEY>]: ControllerSelectModels[KEY];
};
type ControllerInnerProps = TypeControllerInnerProps<
  ControllerSelectProps & {
    [KEY in keyof ControllerSelectModels as TypePropValueFromModel<KEY>]: ControllerSelectModels[KEY];
  },
  keyof typeof ControllerSelect.$propsDefault
>;
declare module 'zova-module-basic-select' {
  export interface ControllerSelect {
    $props: ControllerInnerProps;
    $useModel<K extends keyof TypeModelArguments>(
      name: K,
      options?: DefineModelOptions<TypeModelArguments[K]>,
    ): ControllerInnerProps[K];
  }
}

export const ZSelect = defineComponent((_props: ZSelectProps) => {
  useController(ControllerSelect, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-select:select': ControllerSelectProps &
      ControllerSelectModels & {
        [KEY in keyof ControllerSelectModels as TypePropValueFromModel<KEY>]: ControllerSelectModels[KEY];
      } & {
        [KEY in keyof ControllerSelectModels as TypePropUpdateFromModel<KEY>]: (
          value: ControllerSelectModels[KEY],
        ) => void;
      };
  }
}
