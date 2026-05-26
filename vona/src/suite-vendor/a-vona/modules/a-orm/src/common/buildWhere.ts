import type { Knex } from 'knex';

import { isNil } from '@cabloy/utils';
import { cast } from 'vona';

import type { ServiceDb } from '../service/db_.ts';
import type {
  TypeModelColumnValue,
  TypeModelWhere,
  TypeModelWhereFieldAll,
  TypeOpsJoint,
  TypeOpsNormal,
} from '../types/modelWhere.ts';

import { Op, OpAggrs, OpJointValues, OpNormalValues } from '../types/modelWhere.ts';
import { isRaw, isRef } from './utils.ts';

export function buildWhere<TRecord>(
  db: ServiceDb,
  builder: Knex.QueryBuilder,
  wheres: TypeModelWhere<TRecord>,
  having: boolean = false,
) {
  _buildWhereInner(having, db, builder, wheres);
}

function _buildWhereInner<TRecord>(
  having: boolean,
  db: ServiceDb,
  builder: Knex.QueryBuilder,
  wheres: TypeModelWhere<TRecord>,
  column?: keyof TRecord,
) {
  // skip
  if (wheres === Op.skip) {
    return;
  }
  // raw
  if (isRaw(wheres)) {
    builder[having ? 'havingRaw' : 'whereRaw'](wheres as Knex.Raw);
    return;
  }
  // loop
  for (const key in wheres) {
    const value = wheres[key];
    if (key[0] !== '_') {
      // columns
      _buildWhereColumn(having, db, builder, key, value);
    } else if (OpNormalValues.includes(key as any)) {
      // op: normal
      if (column) {
        _buildWhereColumn(having, db, builder, column, value, key as any);
      } else {
        // not go here
      }
    } else {
      const op = _checkOpJoint(key as any);
      if (op) {
        // op: joint
        _buildWhereOpJoint(having, db, builder, column, value, op);
      } else {
        // ignored, not throw error
      }
    }
  }
}

function _buildWhereOpJoint<TRecord>(
  having: boolean,
  db: ServiceDb,
  builder: Knex.QueryBuilder,
  column: keyof TRecord | undefined,
  wheres: TypeModelWhere<TRecord>,
  op: TypeOpsJoint,
) {
  // skip
  if (wheres === Op.skip) {
    return;
  }
  // and/or
  if (op === Op.and) {
    builder[having ? 'having' : 'where'](builder => {
      for (const key in wheres) {
        builder.andWhere(builder => {
          _buildWhereInner(false, db, builder, { [key]: wheres[key] } as any, column);
        });
      }
    });
    return;
  }
  // or
  if (op === Op.or) {
    builder[having ? 'having' : 'where'](builder => {
      for (const key in wheres) {
        builder.orWhere(builder => {
          _buildWhereInner(false, db, builder, { [key]: wheres[key] } as any, column);
        });
      }
    });
    return;
  }
  // not
  if (op === Op.not) {
    builder[having ? 'havingNot' : 'whereNot'](builder => {
      _buildWhereInner(false, db, builder, wheres, column);
    });
    return;
  }
  // exists
  if (op === Op.exists) {
    builder[having ? 'havingExists' : 'whereExists'](wheres as any);
    return;
  }
  // notexists
  if (op === Op.notExists) {
    builder[having ? 'havingNotExists' : 'whereNotExists'](wheres as any);
  }
}

function _buildWhereColumn<TRecord>(
  having: boolean,
  db: ServiceDb,
  builder: Knex.QueryBuilder,
  column: keyof TRecord,
  value:
    | TypeModelColumnValue<TRecord, TRecord[keyof TRecord]>
    | TypeModelWhereFieldAll<TRecord, TRecord[keyof TRecord]>,
  op?: TypeOpsNormal,
) {
  // skip
  if (value === Op.skip) {
    return;
  }
  // raw
  if (isRaw(value) || isRef(value)) {
    _buildWhereColumnOpNormal(having, db, builder, column, value, op ?? Op.eq);
    return;
  }
  // null/undefined
  if (isNil(value)) {
    _buildWhereColumnOpNormal(having, db, builder, column, value, op ?? Op.is);
    return;
  }
  // array
  if (Array.isArray(value)) {
    _buildWhereColumnOpNormal(having, db, builder, column, value, op ?? Op.in);
    return;
  }
  // date
  if (value instanceof Date) {
    _buildWhereColumnOpNormal(having, db, builder, column, value, op ?? Op.eq);
    return;
  }
  // object
  if (typeof value === 'object') {
    builder[having ? 'having' : 'where'](builder => {
      _buildWhereInner(false, db, builder, value as any, column);
    });
    return;
  }
  // column
  _buildWhereColumnOpNormal(having, db, builder, column, value, op ?? Op.eq);
}

function _buildWhereColumnOpNormal<TRecord>(
  having: boolean,
  db: ServiceDb,
  builder: Knex.QueryBuilder,
  column: keyof TRecord | string,
  value: any,
  op: TypeOpsNormal,
) {
  column = _checkHavingColumn(db, column) as string;
  if (op === Op.eq) {
    builder[having ? 'having' : 'where'](column, '=', value);
  } else if (op === Op.notEq) {
    builder[having ? 'having' : 'where'](column, '<>', value);
  } else if (op === Op.eqI) {
    builder[_getOpILikeReal(having, db)](column, value);
  } else if (op === Op.notEqI) {
    builder[having ? 'havingNot' : 'whereNot']((builder: Knex.QueryBuilder) => {
      builder[_getOpILikeReal(having, db)](column, value);
    });
  } else if (op === Op.gt) {
    builder[having ? 'having' : 'where'](column, '>', value);
  } else if (op === Op.gte) {
    builder[having ? 'having' : 'where'](column, '>=', value);
  } else if (op === Op.lt) {
    builder[having ? 'having' : 'where'](column, '<', value);
  } else if (op === Op.lte) {
    builder[having ? 'having' : 'where'](column, '<=', value);
  } else if (op === Op.in) {
    builder[having ? 'havingIn' : 'whereIn'](column, value);
  } else if (op === Op.notIn) {
    builder[having ? 'havingNotIn' : 'whereNotIn'](column, value);
  } else if (op === Op.is) {
    builder[having ? 'havingNull' : 'whereNull'](column);
  } else if (op === Op.isNot) {
    builder[having ? 'havingNotNull' : 'whereNotNull'](column);
  } else if (op === Op.between) {
    builder[having ? 'havingBetween' : 'whereBetween'](column, value);
  } else if (op === Op.notBetween) {
    builder[having ? 'havingNotBetween' : 'whereNotBetween'](column, value);
  } else if (op === Op.startsWith) {
    builder[_getOpLikeReal(having, db)](column, `${value}%` as any);
  } else if (op === Op.endsWith) {
    builder[_getOpLikeReal(having, db)](column, `%${value}` as any);
  } else if (op === Op.includes) {
    builder[_getOpLikeReal(having, db)](column, `%${value}%` as any);
  } else if (op === Op.startsWithI) {
    builder[_getOpILikeReal(having, db)](column, `${value}%` as any);
  } else if (op === Op.endsWithI) {
    builder[_getOpILikeReal(having, db)](column, `%${value}` as any);
  } else if (op === Op.includesI) {
    builder[_getOpILikeReal(having, db)](column, `%${value}%` as any);
  } else if (op === Op.ref) {
    builder[having ? 'having' : 'where'](column, '=', db.connection.ref(value));
  }
}

function _getOpLikeReal(having: boolean, db: ServiceDb) {
  return db.dialect.capabilities.like
    ? having
      ? 'havingLike'
      : 'whereLike'
    : having
      ? 'havingILike'
      : 'whereILike';
}

function _getOpILikeReal(having: boolean, db: ServiceDb) {
  return db.dialect.capabilities.ilike
    ? having
      ? 'havingILike'
      : 'whereILike'
    : having
      ? 'havingLike'
      : 'whereLike';
}

function _checkHavingColumn<TRecord>(db: ServiceDb, column: keyof TRecord | string) {
  let [aggr, name] = cast<string>(column).split('_');
  if (!OpAggrs.includes(aggr) || !name) return column;
  if (aggr === 'count' && name === 'all') name = '*';
  return db.connection.raw(`${_safeOp(aggr)}(${_safeColumn(name)})`);
}

function _checkOpJoint(op: TypeOpsJoint) {
  for (const item of OpJointValues) {
    if (op.startsWith(item)) {
      return item;
    }
  }
  return undefined;
}

function _safeOp(op) {
  return op.replace(/[\\.*#%'"`;,() ]/g, '');
}

function _safeColumn(column) {
  return column.replace(/[\\.#%'"`;,() ]/g, '');
}
