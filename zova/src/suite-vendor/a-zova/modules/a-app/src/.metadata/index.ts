// eslint-disable
/** controller: begin */
export * from '../component/app/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-app' {
  
        export interface ControllerApp {
          /** @internal */
          get scope(): ScopeModuleAApp;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerApp } from '../component/app/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-app.controller.app': ControllerApp;
  }
}
/** controller: end */

/** components: begin */
export * from './component/app.js';
import { ZApp } from './component/app.js';
export const components = {
  'app': ZApp,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'a-app:app': ControllerApp;
}
export interface IZovaComponentRecord {
  'a-app:app': typeof ZApp;
}
}
/** components: end */
/** config: begin */
export * from '../config/config.js';
import { config } from '../config/config.js';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAApp extends BeanScopeBase {}

export interface ScopeModuleAApp {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-app': ScopeModuleAApp;
  }
  
  export interface IBeanScopeConfig {
    'a-app': ReturnType<typeof config>;
  }

  

  
}
  
/** scope: end */
