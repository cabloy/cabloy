import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerLayoutEmptyProps } from '../../component/layoutEmpty/controller.jsx';

import { ControllerLayoutEmpty } from '../../component/layoutEmpty/controller.jsx';
export type ZLayoutEmptyProps = {
  controllerRef?: (ref: ControllerLayoutEmpty) => void;
} & ControllerLayoutEmptyProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerLayoutEmptyProps,
  keyof typeof ControllerLayoutEmpty.$propsDefault
>;
declare module 'zova-module-home-layoutempty' {
  export interface ControllerLayoutEmpty {
    $props: ControllerInnerProps;
  }
}

export const ZLayoutEmpty = defineComponent((_props: ZLayoutEmptyProps) => {
  useController(ControllerLayoutEmpty, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'home-layoutempty:layoutEmpty': ControllerLayoutEmptyProps;
  }
}
