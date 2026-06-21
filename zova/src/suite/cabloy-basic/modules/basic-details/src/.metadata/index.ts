// eslint-disable
/** controller: begin */
export * from '../component/blockDetails/controller.jsx';
export * from '../component/blockDetailsToolbarBulk/controller.jsx';
export * from '../component/formFieldDetails/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-details' {
  
        export interface ControllerBlockDetails {
          /** @internal */
          get scope(): ScopeModuleBasicDetails;
        }

        export interface ControllerBlockDetailsToolbarBulk {
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
import { ControllerBlockDetails } from '../component/blockDetails/controller.jsx';
import { ControllerBlockDetailsToolbarBulk } from '../component/blockDetailsToolbarBulk/controller.jsx';
import { ControllerFormFieldDetails } from '../component/formFieldDetails/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-details.controller.blockDetails': ControllerBlockDetails;
'basic-details.controller.blockDetailsToolbarBulk': ControllerBlockDetailsToolbarBulk;
'basic-details.controller.formFieldDetails': ControllerFormFieldDetails;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockDetails.js';
import { ZBlockDetails } from './component/blockDetails.js';
export * from './component/blockDetailsToolbarBulk.js';
import { ZBlockDetailsToolbarBulk } from './component/blockDetailsToolbarBulk.js';
export * from './component/formFieldDetails.js';
import { ZFormFieldDetails } from './component/formFieldDetails.js';
export const components = {
  'blockDetails': ZBlockDetails,
'blockDetailsToolbarBulk': ZBlockDetailsToolbarBulk,
'formFieldDetails': ZFormFieldDetails,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-details:blockDetails': ControllerBlockDetails;
'basic-details:blockDetailsToolbarBulk': ControllerBlockDetailsToolbarBulk;
'basic-details:formFieldDetails': ControllerFormFieldDetails;
}
export interface IZovaComponentRecord {
  'basic-details:blockDetails': typeof ZBlockDetails;
'basic-details:blockDetailsToolbarBulk': typeof ZBlockDetailsToolbarBulk;
'basic-details:formFieldDetails': typeof ZFormFieldDetails;
}
}
/** components: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicDetails extends BeanScopeBase {}

export interface ScopeModuleBasicDetails {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-details': ScopeModuleBasicDetails;
  }
  
  

  

  
}
  
/** scope: end */
