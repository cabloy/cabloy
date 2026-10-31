import type { TableIdentity } from 'table-identity';

import type { BeanModelMeta } from '../src/lib/bean.model/bean.model_meta.ts';
import type { TypeDtoMutateClass, TypeDtoMutateResult } from '../src/types/dto/dtoMutate.ts';
import type { TypeSymbolKeyModelOptions } from '../src/types/relations.ts';

import { $Dto } from '../src/lib/dto/dto.ts';

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

declare class CuratedChildDto {
  id: TableIdentity;
  deleted: boolean;
  parentId: TableIdentity;
  createdAt: Date;
  custom: string;
  reference: { id: TableIdentity; deleted: boolean };
  references: Array<{ id: TableIdentity }>;
}
type GrandchildModel = Model;
type OwnedChildModel = Model<{
  grandchild: {
    type: 'hasOne';
    model: new () => GrandchildModel;
    key: 'parentId';
  };
  grandchildren: {
    type: 'hasMany';
    model: new () => GrandchildModel;
    key: 'parentId';
  };
  associations: { type: 'belongsToMany'; model: new () => GrandchildModel };
}>;
type OwnedRootModel = Model<{
  children: { type: 'hasMany'; model: new () => OwnedChildModel; key: 'parentId' };
}>;
declare const OwnedChildModel: new () => OwnedChildModel;
declare const OwnedRootModel: new () => OwnedRootModel;
declare const GrandchildModel: new () => GrandchildModel;

function checkReusedMutationSubclassTypes() {
  class ChildMutation extends $Dto.mutate(OwnedChildModel, {
    dtoClass: CuratedChildDto,
    include: { grandchild: true, grandchildren: true, associations: true },
    with: {
      extraGrandchild: {
        type: 'hasOne' as const,
        model: GrandchildModel,
        key: 'parentId' as const,
        options: { columns: 'entityOnly' as const },
      },
    },
  }) {}
  class DerivedChildMutation extends ChildMutation {
    extra: boolean;
  }
  class RootMutation extends $Dto.mutate(OwnedRootModel, {
    include: { children: { dtoClass: DerivedChildMutation } },
  }) {}
  class DerivedRootMutation extends RootMutation {}
  class RootCreate extends $Dto.create(OwnedRootModel, { dtoClass: DerivedRootMutation }) {}
  class RootUpdate extends $Dto.update(OwnedRootModel, { dtoClass: DerivedRootMutation }) {}
  class RootRemutate extends $Dto.mutate(OwnedRootModel, { dtoClass: DerivedRootMutation }) {}

  type ChildCreate = NonNullable<RootCreate['children']>[number];
  type ChildUpdate = NonNullable<RootUpdate['children']>[number];
  type ChildRemutate = NonNullable<RootRemutate['children']>[number];
  type GrandchildCreate = { entityOnly: string };
  type GrandchildUpdate = { entityOnly: string; id?: TableIdentity; deleted?: boolean };
  type AssociationIds = Array<{ id: TableIdentity; deleted?: boolean }> | undefined;

  expectType<Equal<Extract<keyof ChildCreate, 'id' | 'deleted' | 'parentId'>, never>>();
  expectType<Equal<ChildCreate['grandchild'], GrandchildCreate | undefined>>();
  expectType<Equal<ChildCreate['grandchildren'], GrandchildCreate[] | undefined>>();
  expectType<Equal<ChildCreate['extraGrandchild'], GrandchildCreate | undefined>>();
  expectType<Equal<ChildCreate['createdAt'], Date>>();
  expectType<Equal<ChildCreate['custom'], string>>();
  expectType<Equal<ChildCreate['extra'], boolean>>();
  expectType<Equal<ChildCreate['reference'], CuratedChildDto['reference']>>();
  expectType<Equal<ChildCreate['references'], CuratedChildDto['references']>>();
  expectType<Equal<ChildCreate['associations'], AssociationIds>>();

  expectType<
    Equal<Pick<ChildUpdate, 'id' | 'deleted'>, { id?: TableIdentity; deleted?: boolean }>
  >();
  expectType<Equal<ChildUpdate['grandchild'], GrandchildUpdate | undefined>>();
  expectType<Equal<ChildUpdate['grandchildren'], GrandchildUpdate[] | undefined>>();
  expectType<Equal<ChildUpdate['extraGrandchild'], GrandchildUpdate | undefined>>();
  expectType<Equal<ChildUpdate['reference'], CuratedChildDto['reference']>>();
  expectType<Equal<ChildUpdate['associations'], AssociationIds>>();
  expectType<Equal<ChildRemutate, ChildUpdate>>();

  // Reuse another generated subclass: the new scene must not intersect stale create fields.
  class CreateThenUpdate extends $Dto.update(OwnedRootModel, { dtoClass: RootCreate }) {}
  expectType<Equal<CreateThenUpdate['children'], RootUpdate['children']>>();

  class OverrideInclude extends $Dto.create(OwnedRootModel, {
    dtoClass: DerivedRootMutation,
    include: { children: { columns: ['entityOnly'] } },
  }) {}
  expectType<Equal<OverrideInclude['children'], Array<{ entityOnly: string }> | undefined>>();

  class OverrideWith extends $Dto.create(OwnedRootModel, {
    dtoClass: DerivedRootMutation,
    with: {
      children: {
        type: 'hasOne' as const,
        model: GrandchildModel,
        key: 'parentId' as const,
        options: { columns: 'entityOnly' as const },
      },
    },
  }) {}
  expectType<Equal<OverrideWith['children'], { entityOnly: string } | undefined>>();

  type AutoloadRootModel = Model<{
    children: {
      type: 'hasMany';
      model: new () => GrandchildModel;
      key: 'parentId';
      options: { autoload: true; columns: ['entityOnly'] };
    };
  }>;
  type OverrideAutoload = TypeDtoMutateResult<
    AutoloadRootModel,
    { dtoClass: typeof DerivedRootMutation },
    'create',
    undefined,
    true
  >;
  expectType<Equal<OverrideAutoload['children'], OverrideInclude['children']>>();

  // false retains the existing optional field value, but does not retain its replay plan.
  class Disabled extends $Dto.create(OwnedRootModel, {
    dtoClass: DerivedRootMutation,
    include: { children: false },
  }) {}
  class DisabledReused extends $Dto.create(OwnedRootModel, { dtoClass: Disabled }) {}
  expectType<Equal<Disabled['children'], DerivedRootMutation['children']>>();
  expectType<Equal<DisabledReused['children'], DerivedRootMutation['children']>>();

  // Constructor metadata is optional and does not leak into the DTO instance keys.
  expectType<Equal<Extract<keyof RootCreate, symbol>, never>>();
  type Constructor = TypeDtoMutateClass<
    OwnedRootModel,
    { dtoClass: typeof DerivedRootMutation },
    'create',
    undefined,
    true
  >;
  expectType<Equal<InstanceType<Constructor>, RootCreate>>();
}
void checkReusedMutationSubclassTypes;
