// eslint-disable
/** model: begin */
export * from '../model/resource.js';
import { IModelOptionsResource } from '../model/resource.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'rest-resource:resource': IModelOptionsResource;
    }


}
declare module 'zova-module-rest-resource' {

        export interface ModelResource {
          /** @internal */
          get scope(): ScopeModuleRestResource;
        }

        export interface ModelResource {
          get $beanFullName(): 'rest-resource.model.resource';
          get $onionName(): 'rest-resource:resource';
          get $onionOptions(): IModelOptionsResource;
        }
}
/** model: end */
/** model: begin */
import type { ModelResource } from '../model/resource.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'rest-resource.model.resource': ModelResource;
  }
}
/** model: end */
/** controller: begin */
export * from '../component/resourcePickerContext/controller.jsx';
export * from '../page/entry/controller.jsx';
export * from '../page/entryCreate/controller.jsx';
export * from '../page/resource/controller.jsx';
export * from '../page/resourcePicker/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-rest-resource' {

        export interface ControllerResourcePickerContext {
          /** @internal */
          get scope(): ScopeModuleRestResource;
        }

        export interface ControllerPageEntry {
          /** @internal */
          get scope(): ScopeModuleRestResource;
        }

        export interface ControllerPageResource {
          /** @internal */
          get scope(): ScopeModuleRestResource;
        }

        export interface ControllerPageResourcePicker {
          /** @internal */
          get scope(): ScopeModuleRestResource;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerResourcePickerContext } from '../component/resourcePickerContext/controller.jsx';
import type { ControllerPageEntry } from '../page/entry/controller.jsx';
import type { ControllerPageEntryCreate } from '../page/entryCreate/controller.jsx';
import type { ControllerPageResource } from '../page/resource/controller.jsx';
import type { ControllerPageResourcePicker } from '../page/resourcePicker/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'rest-resource.controller.resourcePickerContext': ControllerResourcePickerContext;
'rest-resource.controller.pageEntry': ControllerPageEntry;
'rest-resource.controller.pageEntryCreate': ControllerPageEntryCreate;
'rest-resource.controller.pageResource': ControllerPageResource;
'rest-resource.controller.pageResourcePicker': ControllerPageResourcePicker;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/entry.js';
import { NSControllerPageEntry } from './page/entry.js';
export * from './page/entryCreate.js';
import { NSControllerPageEntryCreate } from './page/entryCreate.js';
export * from './page/resource.js';
import { NSControllerPageResource } from './page/resource.js';
export * from './page/resourcePicker.js';
import { NSControllerPageResourcePicker } from './page/resourcePicker.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/rest/resource/:resource/:id/:formScene?': TypePagePathSchema<NSControllerPageEntry.ParamsInput,undefined>;
'/rest/resource/:resource/create': TypePagePathSchema<NSControllerPageEntryCreate.ParamsInput,undefined>;
'/rest/resource/:resource': TypePagePathSchema<NSControllerPageResource.ParamsInput,undefined>;
'/rest/resource/:resource/picker': TypePagePathSchema<NSControllerPageResourcePicker.ParamsInput,undefined>;
}
export interface IPageNameRecord {
  'rest-resource:entry': TypePagePathSchema<NSControllerPageEntry.ParamsInput,undefined>;
'rest-resource:entryCreate': TypePagePathSchema<NSControllerPageEntryCreate.ParamsInput,undefined>;
'rest-resource:resource': TypePagePathSchema<NSControllerPageResource.ParamsInput,undefined>;
'rest-resource:resourcePicker': TypePagePathSchema<NSControllerPageResourcePicker.ParamsInput,undefined>;
}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {
'rest-resource:entry': {
          params: NSControllerPageEntry.paramsSchema,

        },
'rest-resource:entryCreate': {
          params: NSControllerPageEntryCreate.paramsSchema,

        },
'rest-resource:resource': {
          params: NSControllerPageResource.paramsSchema,

        },
'rest-resource:resourcePicker': {
          params: NSControllerPageResourcePicker.paramsSchema,

        },
};
declare module 'zova-module-rest-resource' {
  export interface ControllerPageEntry {
        $params: NSControllerPageEntry.ParamsOutput;
      }
export interface ControllerPageEntryCreate {
        $params: NSControllerPageEntryCreate.ParamsOutput;
      }
export interface ControllerPageResource {
        $params: NSControllerPageResource.ParamsOutput;
      }
export interface ControllerPageResourcePicker {
        $params: NSControllerPageResourcePicker.ParamsOutput;
      }
}
/** pages: end */

/** components: begin */
export * from './component/resourcePickerContext.js';
import { ZResourcePickerContext } from './component/resourcePickerContext.js';
export const components = {
  'resourcePickerContext': ZResourcePickerContext,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'rest-resource:resourcePickerContext': ControllerResourcePickerContext;
}
export interface IZovaComponentRecord {
  'rest-resource:resourcePickerContext': typeof ZResourcePickerContext;
}
}
/** components: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleRestResource extends BeanScopeBase {}

export interface ScopeModuleRestResource {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'rest-resource': ScopeModuleRestResource;
  }






}

/** scope: end */
