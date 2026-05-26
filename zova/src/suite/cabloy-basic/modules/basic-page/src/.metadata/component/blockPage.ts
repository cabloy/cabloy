import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockPageProps } from '../../component/blockPage/controller.jsx';

import { ControllerBlockPage } from '../../component/blockPage/controller.jsx';
export type ZBlockPageProps = {
  controllerRef?: (ref: ControllerBlockPage) => void;
} & ControllerBlockPageProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockPageProps,
  keyof typeof ControllerBlockPage.$propsDefault
>;
declare module 'zova-module-basic-page' {
  export interface ControllerBlockPage {
    $props: ControllerInnerProps;
  }
}

export const ZBlockPage = defineComponent((_props: ZBlockPageProps) => {
  useController(ControllerBlockPage, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockPage.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-page:blockPage': ControllerBlockPageProps;
  }
}
