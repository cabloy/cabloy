// eslint-disable
/** controller: begin */
export * from '../page/home/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-home-indexadmin' {
  
        export interface ControllerPageHome {
          /** @internal */
          get scope(): ScopeModuleHomeIndexadmin;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerPageHome } from '../page/home/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-indexadmin.controller.pageHome': ControllerPageHome;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/home.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/home/indexadmin': TypePagePathSchema<undefined,undefined>;
}
export interface IPageNameRecord {
  
}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {

};
declare module 'zova-module-home-indexadmin' {
  
}
/** pages: end */

/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleHomeIndexadmin extends BeanScopeBase {}

export interface ScopeModuleHomeIndexadmin {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-indexadmin': ScopeModuleHomeIndexadmin;
  }
  
  

  

  
}
  
/** scope: end */
