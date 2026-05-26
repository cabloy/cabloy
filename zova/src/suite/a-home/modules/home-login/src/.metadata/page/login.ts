import { createZovaComponentPage } from 'zova';

import { ControllerPageLogin } from '../../page/login/controller.jsx';
import { RenderPageLogin } from '../../page/login/render.jsx';
declare module 'zova-module-home-login' {
  export interface RenderPageLogin extends ControllerPageLogin {}
}
export const ZPageLogin = createZovaComponentPage(ControllerPageLogin, RenderPageLogin, undefined);
