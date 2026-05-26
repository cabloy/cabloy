import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerBlockPageEntryProps } from '../../component/blockPageEntry/controller.jsx';

import { ControllerBlockPageEntry } from '../../component/blockPageEntry/controller.jsx';
export type ZBlockPageEntryProps = {
  controllerRef?: (ref: ControllerBlockPageEntry) => void;
} & ControllerBlockPageEntryProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerBlockPageEntryProps,
  keyof typeof ControllerBlockPageEntry.$propsDefault
>;
declare module 'zova-module-basic-pageentry' {
  export interface ControllerBlockPageEntry {
    $props: ControllerInnerProps;
  }
}

export const ZBlockPageEntry = defineComponent((_props: ZBlockPageEntryProps) => {
  useController(ControllerBlockPageEntry, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerBlockPageEntry.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-pageentry:blockPageEntry': ControllerBlockPageEntryProps;
  }
}
