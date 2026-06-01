// eslint-disable
/** controller: begin */
export * from '../component/layoutWeb/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-home-layoutweb' {
  
        export interface ControllerLayoutWeb {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutweb;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerLayoutWeb } from '../component/layoutWeb/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutweb.controller.layoutWeb': ControllerLayoutWeb;
  }
}
/** controller: end */

/** components: begin */
export * from './component/layoutWeb.js';
import { ZLayoutWeb } from './component/layoutWeb.js';
export const components = {
  'layoutWeb': ZLayoutWeb,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'home-layoutweb:layoutWeb': ControllerLayoutWeb;
}
export interface IZovaComponentRecord {
  'home-layoutweb:layoutWeb': typeof ZLayoutWeb;
}
}
/** components: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleHomeLayoutweb extends BeanScopeBase {}

export interface ScopeModuleHomeLayoutweb {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-layoutweb': ScopeModuleHomeLayoutweb;
  }
  
  

  

  
}
  
/** scope: end */
