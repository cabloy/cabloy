import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerItemLinkProps } from '../../component/itemLink/controller.jsx';

import { ControllerItemLink } from '../../component/itemLink/controller.jsx';
export type ZItemLinkProps = {
  controllerRef?: (ref: ControllerItemLink) => void;
} & ControllerItemLinkProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerItemLinkProps,
  keyof typeof ControllerItemLink.$propsDefault
>;
declare module 'zova-module-home-base' {
  export interface ControllerItemLink {
    $props: ControllerInnerProps;
  }
}

export const ZItemLink = defineComponent((_props: ZItemLinkProps) => {
  useController(ControllerItemLink, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'home-base:itemLink': ControllerItemLinkProps;
  }
}
