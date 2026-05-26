// eslint-disable
/** controller: begin */
export * from '../component/form/controller.jsx';
export * from '../component/formField/controller.jsx';
export * from '../component/formFieldBlank/controller.jsx';
export * from '../component/formFieldPreset/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-form' {
  
        export interface ControllerForm {
          /** @internal */
          get scope(): ScopeModuleAForm;
        }

        export interface ControllerFormField {
          /** @internal */
          get scope(): ScopeModuleAForm;
        }

        export interface ControllerFormFieldBlank {
          /** @internal */
          get scope(): ScopeModuleAForm;
        }

        export interface ControllerFormFieldPreset {
          /** @internal */
          get scope(): ScopeModuleAForm;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerForm } from '../component/form/controller.jsx';
import { ControllerFormField } from '../component/formField/controller.jsx';
import { ControllerFormFieldBlank } from '../component/formFieldBlank/controller.jsx';
import { ControllerFormFieldPreset } from '../component/formFieldPreset/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-form.controller.form': ControllerForm;
'a-form.controller.formField': ControllerFormField;
'a-form.controller.formFieldBlank': ControllerFormFieldBlank;
'a-form.controller.formFieldPreset': ControllerFormFieldPreset;
  }
}
/** controller: end */

/** components: begin */
export * from './component/form.js';
import { ZForm } from './component/form.js';
export * from './component/formField.js';
import { ZFormField } from './component/formField.js';
export * from './component/formFieldBlank.js';
import { ZFormFieldBlank } from './component/formFieldBlank.js';
export * from './component/formFieldPreset.js';
import { ZFormFieldPreset } from './component/formFieldPreset.js';
export const components = {
  'form': ZForm,
'formField': ZFormField,
'formFieldBlank': ZFormFieldBlank,
'formFieldPreset': ZFormFieldPreset,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'a-form:form': ControllerForm;
'a-form:formField': ControllerFormField;
'a-form:formFieldBlank': ControllerFormFieldBlank;
'a-form:formFieldPreset': ControllerFormFieldPreset;
}
export interface IZovaComponentRecord {
  'a-form:form': typeof ZForm;
'a-form:formField': typeof ZFormField;
'a-form:formFieldBlank': typeof ZFormFieldBlank;
'a-form:formFieldPreset': typeof ZFormFieldPreset;
}
}
/** components: end */
/** render: begin */
export * from '../component/form/render.jsx';
export * from '../component/formField/render.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-form' {
  
        export interface RenderForm {
          /** @internal */
          get scope(): ScopeModuleAForm;
        }

        export interface RenderFormField {
          /** @internal */
          get scope(): ScopeModuleAForm;
        } 
}
/** render: end */
/** render: begin */
import { RenderForm } from '../component/form/render.jsx';
import { RenderFormField } from '../component/formField/render.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-form.render.form': RenderForm;
'a-form.render.formField': RenderFormField;
  }
}
/** render: end */
/** config: begin */
export * from '../config/config.js';
import { config } from '../config/config.js';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAForm extends BeanScopeBase {}

export interface ScopeModuleAForm {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-form': ScopeModuleAForm;
  }
  
  export interface IBeanScopeConfig {
    'a-form': ReturnType<typeof config>;
  }

  

  
}
  
/** scope: end */
