// eslint-disable
/** controller: begin */
export * from '../page/home/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-home-indexweb' {
  
        export interface ControllerPageHome {
          /** @internal */
          get scope(): ScopeModuleHomeIndexweb;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerPageHome } from '../page/home/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-indexweb.controller.pageHome': ControllerPageHome;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/home.js';
import { NSControllerPageHome } from './page/home.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/home/indexweb/home/:locale?': TypePagePathSchema<NSControllerPageHome.ParamsInput,undefined>;
}
export interface IPageNameRecord {
  'home-indexweb:home': TypePagePathSchema<NSControllerPageHome.ParamsInput,undefined>;
}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {
'home-indexweb:home': {
          params: NSControllerPageHome.paramsSchema,
          
        },
};
declare module 'zova-module-home-indexweb' {
  export interface ControllerPageHome {
        $params: NSControllerPageHome.ParamsOutput;
      }
}
/** pages: end */

/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleHomeIndexweb extends BeanScopeBase {}

export interface ScopeModuleHomeIndexweb {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-indexweb': ScopeModuleHomeIndexweb;
  }
  
  

  

  
}

/** scope: end */
