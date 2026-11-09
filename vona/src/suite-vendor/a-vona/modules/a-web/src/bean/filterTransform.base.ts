import type { TypeQueryOperator, TypeQueryPredicate } from 'vona-module-a-orm';

import { BeanBase } from 'vona';

import type {
  IDecoratorFilterTransformOptions,
  IFilterTransformWhere,
  IPipeOptionsFilterTransformInfo,
} from '../types/filterTransform.ts';

import { FilterTransform } from '../lib/decorator/filterTransform.ts';

export interface IFilterTransformOptionsBase extends IDecoratorFilterTransformOptions {
  test: boolean;
}

const legacyOperators: Record<string, TypeQueryOperator> = {
  _eq_: 'eq',
  _notEq_: 'ne',
  _eqI_: 'eqI',
  _gt_: 'gt',
  _gte_: 'gte',
  _lt_: 'lt',
  _lte_: 'lte',
  _in_: 'in',
  _notIn_: 'notIn',
  _includes_: 'contains',
  _includesI_: 'containsI',
  _startsWith_: 'startsWith',
  _startsWithI_: 'startsWithI',
  _endsWith_: 'endsWith',
  _endsWithI_: 'endsWithI',
  _is_: 'isNull',
  _isNot_: 'isNotNull',
};

@FilterTransform<IFilterTransformOptionsBase>()
export class FilterTransformBase extends BeanBase implements IFilterTransformWhere {
  async where(
    info: IPipeOptionsFilterTransformInfo,
    _options: IFilterTransformOptionsBase,
  ): Promise<TypeQueryPredicate> {
    const { value, type, openapi, fullName } = info;
    const op =
      info.op ??
      (openapi?.filter?.op ? legacyOperators[openapi.filter.op] : undefined) ??
      (type === 'string' ? 'containsI' : 'eq');
    if (value === null)
      return { field: fullName, op: op === 'isNotNull' || op === 'ne' ? 'isNotNull' : 'isNull' };
    if (op === 'isNull' || op === 'isNotNull') return { field: fullName, op };
    return { field: fullName, op, value };
  }
}
