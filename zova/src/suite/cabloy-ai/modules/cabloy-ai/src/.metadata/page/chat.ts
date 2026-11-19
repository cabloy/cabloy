import { createZovaComponentPage } from 'zova';

import { ControllerPageChat } from '../../page/chat/controller.tsx';
import { StylePageChat } from '../../page/chat/style.ts';
declare module 'zova-module-cabloy-ai' {
  export interface StylePageChat extends ControllerPageChat {}
}
export const ZPageChat = createZovaComponentPage(ControllerPageChat, undefined, StylePageChat);
