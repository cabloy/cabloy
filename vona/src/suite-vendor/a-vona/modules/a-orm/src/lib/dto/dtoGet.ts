import type { Constructable } from 'vona';

import { ensureArray, hashkey } from '@cabloy/utils';
import { $Class, appResource } from 'vona';
import {
  addSchemaDynamic,
  Api,
  getSchemaDynamic,
  schemaRenderVisible,
  SymbolSchemaDynamicRefId,
  v,
} from 'vona-module-a-openapiutils';
import z from 'zod';

import type { BeanModelMeta } from '../../bean/bean.model/bean.model_meta.ts';
import type { IDtoGetParams, TypeDtoGetResult } from '../../types/dto/dtoGet.ts';
import type { TypeDtoMutateType } from '../../types/dto/dtoMutate.ts';
import type { IModelRelationIncludeWrapper } from '../../types/model.ts';
import type { IDecoratorModelOptions, IModelClassRecord } from '../../types/onion/model.ts';
import type { IRelationItem } from '../../types/relationsDef.ts';

import {
  getClassEntityFromClassModel,
  prepareClassModel,
  prepareColumns,
} from '../../common/utils.ts';
import { handleRelationsCollection } from '../utils.ts';
import { DtoAggregate } from './dtoAggregate.ts';
import { DtoGroup } from './dtoGroup.ts';
import { _DtoMutate_raw } from './dtoMutate.ts';

export function DtoGet<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  T extends IDtoGetParams<ModelLike> | undefined = undefined,
>(
  modelLike: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
  params?: T,
): Constructable<TypeDtoGetResult<ModelLike, T>> {
  return _DtoGet_raw(modelLike, params);
}

function _DtoGet_raw<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  T extends IDtoGetParams<ModelLike> | undefined = undefined,
>(
  modelLike: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
  params?: T,
): Constructable<TypeDtoGetResult<ModelLike, T>> {
  // model
  const modelClass = prepareClassModel(modelLike);
  // entity
  let entityClass = getClassEntityFromClassModel(modelClass);
  // columns
  const columns = prepareColumns(params?.columns);
  // always create a new class, no matter if columns empty
  entityClass = $Class.pick(entityClass, columns as any);
  // relations
  _DtoGet_relations(modelClass, entityClass, params as any);
  return entityClass as any;
}

export function _DtoGet_relations<TRecord extends {}, TModel extends BeanModelMeta>(
  modelClass: Constructable<TModel>,
  entityClass: Constructable<TRecord>,
  includeWrapper?: IModelRelationIncludeWrapper,
  mutateTypeTopLevel?: TypeDtoMutateType,
) {
  // relations
  const relations = _DtoGet_relations_collection(modelClass, includeWrapper);
  if (!relations) return;
  for (const relation of relations) {
    _DtoGet_relation_handle(entityClass, relation, mutateTypeTopLevel);
  }
}

function _DtoGet_relation_handle<TRecord extends {}>(
  entityClass: Constructable<TRecord>,
  relation: [string, any, any, any, boolean],
  mutateTypeTopLevel?: TypeDtoMutateType,
) {
  const [relationName, relationReal, includeReal, withReal, autoload] = relation;
  const { type, model, options } = relationReal;
  const modelTarget = prepareClassModel(model);
  const optionsReal = Object.assign({}, options, { include: includeReal, with: withReal });
  if (mutateTypeTopLevel) {
    if (type === 'belongsTo') {
      // donot mutate
      return;
    }
    let schema;
    if (type === 'belongsToMany') {
      schema = v.array(z.object({ id: v.tableIdentity()(), deleted: z.boolean().optional() }));
    } else if (type === 'hasOne') {
      const schemaLazy = _DtoGet_relation_handle_schemaLazy(
        modelTarget,
        optionsReal,
        autoload,
        mutateTypeTopLevel,
        relation,
      );
      schema = v.lazy(schemaRenderVisible(false), schemaLazy);
      // optional = true;
    } else {
      // hasMany
      const schemaLazy = _DtoGet_relation_handle_schemaLazy(
        modelTarget,
        optionsReal,
        autoload,
        mutateTypeTopLevel,
        relation,
      );
      schema = v.array(v.lazy(schemaLazy));
    }
    Api.field(v.optional(), schema)(entityClass.prototype, relationName);
  } else {
    const schemaLazy = _DtoGet_relation_handle_schemaLazy(
      modelTarget,
      optionsReal,
      autoload,
      mutateTypeTopLevel,
      relation,
    );
    let schema;
    let optional = false;
    if (type === 'hasOne' || type === 'belongsTo') {
      schema = v.lazy(schemaRenderVisible(false), schemaLazy);
      optional = true;
    } else {
      if (optionsReal.groups) {
        schema = v.array(v.lazy(schemaLazy));
      } else if (optionsReal.aggrs) {
        schema = v.lazy(schemaLazy);
        optional = true;
      } else {
        schema = v.array(v.lazy(schemaLazy));
      }
    }
    if (optional) {
      Api.field(v.optional(), schema)(entityClass.prototype, relationName);
    } else {
      Api.field(schema)(entityClass.prototype, relationName);
    }
  }
}

function _DtoGet_relation_handle_schemaLazy(
  modelTarget,
  optionsReal,
  autoload,
  mutateTypeTopLevel?: TypeDtoMutateType,
  relation?: IRelationItem,
) {
  return () => {
    if (!autoload) {
      return _DtoGet_relation_handle_schemaLazy_raw(
        modelTarget,
        optionsReal,
        mutateTypeTopLevel,
        relation,
      );
    }
    // dynamic
    const entityClass = getClassEntityFromClassModel(modelTarget);
    const beanFullName = appResource.getBeanFullName(entityClass);
    const _hashkey = _DtoGet_relation_handle_schemaLazy_hashkey(optionsReal, mutateTypeTopLevel);
    const dynamicName = `${beanFullName}_${_hashkey}`;
    let entityTarget = getSchemaDynamic(dynamicName);
    if (!entityTarget) {
      entityTarget = _DtoGet_relation_handle_schemaLazy_raw(
        modelTarget,
        optionsReal,
        mutateTypeTopLevel,
        relation,
      );
      entityTarget[SymbolSchemaDynamicRefId] = dynamicName;
      addSchemaDynamic(dynamicName, entityTarget);
    }
    return entityTarget;
  };
}

function _DtoGet_relation_handle_schemaLazy_raw(
  modelTarget,
  optionsReal,
  mutateTypeTopLevel?: TypeDtoMutateType,
  relation?: IRelationItem,
) {
  if (mutateTypeTopLevel) {
    return _DtoMutate_raw(modelTarget, optionsReal, mutateTypeTopLevel, undefined, false, relation); // columnsOmitDefault: undefined
  } else {
    if (optionsReal.groups) {
      return DtoGroup(modelTarget, optionsReal.groups, optionsReal.aggrs, optionsReal.columns);
    } else if (optionsReal.aggrs) {
      return DtoAggregate(modelTarget, optionsReal.aggrs);
    } else {
      return _DtoGet_raw(modelTarget, optionsReal);
    }
  }
}

function _DtoGet_relation_handle_schemaLazy_hashkey(
  optionsReal,
  mutateTypeTopLevel?: TypeDtoMutateType,
) {
  const columns = prepareColumns(optionsReal.columns);
  const aggrs = ensureArray(optionsReal.aggrs);
  const groups = ensureArray(optionsReal.groups);
  return columns || aggrs || groups || mutateTypeTopLevel
    ? hashkey({ columns, aggrs, groups, mutate: mutateTypeTopLevel })
    : 'none';
}

function _DtoGet_relations_collection<TModel extends BeanModelMeta>(
  modelClass: Constructable<TModel>,
  includeWrapper?: IModelRelationIncludeWrapper,
) {
  const beanOptions = appResource.getBean(modelClass);
  const options = beanOptions?.options as IDecoratorModelOptions | undefined;
  return handleRelationsCollection(options?.relations, includeWrapper);
}
