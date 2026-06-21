import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockPagerProps } from '../../component/blockPager/controller.jsx';

import { ControllerBlockPager } from '../../component/blockPager/controller.jsx';
export type ZBlockPagerProps = {
  controllerRef?: (ref: ControllerBlockPager) => void;
} & ControllerBlockPagerProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockPagerProps,
  keyof typeof ControllerBlockPager.$propsDefault
>;
declare module 'zova-module-basic-page' {
  export interface ControllerBlockPager {
    $props: ControllerInnerProps;
  }
}

export const ZBlockPager = defineComponent((_props: ZBlockPagerProps) => {
  useController(ControllerBlockPager, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockPager.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-page:blockPager': ControllerBlockPagerProps;
  }
}
