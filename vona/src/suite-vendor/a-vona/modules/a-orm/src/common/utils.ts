import type { Constructable } from 'vona';

import { appResource, beanFullNameFromOnionName } from 'vona';
import { prepareClassType } from 'vona-module-a-openapiutils';

import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { TypeModelColumn, TypeModelColumns } from '../types/modelWhere.ts';
import type { IDecoratorModelOptions, IModelClassRecord } from '../types/onion/model.ts';

export function isRaw(raw) {
  return typeof raw?.constructor === 'function' && raw?.constructor?.name === 'Raw';
}

export function isRef(ref) {
  return typeof ref?.constructor === 'function' && ref?.constructor?.name === 'Ref';
}

export function getTableOrTableAlias(table: string) {
  const _table = table.toString();
  return _table.includes(' as ') ? _table.split(' as ')[1].trim() : _table;
}

export function getTargetColumnName(column: string) {
  if (column.includes(' as ')) return column.split(' as ')[1].trim();
  if (column.includes('.')) return column.split('.')[1].trim();
  return column;
}

export function prepareColumns<TRecord>(
  columns?: TypeModelColumns<TRecord>,
): Array<TypeModelColumn<TRecord>> | undefined {
  if (!columns) return undefined;
  columns = Array.isArray(columns) ? columns : [columns];
  if (columns.includes('*')) return undefined;
  return columns;
}

export function prepareClassModel<ModelLike extends BeanModelMeta | keyof IModelClassRecord>(
  classType: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
): Constructable<ModelLike> {
  if (typeof classType === 'string') {
    const beanOptions = appResource.getBean(beanFullNameFromOnionName(classType, 'model'));
    return beanOptions!.beanClass as any;
  }
  return prepareClassType(classType) as any;
}

export function getClassEntityFromClassModel<T>(modelClass: Constructable<T>) {
  const beanOptions = appResource.getBean(modelClass);
  const options: IDecoratorModelOptions = beanOptions!.options!;
  return options.entity!;
}

// export function formatValue(value) {
//   if (typeof value !== 'object' || value instanceof Date) return value;
//   // date
//   if (value.type === 'Date') return moment(value.val).toDate();
//   // like
//   if (value.op === 'like') return `%${value.val}%`;
//   if (value.op === 'likeLeft') return `%${value.val}`;
//   if (value.op === 'likeRight') return `${value.val}%`;
//   if (value.op === 'likeStrict') return `${value.val}`;
//   // in
//   if (['in', 'notIn'].includes(value.op)) {
//     return formatValueArray(value);
//   }
//   // others
//   return value.val;
// }

// export function formatValueArray(value) {
//   if (!value.val) return null;
//   const arr = typeof value.val === 'string' ? value.val.split(',') : value.val;
//   if (arr.length === 0) return null;
//   return arr;
// }
