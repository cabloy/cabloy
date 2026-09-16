import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerActionRefreshProps } from '../../component/actionRefresh/controller.jsx';

import { ControllerActionRefresh } from '../../component/actionRefresh/controller.jsx';
export type ZActionRefreshProps = {
  controllerRef?: (ref: ControllerActionRefresh) => void;
} & ControllerActionRefreshProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerActionRefreshProps,
  keyof typeof ControllerActionRefresh.$propsDefault
>;
declare module 'zova-module-basic-table' {
  export interface ControllerActionRefresh {
    $props: ControllerInnerProps;
  }
}

export const ZActionRefresh = defineComponent((_props: ZActionRefreshProps) => {
  useController(ControllerActionRefresh, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerActionRefresh.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-table:actionRefresh': ControllerActionRefreshProps;
  }
}
