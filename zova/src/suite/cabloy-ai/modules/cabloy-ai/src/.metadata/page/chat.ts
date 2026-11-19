import { createZovaComponentPage } from 'zova';

import { ControllerPageChat } from '../../page/chat/controller.tsx';
import { RenderPageChat } from '../../page/chat/render.tsx';
import { StylePageChat } from '../../page/chat/style.ts';
declare module 'zova-module-cabloy-ai' {
  export interface StylePageChat extends ControllerPageChat {}
  export interface RenderPageChat extends StylePageChat {}
}
export const ZPageChat = createZovaComponentPage(ControllerPageChat, RenderPageChat, StylePageChat);
