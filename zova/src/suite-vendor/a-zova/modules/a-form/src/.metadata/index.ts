// eslint-disable
/** controller: begin */
export * from '../component/form/controller.tsx';
export * from '../component/formField/controller.tsx';
export * from '../component/formFieldBlank/controller.tsx';
export * from '../component/formFieldPreset/controller.tsx';

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
import type { ControllerForm } from '../component/form/controller.tsx';
import type { ControllerFormField } from '../component/formField/controller.tsx';
import type { ControllerFormFieldBlank } from '../component/formFieldBlank/controller.tsx';
import type { ControllerFormFieldPreset } from '../component/formFieldPreset/controller.tsx';
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
export * from './component/form.ts';
import { ZForm } from './component/form.ts';
export * from './component/formField.ts';
import { ZFormField } from './component/formField.ts';
export * from './component/formFieldBlank.ts';
import { ZFormFieldBlank } from './component/formFieldBlank.ts';
export * from './component/formFieldPreset.ts';
import { ZFormFieldPreset } from './component/formFieldPreset.ts';
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
export * from '../component/form/render.tsx';
export * from '../component/formField/render.tsx';

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
import type { RenderForm } from '../component/form/render.tsx';
import type { RenderFormField } from '../component/formField/render.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-form.render.form': RenderForm;
'a-form.render.formField': RenderFormField;
  }
}
/** render: end */
/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
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
