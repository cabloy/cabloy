// eslint-disable
/** controller: begin */
export * from '../component/formFieldInput/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-input' {
  
        export interface ControllerFormFieldInput {
          /** @internal */
          get scope(): ScopeModuleBasicInput;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerFormFieldInput } from '../component/formFieldInput/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-input.controller.formFieldInput': ControllerFormFieldInput;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldInput.js';
import { ZFormFieldInput } from './component/formFieldInput.js';
export const components = {
  'formFieldInput': ZFormFieldInput,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-input:formFieldInput': ControllerFormFieldInput;
}
export interface IZovaComponentRecord {
  'basic-input:formFieldInput': typeof ZFormFieldInput;
}
}
/** components: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicInput extends BeanScopeBase {}

export interface ScopeModuleBasicInput {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-input': ScopeModuleBasicInput;
  }
  
  

  

  
}
  
/** scope: end */
