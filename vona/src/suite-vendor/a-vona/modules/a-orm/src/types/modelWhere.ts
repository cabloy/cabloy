import type { TypeRecordValues } from 'vona';

export const OpAggrs = ['count', 'sum', 'avg', 'max', 'min'];

export const OpJoint = {
  and: '_and_',
  or: '_or_',
  not: '_not_',
  exists: '_exists_',
  notExists: '_notExists_',
} as const;
export const OpNormal = {
  eq: '_eq_',
  notEq: '_notEq_',
  eqI: '_eqI_',
  notEqI: '_notEqI_',
  gt: '_gt_',
  gte: '_gte_',
  lt: '_lt_',
  lte: '_lte_',
  in: '_in_',
  notIn: '_notIn_',
  is: '_is_',
  isNot: '_isNot_',
  between: '_between_',
  notBetween: '_notBetween_',
  startsWith: '_startsWith_',
  endsWith: '_endsWith_',
  includes: '_includes_',
  startsWithI: '_startsWithI_',
  endsWithI: '_endsWithI_',
  includesI: '_includesI_',
  ref: '_ref_',
} as const;
export const Op = {
  skip: '_skip_',
  ...OpJoint,
  ...OpNormal,
} as const;
export const OpJointValues = Object.values(OpJoint);
export const OpNormalValues = Object.values(OpNormal);
export const OpValues = Object.values(Op);

export type TypeOpsJointPostfix<Op> = {
  [KEY in keyof Op]: Op[KEY] | (KEY extends string ? `_${KEY}_${number}` : never);
};

// not use TypeOpsJointPostfix, which cause type not take affect for table.field
// export type TypeOpsJoint = TypeRecordValues<TypeOpsJointPostfix<Pick<typeof Op, 'and' | 'or' | 'not' | 'exists' | 'notExists'>>>;
export type TypeOpsJoint = TypeRecordValues<typeof OpJoint>;
export type TypeOpsNormal = TypeRecordValues<typeof OpNormal>;
export type TypeOpsAll = TypeRecordValues<typeof Op>;

// not use Knex.Raw
export type TypeModelColumnValue<TRecord, Column> =
  | keyof TRecord
  | Column
  | Column[]
  | null
  | '_skip_';

export type TypeModelWhere<TRecord, Columns extends {} | undefined = undefined> = Columns extends {}
  ? TypeModelWhereInner<Columns>
  : TypeModelWhereInner<TRecord>;
// not use Knex.Raw
// Columns extends {} ? TypeModelWhereInner<Columns> | Knex.Raw : TypeModelWhereInner<TRecord> | Knex.Raw;

export type TypeModelWhereInner<TRecord> = {
  [prop in keyof TRecord]?:
    | TypeModelColumnValue<TRecord, TRecord[prop]>
    | TypeModelWhereFieldAll<TRecord, TRecord[prop]>;
} & {
  [key in TypeOpsJoint]?: TypeModelWhereInner<TRecord>;
};

export type TypeModelWhereFieldAll<TRecord, Column> = {
  [key in TypeOpsJoint]?: TypeModelWhereFieldAll<TRecord, Column>;
} & {
  [key in TypeOpsNormal]?: TypeModelColumnValue<TRecord, Column>;
};

export type TypeModelWhereFieldJoint<TRecord, Column> = {
  [key in TypeOpsJoint]?: TypeModelWhereFieldAll<TRecord, Column>;
};

export type TypeModelColumn<TRecord> = keyof TRecord | '*';
export type TypeModelColumns<TRecord> = TypeModelColumn<TRecord> | Array<TypeModelColumn<TRecord>>;
export type TypeModelColumnPatch<TRecord, TColumn> = TColumn extends '*'
  ? TypeModelColumn<TRecord>
  : TColumn;
export type TypeModelColumnsPatch<TRecord, TColumn> = [TColumn] extends [string]
  ? TypeModelColumnPatch<TRecord, TColumn> | Array<TypeModelColumnPatch<TRecord, TColumn>>
  : TColumn;
export type TypeModelColumnsStrict<TRecord> = keyof TRecord | Array<keyof TRecord>;
