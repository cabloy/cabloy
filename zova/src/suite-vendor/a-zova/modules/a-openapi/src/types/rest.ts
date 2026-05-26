import type { ComponentPublicInstance } from 'vue';
import type { Constructable, IComponentRecord, TypeBeanRecordGeneralSelector } from 'zova';
import type { TypeRenderComponentJsx } from 'zova-jsx';

import 'openapi3-ts/oas30';
import 'openapi3-ts/oas31';
import { SchemaObject } from 'openapi3-ts/oas31';

import { IResourceRenderBlockOptionsBlock } from './resource/block.js';
import { IResourceFormFieldRecord } from './resource/formField.js';
import { IResourceTableActionRowRecord } from './resource/tableActionRow.js';

export interface ISchemaRenderComponentPresetRecord extends IResourceFormFieldRecord {}

export interface ISchemaObjectExtensionFieldRest {
  'blocks'?: IResourceRenderBlockOptionsBlock[];
  //
  'fieldSource'?: string;
  'visible'?: boolean;
  'order'?: number;
  'disableNotifyChanged'?: boolean;
  'readonly'?: boolean;
  //
  'render'?: TypeFormFieldRenderComponentNormal | TypeTableCellRenderComponentNormal;
  'table'?: Omit<ISchemaObjectExtensionFieldRest, TypeSchemaScene>;
  'form'?: Omit<ISchemaObjectExtensionFieldRest, TypeSchemaScene>;
  'form-view'?: Omit<ISchemaObjectExtensionFieldRest, TypeSchemaScene>;
  'form-create'?: Omit<ISchemaObjectExtensionFieldRest, TypeSchemaScene>;
  'filter'?: Omit<ISchemaObjectExtensionFieldRest, TypeSchemaScene>;
}

export interface ISchemaObjectExtensionFieldFilterCapabilities {
  where?: boolean;
  // filter?: boolean;
  order?: boolean;
  // group?: boolean;
}

export interface ISchemaObjectExtensionFieldFilter {
  capabilities?: ISchemaObjectExtensionFieldFilterCapabilities;
}

export interface ISchemaObjectExtensionField extends SchemaObject {
  key?: string;
  rest?: ISchemaObjectExtensionFieldRest;
  filter?: ISchemaObjectExtensionFieldFilter;
}

export type TypeSchemaScene = 'table' | TypeFormSchemaScene;
export type TypeFormSchemaScene = 'form' | 'form-view' | 'form-create' | 'filter';

export const renderFormFieldTopPropsSystem = [
  'order',
  'table',
  'form',
  'form-view',
  'form-create',
  'filter',
];
export const renderTableColumnTopPropsSystem = [
  'order',
  'table',
  'form',
  'form-view',
  'form-create',
  'filter',
];

export type TypeRenderComponentPreset = keyof ISchemaRenderComponentPresetRecord;
// | 'text'
// | 'captcha'
// | 'currency'
// | 'date'
// | 'dateRange'
// | 'toggle'
// | 'select'
// | 'textarea'
// | 'resourcePicker';
// | 'checkbox';
// | 'radio'
// | 'switch';
// | 'image'
// | 'file'
// | 'color'
// | 'password'
// | 'email'
// | 'url';

// form
export type TypeFormFieldRenderComponentNormal =
  | Constructable<ComponentPublicInstance>
  | keyof IComponentRecord
  | TypeRenderComponentPreset;
export type TypeFormFieldRenderComponent =
  | TypeFormFieldRenderComponentNormal
  | TypeRenderComponentJsx;
// should use input for config.ts of a-openapi
export type TypeFormFieldRenderComponentProvider =
  | Constructable
  | Constructable<ComponentPublicInstance>
  | keyof IComponentRecord
  | 'input';
// | 'input'
// | 'textarea'
// | 'select';

// table
export type TypeTableCellRenderComponentNormal =
  | Constructable<ComponentPublicInstance>
  | keyof IComponentRecord
  | keyof TypeBeanRecordGeneralSelector<'tableCell'>
  | TypeRenderComponentPreset;
export type TypeTableCellRenderComponent =
  | keyof IResourceTableActionRowRecord
  | TypeRenderComponentJsx;
export type TypeTableCellRenderComponentProvider = TypeRenderComponentJsx | 'text' | string;
export type TypeTableBulkRenderComponentProvider =
  | Constructable<ComponentPublicInstance>
  | keyof IComponentRecord
  | TypeRenderComponentJsx;
