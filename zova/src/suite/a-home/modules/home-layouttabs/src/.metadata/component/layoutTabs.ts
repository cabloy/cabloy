import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerLayoutTabsProps } from '../../component/layoutTabs/controller.jsx';

import { ControllerLayoutTabs } from '../../component/layoutTabs/controller.jsx';
import { RenderLayoutTabs } from '../../component/layoutTabs/render.jsx';
import { StyleLayoutTabs } from '../../component/layoutTabs/style.js';
export type ZLayoutTabsProps = {
  controllerRef?: (ref: ControllerLayoutTabs) => void;
} & ControllerLayoutTabsProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerLayoutTabsProps,
  keyof typeof ControllerLayoutTabs.$propsDefault
>;
declare module 'zova-module-home-layouttabs' {
  export interface ControllerLayoutTabs {
    $props: ControllerInnerProps;
  }
}
declare module 'zova-module-home-layouttabs' {
  export interface StyleLayoutTabs extends ControllerLayoutTabs {}
  export interface RenderLayoutTabs extends StyleLayoutTabs {}
  export interface RenderContent extends StyleLayoutTabs {}
  export interface RenderHeader extends StyleLayoutTabs {}
  export interface RenderLocale extends StyleLayoutTabs {}
  export interface RenderMenu extends StyleLayoutTabs {}
  export interface RenderSidebar extends StyleLayoutTabs {}
  export interface RenderTabs extends StyleLayoutTabs {}
  export interface RenderTheme extends StyleLayoutTabs {}
  export interface RenderUser extends StyleLayoutTabs {}
}
export const ZLayoutTabs = defineComponent((_props: ZLayoutTabsProps) => {
  useController(ControllerLayoutTabs, RenderLayoutTabs, StyleLayoutTabs);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'home-layouttabs:layoutTabs': ControllerLayoutTabsProps;
  }
}
