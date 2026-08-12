import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldMarkdownProps } from '../../component/formFieldMarkdown/controller.jsx';

import { ControllerFormFieldMarkdown } from '../../component/formFieldMarkdown/controller.jsx';
export type ZFormFieldMarkdownProps = {
  controllerRef?: (ref: ControllerFormFieldMarkdown) => void;
} & ControllerFormFieldMarkdownProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerFormFieldMarkdownProps,
  keyof typeof ControllerFormFieldMarkdown.$propsDefault
>;
declare module 'zova-module-commerce-catalog' {
  export interface ControllerFormFieldMarkdown {
    $props: ControllerInnerProps;
  }
}

export const ZFormFieldMarkdown = defineComponent((_props: ZFormFieldMarkdownProps) => {
  useController(ControllerFormFieldMarkdown, undefined, undefined);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldMarkdown.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'commerce-catalog:formFieldMarkdown': ControllerFormFieldMarkdownProps;
  }
}
