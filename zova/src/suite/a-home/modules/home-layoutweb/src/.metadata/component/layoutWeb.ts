import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerLayoutWebProps } from '../../component/layoutWeb/controller.tsx';

import { ControllerLayoutWeb } from '../../component/layoutWeb/controller.tsx';
import { RenderLayoutWeb } from '../../component/layoutWeb/render.tsx';
import { StyleLayoutWeb } from '../../component/layoutWeb/style.ts';
export type ZLayoutWebProps = {
  controllerRef?: (ref: ControllerLayoutWeb) => void;
} & ControllerLayoutWebProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerLayoutWebProps,
  keyof typeof ControllerLayoutWeb.$propsDefault
>;
declare module 'zova-module-home-layoutweb' {
  export interface ControllerLayoutWeb {
    $props: ControllerInnerProps;
  }
}
declare module 'zova-module-home-layoutweb' {
  export interface StyleLayoutWeb extends ControllerLayoutWeb {}
  export interface RenderLayoutWeb extends StyleLayoutWeb {}
  export interface RenderContent extends StyleLayoutWeb {}
  export interface RenderHeader extends StyleLayoutWeb {}
  export interface RenderLocale extends StyleLayoutWeb {}
  export interface RenderTabs extends StyleLayoutWeb {}
  export interface RenderTheme extends StyleLayoutWeb {}
  export interface RenderUser extends StyleLayoutWeb {}
}
export const ZLayoutWeb = defineComponent((_props: ZLayoutWebProps) => {
  useController(ControllerLayoutWeb, RenderLayoutWeb, StyleLayoutWeb);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'home-layoutweb:layoutWeb': ControllerLayoutWebProps;
  }
}
