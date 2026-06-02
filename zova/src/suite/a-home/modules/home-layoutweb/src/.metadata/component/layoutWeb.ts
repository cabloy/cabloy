import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerLayoutWebProps } from '../../component/layoutWeb/controller.jsx';

import { ControllerLayoutWeb } from '../../component/layoutWeb/controller.jsx';
import { RenderLayoutWeb } from '../../component/layoutWeb/render.jsx';
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
  export interface RenderLayoutWeb extends ControllerLayoutWeb {}
  export interface RenderContent extends ControllerLayoutWeb {}
  export interface RenderFooter extends ControllerLayoutWeb {}
  export interface RenderHeader extends ControllerLayoutWeb {}
  export interface RenderLocale extends ControllerLayoutWeb {}
  export interface RenderTabs extends ControllerLayoutWeb {}
  export interface RenderTheme extends ControllerLayoutWeb {}
}
export const ZLayoutWeb = defineComponent((_props: ZLayoutWebProps) => {
  useController(ControllerLayoutWeb, RenderLayoutWeb, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'home-layoutweb:layoutWeb': ControllerLayoutWebProps;
  }
}
