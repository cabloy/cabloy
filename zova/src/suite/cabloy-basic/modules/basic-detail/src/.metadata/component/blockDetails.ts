import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockDetailsProps } from '../../component/blockDetails/controller.jsx';

import { ControllerBlockDetails } from '../../component/blockDetails/controller.jsx';
export type ZBlockDetailsProps<TData extends {} = {}> = {
  controllerRef?: (ref: ControllerBlockDetails<TData>) => void;
} & ControllerBlockDetailsProps<TData>;

type ControllerInnerProps<TData extends {} = {}> = TypeControllerInnerProps<
  ControllerBlockDetailsProps<TData>,
  keyof typeof ControllerBlockDetails.$propsDefault
>;
declare module 'zova-module-basic-detail' {
  export interface ControllerBlockDetails<TData extends {} = {}> {
    $props: ControllerInnerProps<TData>;
  }
}

export const ZBlockDetails = defineComponent(
  <TData extends {} = {}>(_props: ZBlockDetailsProps<TData>) => {
    useController(ControllerBlockDetails, undefined, undefined);
    return () => {};
  },
  prepareComponentOptions(ControllerBlockDetails.$componentOptions),
);
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-detail:blockDetails': ControllerBlockDetailsProps;
  }
}
