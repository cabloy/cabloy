import type { TypeQueryPredicate } from 'vona-module-a-orm';

import { DateTime } from 'luxon';
import { BeanBase } from 'vona';
import { PublicQueryError } from 'vona-module-a-orm';

import type {
  IDecoratorFilterTransformOptions,
  IFilterTransformWhere,
  IPipeOptionsFilterTransformInfo,
} from '../types/filterTransform.ts';

import { FilterTransform } from '../lib/decorator/filterTransform.ts';

export interface IFilterTransformOptionsDateRange extends IDecoratorFilterTransformOptions {
  separator: string;
}

@FilterTransform<IFilterTransformOptionsDateRange>({
  separator: '~',
})
export class FilterTransformDateRange extends BeanBase implements IFilterTransformWhere {
  async where(
    info: IPipeOptionsFilterTransformInfo,
    options: IFilterTransformOptionsDateRange,
  ): Promise<TypeQueryPredicate | undefined> {
    const { value, fullName, type } = info;
    if (value === null) return { field: fullName, op: 'isNull' };
    if (typeof value !== 'string') throw new PublicQueryError('query_date_range', info.key);
    const parts = value.split(options.separator);
    if (parts.length > 2) throw new PublicQueryError('query_date_range', info.key);
    const [dateStartStr, dateEndStr] = parts;
    if (!dateStartStr && !dateEndStr) return;
    const predicates: TypeQueryPredicate[] = [];
    const encode = (date: DateTime) =>
      type === 'date' ? date.toISODate()! : date.toUTC().toISO()!;
    if (dateStartStr) {
      predicates.push({ field: fullName, op: 'gte', value: encode(this._parseDate(dateStartStr)) });
    }
    if (dateEndStr) {
      predicates.push({
        field: fullName,
        op: 'lt',
        value: encode(this._parseDate(dateEndStr).plus({ day: 1 })),
      });
    }
    return predicates.length === 1 ? predicates[0] : { and: predicates };
  }

  private _parseDate(str: string) {
    let date = DateTime.fromISO(str, { zone: this.ctx.tz });
    if (!date.isValid) {
      for (const format of [
        'yyyy/MM/dd',
        'yyyy/MM/d',
        'yyyy/M/dd',
        'yyyy/M/d',
        'MM/dd/yyyy',
        'MM/d/yyyy',
        'M/dd/yyyy',
        'M/d/yyyy',
      ]) {
        date = DateTime.fromFormat(str, format, {
          zone: this.ctx.tz,
        });
        if (date.isValid) break;
      }
    }
    if (!date.isValid) throw new PublicQueryError('query_date_range');
    return date;
  }
}
