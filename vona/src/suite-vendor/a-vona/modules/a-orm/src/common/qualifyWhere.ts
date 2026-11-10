import type { TypeModelWhere } from '../types/modelWhere.ts';

import { Op } from '../types/modelWhere.ts';
import { isRaw, isRef } from './utils.ts';

export function qualifyWhere(where: TypeModelWhere<any> | undefined, table: string) {
  if (!where || isRaw(where) || isRef(where)) return where;
  return Object.fromEntries(
    Object.entries(where).map(([key, value]) => {
      if ([Op.and, Op.or, Op.not].some(op => key.startsWith(op))) {
        return [key, qualifyWhere(value, table)];
      }
      return [key.startsWith('_') || key.includes('.') ? key : `${table}.${key}`, value];
    }),
  );
}
