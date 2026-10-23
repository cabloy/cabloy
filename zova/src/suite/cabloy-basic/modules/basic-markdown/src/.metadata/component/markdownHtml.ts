import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerMarkdownHtmlProps } from '../../component/markdownHtml/controller.tsx';

import { ControllerMarkdownHtml } from '../../component/markdownHtml/controller.tsx';
import { RenderMarkdownHtml } from '../../component/markdownHtml/render.tsx';
import { StyleMarkdownHtml } from '../../component/markdownHtml/style.ts';
export type ZMarkdownHtmlProps = {
  controllerRef?: (ref: ControllerMarkdownHtml) => void;
} & ControllerMarkdownHtmlProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerMarkdownHtmlProps,
  keyof typeof ControllerMarkdownHtml.$propsDefault
>;
declare module 'zova-module-basic-markdown' {
  export interface ControllerMarkdownHtml {
    $props: ControllerInnerProps;
  }
}
declare module 'zova-module-basic-markdown' {
  export interface StyleMarkdownHtml extends ControllerMarkdownHtml {}
  export interface RenderMarkdownHtml extends StyleMarkdownHtml {}
}
export const ZMarkdownHtml = defineComponent((_props: ZMarkdownHtmlProps) => {
  useController(ControllerMarkdownHtml, RenderMarkdownHtml, StyleMarkdownHtml);
  return () => {};
}, prepareComponentOptions(ControllerMarkdownHtml.$componentOptions));
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-markdown:markdownHtml': ControllerMarkdownHtmlProps;
  }
}
