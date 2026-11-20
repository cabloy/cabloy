import type { TypeModelWhere } from '../types/modelWhere.ts';

import { Op } from '../types/modelWhere.ts';
import { isRaw, isRef } from './utils.ts';

export function qualifyWhere(
  where: TypeModelWhere<any> | undefined,
  table: string,
): TypeModelWhere<any> | undefined {
  if (!where || isRaw(where) || isRef(where)) return where;
  // Each array entry is one Boolean operand, including multi-field AND branches.
  if (Array.isArray(where)) {
    return Object.fromEntries(
      where.map((child, index) => [`${Op.and}${index}`, qualifyWhere(child, table)]),
    );
  }
  return Object.fromEntries(
    Object.entries(where).map(([key, value]) => {
      if ([Op.and, Op.or, Op.not].some(op => key.startsWith(op))) {
        return [key, qualifyWhere(value, table)];
      }
      return [key.startsWith('_') || key.includes('.') ? key : `${table}.${key}`, value];
    }),
  );
}
