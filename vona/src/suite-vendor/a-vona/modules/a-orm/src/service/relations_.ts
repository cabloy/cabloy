import type { TableIdentity } from 'table-identity';

import { isNil } from '@cabloy/utils';
import { BeanBase, cast, deepExtend } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { BeanModelCache } from '../bean/bean.model/bean.model_cache.ts';
import type { BeanModelCrud } from '../bean/bean.model/bean.model_crud.ts';
import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { IModelMethodOptions, IModelRelationIncludeWrapper } from '../types/model.ts';
import type { IModelClassRecord } from '../types/onion/model.ts';
import type { TypeModelClassLike } from '../types/relations.ts';
import type { IModelRelationOptionsMetaBasic, IRelationItem } from '../types/relationsDef.ts';

import { handleRelationsCollection } from '../lib/utils.ts';

@Service()
export class ServiceRelations extends BeanBase {
  protected _model: BeanModelCache;

  protected __init__(model: BeanModelCache) {
    this._model = model;
  }

  public async handleRelationsOne<TRecord extends {}>(
    relations: IRelationItem[] | undefined,
    entity: TRecord | undefined,
    includeWrapper?: IModelRelationIncludeWrapper,
    methodOptions?: IModelMethodOptions,
  ) {
    if (!entity) return entity;
    // relations
    if (!relations) {
      relations = this.handleRelationsCollection(includeWrapper);
    }
    if (relations.length === 0) return entity;
    for (const relation of relations) {
      await this.__handleRelationOne(entity, relation, methodOptions);
    }
    return entity;
  }

  public async handleRelationsMany<TRecord extends {}>(
    relations: IRelationItem[] | undefined,
    entities: TRecord[],
    includeWrapper?: IModelRelationIncludeWrapper,
    methodOptions?: IModelMethodOptions,
  ) {
    if (entities.length === 0) return entities;
    // relations
    if (!relations) {
      relations = this.handleRelationsCollection(includeWrapper);
    }
    if (relations.length === 0) return entities;
    for (const relation of relations) {
      await this.__handleRelationMany(entities, relation, methodOptions);
    }
    return entities;
  }

  public async handleRelationsMutate<TRecord extends {}>(
    entitiesResult: TRecord[],
    entities: TRecord[],
    includeWrapper: IModelRelationIncludeWrapper | undefined,
    methodOptions: IModelMethodOptions | undefined,
  ) {
    if (entitiesResult.length === 0) return entitiesResult;
    // relations
    const relations = this.handleRelationsCollection(includeWrapper);
    if (!relations) return entitiesResult;
    for (const relation of relations) {
      entitiesResult = await this.__handleRelationMutate(
        entitiesResult,
        entities,
        relation,
        methodOptions,
      );
    }
    return entitiesResult;
  }

  public async handleRelationsDelete(
    ids: TableIdentity[],
    includeWrapper?: IModelRelationIncludeWrapper,
    methodOptions?: IModelMethodOptions,
  ) {
    if (ids.length === 0) return;
    // relations
    const relations = this.handleRelationsCollection(includeWrapper);
    if (!relations) return;
    for (const relation of relations) {
      await this.__handleRelationDelete(ids, relation, methodOptions);
    }
  }

  private async __handleRelationOne<TRecord extends {}>(
    entity: TRecord,
    relation: IRelationItem,
    methodOptions?: IModelMethodOptions,
  ) {
    const [relationName, relationReal, includeReal, withReal] = relation;
    const { type, modelMiddle, model, keyFrom, keyTo, key, options } = relationReal;
    const modelTarget = this.__getModelTarget(model, options?.meta) as BeanModelCache;
    const optionsReal = Object.assign({}, options, { include: includeReal, with: withReal });
    const methodOptionsReal = Object.assign({}, methodOptions, { columns: undefined });
    if (type === 'hasOne') {
      const idFrom = cast(entity).id;
      if (isNil(idFrom)) {
        entity[relationName] = undefined;
      } else {
        const where = { [key]: idFrom };
        const options2 = deepExtend({}, methodOptionsReal, optionsReal);
        entity[relationName] = await modelTarget.get(where, options2);
      }
    } else if (type === 'belongsTo') {
      const idTo = cast(entity)[key];
      if (isNil(idTo)) {
        entity[relationName] = undefined;
      } else {
        const where = { id: idTo };
        const options2 = deepExtend({}, methodOptionsReal, optionsReal);
        entity[relationName] = await modelTarget.get(where, options2);
      }
    } else if (type === 'hasMany') {
      const idFrom = cast(entity).id;
      if (isNil(idFrom)) {
        entity[relationName] = optionsReal.groups ? [] : optionsReal.aggrs ? undefined : [];
      } else {
        if (optionsReal.groups) {
          const options2 = deepExtend({}, optionsReal, { where: { [key]: idFrom } });
          entity[relationName] = await modelTarget.group(options2, methodOptionsReal);
        } else if (optionsReal.aggrs) {
          const options2 = deepExtend({}, optionsReal, { where: { [key]: idFrom } });
          entity[relationName] = await modelTarget.aggregate(options2, methodOptionsReal);
        } else {
          const options2 = deepExtend({}, optionsReal, { where: { [key]: idFrom } });
          entity[relationName] = await modelTarget.select(options2, methodOptionsReal);
        }
      }
    } else if (type === 'belongsToMany') {
      const modelTargetMiddle = this.__getModelTarget(
        modelMiddle,
        options?.meta?.middle,
      ) as BeanModelCrud;
      const idFrom = cast(entity).id;
      if (isNil(idFrom)) {
        entity[relationName] = optionsReal.groups ? [] : optionsReal.aggrs ? undefined : [];
      } else {
        const itemsMiddle = await modelTargetMiddle.select(
          { where: { [keyFrom]: idFrom } },
          methodOptionsReal,
        );
        const idsTo = itemsMiddle.map(item => item[keyTo]);
        if (optionsReal.groups) {
          const options2 = deepExtend({}, optionsReal, { where: { id: idsTo } });
          entity[relationName] = await modelTarget.group(options2, methodOptionsReal);
        } else if (optionsReal.aggrs) {
          const options2 = deepExtend({}, optionsReal, { where: { id: idsTo } });
          entity[relationName] = await modelTarget.aggregate(options2, methodOptionsReal);
        } else {
          const options2 = deepExtend({}, methodOptionsReal, optionsReal);
          entity[relationName] = await modelTarget.mget(idsTo, options2);
        }
      }
    }
  }

  private async __handleRelationMany<TRecord extends {}>(
    entities: TRecord[],
    relation: IRelationItem,
    methodOptions?: IModelMethodOptions,
  ) {
    const [relationName, relationReal, includeReal, withReal] = relation;
    const { type, modelMiddle, model, keyFrom, keyTo, key, options } = relationReal;
    const modelTarget = this.__getModelTarget(model, options?.meta) as BeanModelCache;
    const optionsReal = Object.assign({}, options, { include: includeReal, with: withReal });
    const methodOptionsReal = Object.assign({}, methodOptions, { columns: undefined });
    if (type === 'hasOne') {
      const idsFrom = entities.map(item => cast(item).id).filter(id => !isNil(id));
      const [columns, withKey] = this.__prepareColumnsAndKey(optionsReal.columns, key);
      const options2 = deepExtend({}, optionsReal, { columns, where: { [key]: idsFrom } });
      let items;
      if (idsFrom.length === 0) {
        items = [];
      } else {
        items = await modelTarget.select(options2, methodOptionsReal);
      }
      for (const entity of entities) {
        entity[relationName] = items.find(item => {
          if (item[key] === cast(entity).id) {
            if (!withKey) delete item[key];
            return true;
          }
          return false;
        });
      }
    } else if (type === 'belongsTo') {
      const idsTo = entities.map(item => cast(item)[key]).filter(id => !isNil(id));
      const options2 = deepExtend({}, methodOptionsReal, optionsReal);
      const items = await modelTarget.mget(idsTo, options2);
      for (const entity of entities) {
        entity[relationName] = items.find(item => cast(item).id === cast(entity)[key]);
      }
    } else if (type === 'hasMany') {
      const idsFrom = entities.map(item => cast(item).id).filter(id => !isNil(id));
      if (optionsReal.groups) {
        const groups = [key].concat(optionsReal.groups);
        const options2 = deepExtend({}, optionsReal, { groups, where: { [key]: idsFrom } });
        const items = await modelTarget.group(options2, methodOptionsReal);
        for (const entity of entities) {
          entity[relationName] = [];
          for (const item of items) {
            if (item[key] === cast(entity).id) {
              delete item[key];
              entity[relationName].push(item);
            }
          }
        }
      } else if (optionsReal.aggrs) {
        const options2 = deepExtend({}, optionsReal, { groups: key, where: { [key]: idsFrom } });
        const items = await modelTarget.group(options2, methodOptionsReal);
        for (const entity of entities) {
          const item = items.find(item => item[key] === cast(entity).id);
          if (item) {
            delete item[key];
          }
          entity[relationName] = item;
        }
      } else {
        const [columns, withKey] = this.__prepareColumnsAndKey(optionsReal.columns, key);
        const options2 = deepExtend({}, optionsReal, { columns, where: { [key]: idsFrom } });
        const items = await modelTarget.select(options2, methodOptionsReal);
        for (const entity of entities) {
          entity[relationName] = [];
          for (const item of items) {
            if (item[key] === cast(entity).id) {
              if (!withKey) delete item[key];
              entity[relationName].push(item);
            }
          }
        }
      }
    } else if (type === 'belongsToMany') {
      const modelTargetMiddle = this.__getModelTarget(
        modelMiddle,
        options?.meta?.middle,
      ) as BeanModelCrud;
      const idsFrom = entities.map(item => cast(item).id).filter(id => !isNil(id));
      let itemsMiddle;
      if (idsFrom.length === 0) {
        itemsMiddle = [];
      } else {
        itemsMiddle = await modelTargetMiddle.select(
          { where: { [keyFrom]: idsFrom } },
          methodOptionsReal,
        );
      }
      if (optionsReal.groups) {
        for (const entity of entities) {
          const idsTo = itemsMiddle
            .filter(item => item[keyFrom] === cast(entity).id)
            .map(item => item[keyTo]);
          const options2 = deepExtend({}, optionsReal, {
            groups: optionsReal.groups,
            where: { id: idsTo },
          });
          entity[relationName] = await modelTarget.group(options2, methodOptionsReal);
        }
      } else if (optionsReal.aggrs) {
        for (const entity of entities) {
          const idsTo = itemsMiddle
            .filter(item => item[keyFrom] === cast(entity).id)
            .map(item => item[keyTo]);
          const options2 = deepExtend({}, optionsReal, { where: { id: idsTo } });
          entity[relationName] = await modelTarget.aggregate(options2, methodOptionsReal);
        }
      } else {
        const idsTo = itemsMiddle.map(item => item[keyTo]);
        const options2 = deepExtend({}, methodOptionsReal, optionsReal);
        const items = await modelTarget.mget(idsTo, options2);
        for (const entity of entities) {
          entity[relationName] = [];
          for (const itemMiddle of itemsMiddle) {
            if (itemMiddle[keyFrom] === cast(entity).id) {
              entity[relationName].push(
                items.find(item => cast(item).id === cast(itemMiddle)[keyTo]),
              );
            }
          }
        }
      }
    }
  }

  private async __handleRelationMutate<TRecord extends {}>(
    entitiesResult: TRecord[],
    entities: TRecord[],
    relation: IRelationItem,
    methodOptions?: IModelMethodOptions,
  ) {
    const [relationName, relationReal, includeReal, withReal] = relation;
    const { type, modelMiddle, model, keyFrom, keyTo, key, options } = relationReal;
    const modelTarget = this.__getModelTarget(model, options?.meta) as BeanModelCache;
    const methodOptionsReal = Object.assign({}, methodOptions, {
      include: includeReal,
      with: withReal,
    });
    if (type === 'hasOne') {
      let children: any[] = [];
      for (let index = 0; index < entities.length; index++) {
        const entity = entities[index];
        if (entity[relationName]) {
          // donot check if has id of entity[relationName], for safety
          const item: any = await modelTarget.get({ [key]: cast(entity).id });
          if (
            !isNil(item?.id) &&
            !isNil(entity[relationName].id) &&
            String(item?.id) !== String(entity[relationName].id)
          ) {
            throw new Error(`invalid id: ${entity[relationName].id}`);
          }
          const dataNew: any = { [key]: cast(entity).id };
          if (!isNil(item?.id)) {
            dataNew.id = item.id;
          }
          children.push(Object.assign({}, entity[relationName], dataNew));
        }
      }
      children = await modelTarget.mutateBulk(children, methodOptionsReal);
      const result: TRecord[] = entitiesResult.concat();
      for (let index = 0; index < entities.length; index++) {
        const entityResult = result[index];
        const entity = entities[index];
        if (entity[relationName]) {
          entityResult[relationName] = children.find(
            item => String(item[key]) === String(cast(entity).id),
          );
        }
      }
      return result;
    } else if (type === 'belongsTo') {
      // do nothing
      return entitiesResult;
    } else if (type === 'hasMany') {
      let children: any[] = [];
      for (let index = 0; index < entities.length; index++) {
        const entity = entities[index];
        if (entity[relationName] && entity[relationName].length > 0) {
          const entityId = cast(entity).id;
          const idsTo = entity[relationName].map(item => item.id).filter(id => !isNil(id));
          let idsTarget;
          if (idsTo.length === 0) {
            idsTarget = [];
          } else {
            const itemsTarget = await cast(modelTarget).__select_raw(
              undefined,
              { where: { [key]: entityId, id: idsTo } },
              methodOptionsReal,
            );
            idsTarget = itemsTarget.map(item => item.id);
          }
          for (const child of entity[relationName]) {
            if (!isNil(child.id) && !idsTarget.includes(child.id)) {
              throw new Error(`invalid id: ${child.id}`);
            }
            children.push(Object.assign({}, child, { [key]: entityId }));
          }
        }
      }
      children = await modelTarget.mutateBulk(children, methodOptionsReal);
      const result: TRecord[] = entitiesResult.concat();
      for (let index = 0; index < entities.length; index++) {
        const entityResult = result[index];
        const entity = entities[index];
        if (entity[relationName]) {
          entityResult[relationName] = [];
          for (const child of children) {
            if (child[key] === cast(entity).id) {
              entityResult[relationName].push(child);
            }
          }
        }
      }
      return result;
    } else if (type === 'belongsToMany') {
      const modelTargetMiddle = this.__getModelTarget(
        modelMiddle,
        options?.meta?.middle,
      ) as BeanModelCache;
      let children: any[] = [];
      for (let index = 0; index < entities.length; index++) {
        const entity = entities[index];
        if (entity[relationName] && entity[relationName].length > 0) {
          const idsTo = entity[relationName].map(item => item.id);
          let itemsMiddle;
          if (idsTo.length === 0) {
            itemsMiddle = [];
          } else {
            itemsMiddle = await cast(modelTargetMiddle).__select_raw(
              undefined,
              { where: { [keyFrom]: cast(entity).id, [keyTo]: idsTo } },
              methodOptionsReal,
            );
          }
          for (const child of entity[relationName]) {
            const itemMiddle = itemsMiddle.find(item => item[keyTo] === child.id);
            if (!itemMiddle) {
              if (!child.deleted) {
                // add
                children.push({ [keyFrom]: cast(entity).id, [keyTo]: child.id });
              }
            } else {
              if (child.deleted) {
                // delete
                children.push({ id: itemMiddle.id, deleted: child.deleted });
              }
            }
          }
        }
      }
      children = await modelTargetMiddle.mutateBulk(children, methodOptionsReal);
      const result: TRecord[] = entitiesResult.concat();
      for (let index = 0; index < entities.length; index++) {
        const entityResult = result[index];
        const entity = entities[index];
        if (entity[relationName]) {
          entityResult[relationName] = [];
          for (const child of children) {
            if (child[keyFrom] === cast(entity).id) {
              entityResult[relationName].push({ id: child[keyTo] });
            }
          }
        }
      }
      return result;
    }
    // do nothing
    return entitiesResult;
  }

  private async __handleRelationDelete(
    ids: TableIdentity[],
    relation: IRelationItem,
    methodOptions?: IModelMethodOptions,
  ) {
    const [_relationName, relationReal, includeReal, withReal] = relation;
    const { type, modelMiddle, model, keyFrom, key, options } = relationReal;
    const modelTarget = this.__getModelTarget(model, options?.meta) as BeanModelCache;
    const methodOptionsReal = Object.assign({}, methodOptions, {
      include: includeReal,
      with: withReal,
    });
    if (type === 'hasOne' || type === 'hasMany') {
      const children = await cast(modelTarget).__select_raw(
        undefined,
        { columns: 'id', where: { [key]: ids } },
        methodOptionsReal,
      );
      const idsTo = children.map(item => item.id);
      await modelTarget.deleteBulk(idsTo, methodOptionsReal);
    } else if (type === 'belongsTo') {
      // do nothing
    } else if (type === 'belongsToMany') {
      const modelTargetMiddle = this.__getModelTarget(
        modelMiddle,
        options?.meta?.middle,
      ) as BeanModelCache;
      const itemsMiddle = await cast(modelTargetMiddle).__select_raw(
        undefined,
        { columns: 'id', where: { [keyFrom]: ids } },
        methodOptionsReal,
      );
      const idsMiddle = itemsMiddle.map(item => item.id);
      await modelTargetMiddle.deleteBulk(idsMiddle, methodOptionsReal);
    }
  }

  private __prepareColumnsAndKey(columns: string | string[] | undefined, key: string) {
    if (!columns) return [columns, true];
    columns = Array.isArray(columns) ? columns : [columns];
    if (columns.includes('*') || columns.includes(key)) return [columns, true];
    columns = columns.concat(key);
    return [columns, false];
  }

  public prepareColumnsByRelations<T extends { columns?: any }>(
    relations: IRelationItem[],
    options?: T,
  ): [T | undefined, string[] | undefined] {
    if (!options || !options.columns) return [options, undefined];
    const columns = Array.isArray(options.columns) ? options.columns : [options.columns];
    if (columns.includes('*')) return [options, undefined];
    // refKeys
    const refKeys: string[] = [];
    for (const relation of relations) {
      const [_relationName, relationReal] = relation;
      const { type, key } = relationReal;
      if (type === 'belongsTo') {
        if (!columns.includes(key)) {
          columns.push(key);
          refKeys.push(key);
        }
      }
    }
    options = refKeys.length === 0 ? options : { ...options, columns };
    return [options, refKeys];
  }

  private __getModelTarget<MODEL extends BeanModelMeta | keyof IModelClassRecord>(
    modelClassTarget: TypeModelClassLike<MODEL>,
    meta: IModelRelationOptionsMetaBasic | undefined,
  ): BeanModelMeta {
    return this._model.newInstanceTarget(modelClassTarget, meta?.client, meta?.table);
  }

  public handleRelationsCollection(includeWrapper?: IModelRelationIncludeWrapper): IRelationItem[] {
    return handleRelationsCollection(this._model.options.relations, includeWrapper);
  }
}
