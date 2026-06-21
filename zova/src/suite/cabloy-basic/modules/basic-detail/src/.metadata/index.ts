// eslint-disable
/** controller: begin */
export * from '../component/blockDetails/controller.jsx';
export * from '../component/formFieldDetails/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-detail' {
  
        export interface ControllerBlockDetails {
          /** @internal */
          get scope(): ScopeModuleBasicDetail;
        }

        export interface ControllerFormFieldDetails {
          /** @internal */
          get scope(): ScopeModuleBasicDetail;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerBlockDetails } from '../component/blockDetails/controller.jsx';
import { ControllerFormFieldDetails } from '../component/formFieldDetails/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-detail.controller.blockDetails': ControllerBlockDetails;
'basic-detail.controller.formFieldDetails': ControllerFormFieldDetails;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockDetails.js';
import { ZBlockDetails } from './component/blockDetails.js';
export * from './component/formFieldDetails.js';
import { ZFormFieldDetails } from './component/formFieldDetails.js';
export const components = {
  'blockDetails': ZBlockDetails,
'formFieldDetails': ZFormFieldDetails,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-detail:blockDetails': ControllerBlockDetails;
'basic-detail:formFieldDetails': ControllerFormFieldDetails;
}
export interface IZovaComponentRecord {
  'basic-detail:blockDetails': typeof ZBlockDetails;
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
