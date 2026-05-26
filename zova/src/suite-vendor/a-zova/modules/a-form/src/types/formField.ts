import type { SchemaObject } from 'openapi3-ts/oas31';
import type { VNode } from 'vue';
import type z from 'zod';
import type { IBehaviorItem } from 'zova-module-a-behavior';
import type {
  IJsxRenderContextBase,
  IResourceFormFieldLayoutOptions,
  ISchemaRenderComponentPresetRecord,
  TypeFormFieldRenderComponent,
  TypeFormFieldRenderComponentProvider,
  TypeRenderComponentPreset,
} from 'zova-module-a-openapi';

import { DeepKeys } from '@tanstack/vue-form';
import { types } from 'typestyle';

import type { ControllerForm } from '../component/form/controller.jsx';
import type { ControllerFormField } from '../component/formField/controller.jsx';
import type { TypeBehaviorFormFieldOptions } from './form.js';

export type HTMLInputElementType =
  | 'text'
  | 'password'
  | 'number'
  | 'file'
  | 'hidden'
  | 'tel'
  | 'email';
export const constFieldProps = '$$FieldProps';

export interface IFormFieldScope<TParentData = {}> {
  name: string;
  value: any;
  property?: SchemaObject;
  render?: IFormFieldRenderContext<TParentData>;
}

export interface IFormFieldLayoutOptionsBase {
  layout?: IResourceFormFieldLayoutOptions;
}

export interface IFormFieldSysOptionsBase<TParentData = {}> {
  sys?: Omit<TypeBehaviorFormFieldOptions<TParentData>, 'name'>;
}

export interface IFormFieldValidatorsOptionsBase {
  onDynamic?: boolean | z.ZodType;
  onChange?: boolean | z.ZodType;
  onBlur?: boolean | z.ZodType;
}

export interface IFormFieldOptionsBase<
  TParentData = {},
  TName extends DeepKeys<TParentData> = DeepKeys<TParentData>,
> {
  name?: TName;
  render?: TypeRenderComponentPreset;
  class?: any;
  style?: types.NestedCSSProperties;
  value?: any;
  readonly?: boolean;
  required?: boolean;
  disableNotifyChanged?: boolean;
  validators?: IFormFieldValidatorsOptionsBase;
  // onChange?: (e: Event) => void; // allow set to null, but not provide null type
  // onInput?: (e: Event) => void; // allow set to null, but not provide null type
  // onBlur?: (e: Event) => void; // allow set to null, but not provide null type
}

export interface IFormFieldPresetOptions<
  PresetName extends keyof ISchemaRenderComponentPresetRecord = never,
> extends IFormFieldComponentOptions {
  render?: PresetName;
  options?: ISchemaRenderComponentPresetRecord[PresetName];
}

export interface IFormFieldComponentOptions<
  TParentData = {},
> extends IFormFieldOptions<TParentData> {
  options?: any;
}

export interface IFormFieldOptions<TParentData = {}>
  extends
    IFormFieldSysOptionsBase<TParentData>,
    IFormFieldOptionsBase<TParentData>,
    IFormFieldLayoutOptionsBase {
  behaviors?: IBehaviorItem;
  slotDefault?: (
    props: IFormFieldRenderContext<TParentData>,
    formField: ControllerFormField,
  ) => VNode;
}

export interface IFormFieldRenderContextProps {
  key?: string;
  name?: string;
  class?: any;
  readonly?: boolean;
}

// export interface IFormFieldRenderContextProps {
//   name?: string;
//   value?: any;
//   type?: any; // not use string for quasar
//   readonly?: boolean;
//   placeholder?: string;
//   class?: any;
//   onChange?: (e: Event) => void;
//   onInput?: (e: Event) => void;
//   onBlur?: (e: Event) => void;
// }

export interface IFormFieldRenderContextPropsBucket<TParentData = {}> extends Omit<
  IFormFieldOptions<TParentData>,
  'render'
> {
  options?: any;
  render: TypeFormFieldRenderComponent;
  renderProvider?: TypeFormFieldRenderComponentProvider;
  needHandleBorder?: boolean;
}

export interface IFormFieldRenderContext<TParentData = {}> {
  propsBucket: IFormFieldRenderContextPropsBucket<TParentData>;
  props: IFormFieldRenderContextProps;
  celScope: IFormFieldScope<TParentData>;
  jsxRenderContext: {};
}

export interface IJsxRenderContextFormField<
  TParentData extends {} = {},
  TSubmitMeta = never,
> extends IJsxRenderContextBase {
  $celScope: IFormFieldScope<TParentData>;
  $$formField: ControllerFormField<TParentData> | undefined;
  $$form: ControllerForm<TParentData, TSubmitMeta>;
}

export interface IJsxRenderContextForm<TParentData extends {} = {}> extends IJsxRenderContextBase {
  $celScope: IFormFieldScope<TParentData>;
  $$form: ControllerForm<TParentData>;
}
