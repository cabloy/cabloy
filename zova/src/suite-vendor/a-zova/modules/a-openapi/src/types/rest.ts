import type { ComponentPublicInstance } from 'vue';
import type { Constructable, IComponentRecord, TypeBeanRecordGeneralSelector } from 'zova';
import type { TypeRenderComponentJsx } from 'zova-jsx';

import 'openapi3-ts/oas30';
import 'openapi3-ts/oas31';
import { SchemaObject } from 'openapi3-ts/oas31';

import type { IQueryOrder, TypeQueryOperator } from './table.ts';

import { IResourceDetailsActionRowRecord } from './detail/detailsActionRow.ts';
import { IResourceRenderBlockOptionsBlock } from './resource/block.ts';
import { IResourceFormFieldRecord } from './resource/formField.ts';
import { IResourceTableActionRowRecord } from './resource/tableActionRow.ts';

export type TypeFormFieldOnEffect = (value: any) => void;

export interface ISchemaRenderComponentPresetRecord extends IResourceFormFieldRecord {}

export type TypeTableColumnAlign = 'left' | 'center' | 'right';
export type TypeTableColumnFixed = 'left' | 'right';

export interface ITableColumnOptions {
  order?: number;
  align?: TypeTableColumnAlign;
  width?: number;
  fixed?: TypeTableColumnFixed;
  enableSorting?: boolean;
  sortDescFirst?: boolean;
}

export interface ISchemaObjectExtensionFieldRest extends ITableColumnOptions {
  'blocks'?: IResourceRenderBlockOptionsBlock[];
  'schemaScene'?: TypeSchemaScene;
  //
  'fieldSource'?: string;
  'visible'?: boolean;
  'disableNotifyChanged'?: boolean;
  'readonly'?: boolean;
  'draft'?: boolean;
  'onEffect'?: TypeFormFieldOnEffect;
  //
  'render'?: TypeFormFieldRenderComponentNormal | TypeTableCellRenderComponentNormal;
  'table'?: Omit<ISchemaObjectExtensionFieldRest, TypeSchemaScene>;
  'form'?: Omit<ISchemaObjectExtensionFieldRest, TypeSchemaScene>;
  'form-view'?: Omit<ISchemaObjectExtensionFieldRest, TypeSchemaScene>;
  'form-create'?: Omit<ISchemaObjectExtensionFieldRest, TypeSchemaScene>;
  'filter'?: Omit<ISchemaObjectExtensionFieldRest, TypeSchemaScene>;
}

export interface IQueryFieldCapabilities {
  operators: readonly TypeQueryOperator[];
  type: 'string' | 'number' | 'boolean' | 'identity' | 'timestamp' | 'date' | 'decimal' | 'enum';
  nullable: boolean;
}

export interface IQueryCapabilities {
  fields: Record<string, IQueryFieldCapabilities>;
  orderable: readonly string[];
  projection: { mode: 'fixed' };
  pagination?: boolean;
  limits: {
    maxBytes: number;
    maxNodes: number;
    maxValueDepth: number;
    maxPredicateDepth: number;
    maxListItems: number;
    maxOrders: number;
    maxStringLength: number;
    maxPageSize: number;
  };
  defaults: { orders: readonly IQueryOrder[]; pageNo: number; pageSize: number };
  conveniences?: Record<string, { field: string; op?: TypeQueryOperator }>;
}

export interface ISchemaObjectExtensionFieldFilterCapabilities {
  query?: IQueryCapabilities;
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
  /** Original property name before fieldSource normalization. */
  schemaKey?: string;
  /** Additional schema aliases that resolve to this canonical key. */
  schemaKeys?: string[];
  rest?: ISchemaObjectExtensionFieldRest;
  filter?: ISchemaObjectExtensionFieldFilter;
}

export type TypeSchemaScene = 'table' | TypeFormSchemaScene;
export type TypeFormSchemaScene = 'form' | 'form-view' | 'form-create' | 'filter';

export const renderFormFieldTopPropsSystem = [
  'draft',
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
  | keyof IResourceDetailsActionRowRecord
  | TypeRenderComponentJsx;
export type TypeTableCellRenderComponentProvider = TypeRenderComponentJsx | 'text' | string;
export type TypeTableBulkRenderComponentProvider =
  | Constructable<ComponentPublicInstance>
  | keyof IComponentRecord
  | TypeRenderComponentJsx;
