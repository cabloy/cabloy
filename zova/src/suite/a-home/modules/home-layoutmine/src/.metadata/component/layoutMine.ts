import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import { ControllerLayoutMine } from '../../component/layoutMine/controller.tsx';
import { RenderLayoutMine } from '../../component/layoutMine/render.tsx';
import { StyleLayoutMine } from '../../component/layoutMine/style.ts';
export type ZLayoutMineProps = {
  controllerRef?: (ref: ControllerLayoutMine) => void;
};

declare module 'zova-module-home-layoutmine' {
  export interface StyleLayoutMine extends ControllerLayoutMine {}
  export interface RenderLayoutMine extends StyleLayoutMine {}
  export interface RenderLocale extends StyleLayoutMine {}
  export interface RenderTheme extends StyleLayoutMine {}
  export interface RenderUser extends StyleLayoutMine {}
}
export const ZLayoutMine = defineComponent((_props: ZLayoutMineProps) => {
  useController(ControllerLayoutMine, RenderLayoutMine, StyleLayoutMine);
  return () => {};
}, prepareComponentOptions());
