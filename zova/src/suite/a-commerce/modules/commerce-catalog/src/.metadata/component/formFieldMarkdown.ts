import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerFormFieldMarkdownProps } from '../../component/formFieldMarkdown/controller.jsx';

import { ControllerFormFieldMarkdown } from '../../component/formFieldMarkdown/controller.jsx';
import { RenderFormFieldMarkdown } from '../../component/formFieldMarkdown/render.jsx';
import { StyleFormFieldMarkdown } from '../../component/formFieldMarkdown/style.js';
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
declare module 'zova-module-commerce-catalog' {
  export interface StyleFormFieldMarkdown extends ControllerFormFieldMarkdown {}
  export interface RenderFormFieldMarkdown extends StyleFormFieldMarkdown {}
}
export const ZFormFieldMarkdown = defineComponent((_props: ZFormFieldMarkdownProps) => {
  useController(ControllerFormFieldMarkdown, RenderFormFieldMarkdown, StyleFormFieldMarkdown);
  return () => {};
}, prepareComponentOptions(ControllerFormFieldMarkdown.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'commerce-catalog:formFieldMarkdown': ControllerFormFieldMarkdownProps;
  }
}
