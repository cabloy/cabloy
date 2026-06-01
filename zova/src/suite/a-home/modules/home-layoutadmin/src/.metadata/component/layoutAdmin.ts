import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerLayoutAdminProps } from '../../component/layoutAdmin/controller.jsx';

import { ControllerLayoutAdmin } from '../../component/layoutAdmin/controller.jsx';
import { RenderLayoutAdmin } from '../../component/layoutAdmin/render.jsx';
import { StyleLayoutAdmin } from '../../component/layoutAdmin/style.js';
export type ZLayoutAdminProps = {
  controllerRef?: (ref: ControllerLayoutAdmin) => void;
} & ControllerLayoutAdminProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerLayoutAdminProps,
  keyof typeof ControllerLayoutAdmin.$propsDefault
>;
declare module 'zova-module-home-layoutadmin' {
  export interface ControllerLayoutAdmin {
    $props: ControllerInnerProps;
  }
}
declare module 'zova-module-home-layoutadmin' {
  export interface StyleLayoutAdmin extends ControllerLayoutAdmin {}
  export interface RenderLayoutAdmin extends StyleLayoutAdmin {}
  export interface RenderContent extends StyleLayoutAdmin {}
  export interface RenderHeader extends StyleLayoutAdmin {}
  export interface RenderLocale extends StyleLayoutAdmin {}
  export interface RenderMenu extends StyleLayoutAdmin {}
  export interface RenderSidebar extends StyleLayoutAdmin {}
  export interface RenderTabs extends StyleLayoutAdmin {}
  export interface RenderTheme extends StyleLayoutAdmin {}
  export interface RenderUser extends StyleLayoutAdmin {}
}
export const ZLayoutAdmin = defineComponent((_props: ZLayoutAdminProps) => {
  useController(ControllerLayoutAdmin, RenderLayoutAdmin, StyleLayoutAdmin);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'home-layoutadmin:layoutAdmin': ControllerLayoutAdminProps;
  }
}
