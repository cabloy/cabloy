// eslint-disable
/** controller: begin */
export * from '../component/formFieldDetails/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-detail' {
  
        export interface ControllerFormFieldDetails {
          /** @internal */
          get scope(): ScopeModuleBasicDetail;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldDetails } from '../component/formFieldDetails/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-detail.controller.formFieldDetails': ControllerFormFieldDetails;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldDetails.js';
import { ZFormFieldDetails } from './component/formFieldDetails.js';
export const components = {
  'formFieldDetails': ZFormFieldDetails,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-detail:formFieldDetails': ControllerFormFieldDetails;
}
export interface IZovaComponentRecord {
  'basic-detail:formFieldDetails': typeof ZFormFieldDetails;
}
}
/** components: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicDetail extends BeanScopeBase {}

export interface ScopeModuleBasicDetail {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-detail': ScopeModuleBasicDetail;
  }
  
  

  

  
}
  
/** scope: end */
