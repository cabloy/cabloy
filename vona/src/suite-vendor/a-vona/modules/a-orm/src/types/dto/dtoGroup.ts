import type { TypeModelGroupRelationResultGroups } from '../relationsGroup.ts';

export type TypeDtoGroupResult<TRecord, Aggrs, Groups, Columns> =
  TypeModelGroupRelationResultGroups<TRecord, Aggrs, Groups, Columns>;
