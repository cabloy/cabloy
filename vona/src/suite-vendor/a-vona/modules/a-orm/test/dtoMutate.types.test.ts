import type { TableIdentity } from 'table-identity';

import type { BeanModelMeta } from '../src/lib/bean.model/bean.model_meta.ts';
import type { TypeDtoMutateResult } from '../src/types/dto/dtoMutate.ts';
import type { TypeSymbolKeyModelOptions } from '../src/types/relations.ts';

// Normalize intersections inside relation arrays before comparing complete shapes.
type Normalize<T> = T extends Date ? T : T extends object ? { [K in keyof T]: Normalize<T[K]> } : T;
type Equal<A, B> =
  (<T>() => T extends Normalize<A> ? 1 : 2) extends <T>() => T extends Normalize<B> ? 1 : 2
    ? true
    : false;
function expectType<_T extends true>() {}

type Entity = {
  id: TableIdentity;
  iid: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  parentId: TableIdentity;
  entityOnly: string;
};
declare class CustomDto {
  id: TableIdentity;
  parentId: TableIdentity;
  createdAt: Date;
  custom: string[];
  optional?: number;
}
type Model<Relations = {}> = BeanModelMeta<Entity> & {
  [K in TypeSymbolKeyModelOptions]: { relations: Relations };
};
type ChildModel = Model;
type ParentModel = Model<{
  children: {
    type: 'hasMany';
    model: new () => ChildModel;
    key: 'parentId';
    options: { columns: ['entityOnly']; dtoClass: typeof CustomDto };
  };
}>;

// Compile-time regressions, included in the normal Vona typecheck without loading the app.
function checkDtoMutationTypes() {
  type Params = { dtoClass: typeof CustomDto; columns: ['entityOnly'] };
  expectType<
    Equal<TypeDtoMutateResult<ChildModel, Params, 'create', 'createdAt', true>, CustomDto>
  >();
  expectType<Equal<TypeDtoMutateResult<ChildModel, Params, 'update', 'id', true>, CustomDto>>();
  expectType<
    Equal<TypeDtoMutateResult<ChildModel, Params, 'mutate', undefined, true>, CustomDto>
  >();

  type IncludedCreate = TypeDtoMutateResult<
    ParentModel,
    { include: { children: true } },
    'create',
    undefined,
    true
  >;
  expectType<
    Equal<IncludedCreate['children'], Array<Omit<CustomDto, 'id' | 'parentId'>> | undefined>
  >();

  type IncludedUpdate = TypeDtoMutateResult<
    ParentModel,
    { include: { children: { columns: ['entityOnly'] } } },
    'update',
    undefined,
    true
  >;
  // The existing id becomes optional; absent deleted is not invented, and parentId is removed.
  expectType<
    Equal<
      IncludedUpdate['children'],
      | Array<{
          id?: TableIdentity;
          createdAt: Date;
          custom: string[];
          optional?: number;
        }>
      | undefined
    >
  >();

  // dtoClass supplied by an include wrapper also overrides the entity without relation defaults.
  type IncludedOverride = TypeDtoMutateResult<
    Model<{ children: { type: 'hasOne'; model: new () => ChildModel; key: 'parentId' } }>,
    { include: { children: Params } },
    'mutate',
    undefined,
    true
  >;
  expectType<
    Equal<IncludedOverride['children'], NonNullable<IncludedUpdate['children']>[number] | undefined>
  >();

  // The no-dtoClass path retains its default omissions and relation/column inference.
  expectType<
    Equal<
      TypeDtoMutateResult<ChildModel, undefined, 'create', undefined, true>,
      Pick<Entity, 'parentId' | 'entityOnly'>
    >
  >();
  type DefaultNested = TypeDtoMutateResult<
    ChildModel,
    {
      with: {
        children: {
          type: 'hasMany';
          model: new () => ChildModel;
          key: 'parentId';
          options: { columns: ['entityOnly'] };
        };
      };
    },
    'update',
    undefined,
    true
  >;
  expectType<
    Equal<
      DefaultNested['children'],
      Array<{ entityOnly: string; id?: TableIdentity; deleted?: boolean }> | undefined
    >
  >();
}
void checkDtoMutationTypes;
