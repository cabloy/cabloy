// eslint-disable
/** model: begin */
export * from '../model/tabs.js';
import { IModelOptionsTabs } from '../model/tabs.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'a-routertabs:tabs': IModelOptionsTabs;
    }

  
}
declare module 'zova-module-a-routertabs' {
  
        export interface ModelTabs {
          /** @internal */
          get scope(): ScopeModuleARoutertabs;
        }

        export interface ModelTabs {
          get $beanFullName(): 'a-routertabs.model.tabs';
          get $onionName(): 'a-routertabs:tabs';
          get $onionOptions(): IModelOptionsTabs;
        } 
}
/** model: end */
/** model: begin */
import { ModelTabs } from '../model/tabs.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-routertabs.model.tabs': ModelTabs;
  }
}
/** model: end */
/** controller: begin */
export * from '../component/routerViewTabs/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-routertabs' {
  
        export interface ControllerRouterViewTabs {
          /** @internal */
          get scope(): ScopeModuleARoutertabs;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerRouterViewTabs } from '../component/routerViewTabs/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-routertabs.controller.routerViewTabs': ControllerRouterViewTabs;
  }
}
/** controller: end */

/** components: begin */
export * from './component/routerViewTabs.js';
import { ZRouterViewTabs } from './component/routerViewTabs.js';
export const components = {
  'routerViewTabs': ZRouterViewTabs,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'a-routertabs:routerViewTabs': ControllerRouterViewTabs;
}
export interface IZovaComponentRecord {
  'a-routertabs:routerViewTabs': typeof ZRouterViewTabs;
}
}
/** components: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleARoutertabs extends BeanScopeBase {}

export interface ScopeModuleARoutertabs {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-routertabs': ScopeModuleARoutertabs;
  }
  
  

  

  
}
  
/** scope: end */
