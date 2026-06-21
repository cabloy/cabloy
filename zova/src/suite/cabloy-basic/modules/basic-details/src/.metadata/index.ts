// eslint-disable
/** controller: begin */
export * from '../component/actionCreate/controller.jsx';
export * from '../component/blockDetails/controller.jsx';
export * from '../component/blockToolbarBulk/controller.jsx';
export * from '../component/formFieldDetails/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-details' {
  
        export interface ControllerActionCreate {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface ControllerBlockDetails {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface ControllerBlockToolbarBulk {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface ControllerFormFieldDetails {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerActionCreate } from '../component/actionCreate/controller.jsx';
import { ControllerBlockDetails } from '../component/blockDetails/controller.jsx';
import { ControllerBlockToolbarBulk } from '../component/blockToolbarBulk/controller.jsx';
import { ControllerFormFieldDetails } from '../component/formFieldDetails/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-details.controller.actionCreate': ControllerActionCreate;
'basic-details.controller.blockDetails': ControllerBlockDetails;
'basic-details.controller.blockToolbarBulk': ControllerBlockToolbarBulk;
'basic-details.controller.formFieldDetails': ControllerFormFieldDetails;
  }
}
/** controller: end */

/** components: begin */
export * from './component/actionCreate.js';
import { ZActionCreate } from './component/actionCreate.js';
export * from './component/blockDetails.js';
import { ZBlockDetails } from './component/blockDetails.js';
export * from './component/blockToolbarBulk.js';
import { ZBlockToolbarBulk } from './component/blockToolbarBulk.js';
export * from './component/formFieldDetails.js';
import { ZFormFieldDetails } from './component/formFieldDetails.js';
export const components = {
  'actionCreate': ZActionCreate,
'blockDetails': ZBlockDetails,
'blockToolbarBulk': ZBlockToolbarBulk,
'formFieldDetails': ZFormFieldDetails,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-details:actionCreate': ControllerActionCreate;
'basic-details:blockDetails': ControllerBlockDetails;
'basic-details:blockToolbarBulk': ControllerBlockToolbarBulk;
'basic-details:formFieldDetails': ControllerFormFieldDetails;
}
export interface IZovaComponentRecord {
  'basic-details:actionCreate': typeof ZActionCreate;
'basic-details:blockDetails': typeof ZBlockDetails;
'basic-details:blockToolbarBulk': typeof ZBlockToolbarBulk;
'basic-details:formFieldDetails': typeof ZFormFieldDetails;
}
}
/** components: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicDetails extends BeanScopeBase {}

export interface ScopeModuleBasicDetails {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-details': ScopeModuleBasicDetails;
  }
  
  

  export interface IBeanScopeLocale {
    'basic-details': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `basic-details::${K}` {
  return `basic-details::${key}`;
}  
/** scope: end */
