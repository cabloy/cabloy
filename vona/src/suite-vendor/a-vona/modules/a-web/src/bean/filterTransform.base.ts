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

@FilterTransform<IFilterTransformOptionsBase>()
export class FilterTransformBase extends BeanBase implements IFilterTransformWhere {
  async where(
    info: IPipeOptionsFilterTransformInfo,
    _options: IFilterTransformOptionsBase,
  ): Promise<any | undefined> {
    const { value, type, openapi } = info;
    let op = openapi?.filter?.op;
    if (!op) {
      if (type === 'string') {
        op = '_includesI_';
      } else {
        op = '_eq_';
      }
    }
    let where;
    if (op === '_eq_') {
      where = value;
    } else {
      where = { [op]: value };
    }
    return where;
  }
}
