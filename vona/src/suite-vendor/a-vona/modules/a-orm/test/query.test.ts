import knex from 'knex';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import z from 'zod';

import type { IQueryPolicy } from '../src/types/query.ts';

import { buildWhere } from '../src/common/buildWhere.ts';
import { $executeAnalysisAggregate, $executeAnalysisGroup } from '../src/lib/analysis/execute.ts';
import { $compileQuery } from '../src/lib/query/compile.ts';
import { queryDefaultLimits } from '../src/lib/query/policy.ts';
import {
  checkQueryBudget,
  PublicQueryError,
  queryCapabilities,
  validateQuery,
} from '../src/lib/query/schema.ts';

class Model {
  connection: ReturnType<typeof knex>;
  db = { dialect: { capabilities: { ilike: true, like: true } } };
  constructor(client = 'pg') {
    this.connection = knex({ client });
  }

  getTable() {
    return 'main';
  }

  builder(table: string) {
    return this.connection(table);
  }

  raw(sql: string, bindings: any[]) {
    return this.connection.raw(sql, bindings);
  }

  prepareWhere(builder: any, table: string, where: object = {}) {
    buildWhere(this.db as any, builder, where);
    builder.where(`${table}.iid`, 1).where(`${table}.deleted`, false);
  }

  newInstanceTarget() {
    const target = new Model(this.connection.client.config.client);
    target.getTable = () => 'related';
    target.connection = this.connection;
    return target;
  }

  ref(column: string) {
    return this.connection.ref(column);
  }

  buildJoins(builder: any, joins: any[]) {
    for (const [type, table, columns] of joins ?? []) builder[type](table, ...columns);
  }

  selectSql(params: any) {
    const builder = this.builder('main').select(params.columns ?? 'main.*');
    this.buildJoins(builder, params.joins);
    this.prepareWhere(builder, 'main', params.where);
    for (const [column, direction] of params.orders ?? []) builder.orderBy(column, direction);
    if (params.groups) builder.groupBy(params.groups);
    return builder.toSQL();
  }
}
function policy() {
  return {
    name: 'TestPublic',
    pagination: true,
    modelLike: Model,
    modelClass: Model,
    fields: {
      name: {
        type: 'string',
        schema: z.string(),
        nullable: true,
        operators: ['eq', 'ne', 'containsI', 'in', 'isNull'],
      },
      level: {
        type: 'number',
        schema: z.number(),
        nullable: false,
        operators: ['eq', 'gte', 'lt', 'in'],
      },
    },
    orderable: ['id', 'name'],
    bindings: {},
    conveniences: {},
    projection: { mode: 'fixed' },
    defaults: { orders: [{ field: 'id', direction: 'asc' }], pageNo: 1, pageSize: 20 },
    limits: queryDefaultLimits,
  } as unknown as IQueryPolicy;
}
const invalid = (fn: () => unknown) => assert.throws(fn, PublicQueryError);

describe('public query contract', () => {
  it('validates typed recursive predicates without coercion', () => {
    const p = policy();
    const value = {
      where: {
        and: [
          { field: 'level', op: 'gte', value: 2 },
          {
            or: [
              { field: 'name', op: 'containsI', value: 'a' },
              { field: 'name', op: 'isNull' },
            ],
          },
        ],
      },
    };
    assert.deepEqual(validateQuery(p, value), value);
    for (const input of [
      { where: {} },
      { where: { name: 'a' } },
      { where: { and: [] } },
      { where: { field: 'level', op: 'eq', value: '2' } },
      { where: { field: 'hidden', op: 'eq', value: 'x' } },
      { where: { field: 'name', op: 'eq', value: null } },
      { where: { field: 'name', op: 'in', value: [] } },
      { where: { field: 'name', op: 'isNull', value: null } },
      { where: { field: 'name', op: 'eq', value: 'x', or: [] } },
      { joins: [] },
      { columns: ['id'] },
      { orders: [['id', 'asc']] },
      {
        orders: [
          { field: 'id', direction: 'asc' },
          { field: 'id', direction: 'desc' },
        ],
      },
      { pageNo: 1.5 },
      { pageSize: 101 },
      { pageNo: Number.MAX_SAFE_INTEGER, pageSize: 100 },
    ])
      invalid(() => validateQuery(p, input));
  });

  it('bounds input before recursion and advertises no server binding details', () => {
    const p = policy();
    const cyclic: any = {};
    cyclic.not = cyclic;
    invalid(() => checkQueryBudget(cyclic, p.limits));
    invalid(() => validateQuery(p, { where: { field: 'name', op: 'eq', value: 'a'.repeat(257) } }));
    invalid(() =>
      validateQuery(p, {
        where: { not: { not: { not: { field: 'name', op: 'eq', value: 'a' } } } },
      }),
    );
    const capabilities = queryCapabilities(p);
    assert.equal(capabilities.fields.name.type, 'string');
    assert.equal(JSON.stringify(capabilities).includes('modelClass'), false);
    assert.equal(JSON.stringify(capabilities).includes('schema'), false);
    const error = new PublicQueryError('query_shape', 'x'.repeat(300));
    assert.equal(error.path.length, 256);
    assert.deepEqual(error.errors, { queryCode: 'query_shape', path: error.path });
  });

  it('preserves explicitly unpaged policies and rejects page controls', () => {
    const p = { ...policy(), pagination: false };
    invalid(() => validateQuery(p, { pageNo: 1 }));
    invalid(() => validateQuery(p, { pageSize: 20 }));
    const model = new Model();
    const params = $compileQuery(model as any, p, {});
    assert.equal(params.limit, undefined);
    assert.equal(params.offset, undefined);
    model.connection.destroy();
  });

  it('orders null rank and actual values independently across dialects', async () => {
    for (const client of ['pg', 'mysql2', 'sqlite3']) {
      const model = new Model(client);
      try {
        const params = $compileQuery(model as any, policy(), {
          orders: [{ field: 'name', direction: 'desc' }],
        });
        const builder = model.builder('main').select('*');
        for (const [column, direction] of params.orders as any[])
          builder.orderBy(column, direction);
        const sql = builder.toSQL().sql;
        assert.match(sql, /order by case when .*name.* is null then 1 else 0 end asc,/);
        assert.match(sql, /name["`] desc, ["`]main["`]\.["`]id["`] asc$/);
      } finally {
        await model.connection.destroy();
      }
    }
  });

  it('joins unique targets directly while retaining scoped left joins and Boolean groups', async () => {
    for (const client of ['pg', 'mysql2', 'sqlite3']) {
      const model = new Model(client);
      model.db.dialect.capabilities = { like: client !== 'mysql2', ilike: client !== 'sqlite3' };
      const p = policy();
      (p.fields as any).userName = p.fields.name;
      (p.bindings as any).userName = {
        modelLike: Model,
        localKey: 'userId',
        foreignKey: 'id',
        field: 'name',
      };
      try {
        const params = $compileQuery(
          model as any,
          p,
          {
            where: {
              or: [
                { field: 'level', op: 'gte', value: 2 },
                {
                  and: [
                    { field: 'userName', op: 'containsI', value: 'a%_!' },
                    { not: { field: 'userName', op: 'isNull' } },
                  ],
                },
              ],
            },
          },
          { scopeWhere: { userId: 'trusted' } },
        );
        assert.equal(params.joins?.length, 1);
        assert.deepEqual(params.columns, ['main.*']);
        const { sql, bindings } = model.selectSql(params);
        assert.doesNotMatch(sql, /\bin \(select/i);
        assert.match(
          sql,
          /left join \(select .*related.*iid.*related.*deleted.*\) as .*query_related_0/s,
        );
        assert.match(sql, / or /);
        assert.match(sql, /not .*query_related_0.*name.*is null/s);
        assert.match(sql, /main.*userId/);
        assert.deepEqual(bindings, [1, false, 'trusted', 2, '%a!%!_!!%', 1, false]);
      } finally {
        await model.connection.destroy();
      }
    }
  });

  it('does not turn an order-only binding into a filtering inner join', async () => {
    const model = new Model();
    const p = policy();
    (p.bindings as any).name = {
      modelLike: Model,
      localKey: 'userId',
      foreignKey: 'id',
      field: 'name',
      joinType: 'innerJoin',
    };
    try {
      const params = $compileQuery(model as any, p, {
        orders: [{ field: 'name', direction: 'desc' }],
      });
      assert.equal(params.joins, undefined);
      const { sql } = model.selectSql(params);
      assert.match(sql, /order by case when \(select .*related.*name/s);
      assert.doesNotMatch(sql, /inner join/);
    } finally {
      await model.connection.destroy();
    }
  });

  it('executes compiled and server-authored analysis joins directly with qualified metrics and stable aliases', async () => {
    for (const client of ['pg', 'mysql2', 'sqlite3']) {
      const model = new Model(client);
      const p = policy();
      (p.bindings as any).name = {
        modelLike: Model,
        localKey: 'userId',
        foreignKey: 'id',
        field: 'name',
      };
      const analysis = {
        modelClass: Model,
        modelLike: Model,
        groups: ['level'],
        aggrs: { count: ['*', 'id'], sum: ['level'] },
        defaults: {
          group: { groups: ['level'], aggrs: { count: ['*', 'id'], sum: ['level'] } },
          aggregate: { aggrs: { count: ['*', 'id'], sum: ['level'] } },
        },
        limits: { maxGroups: 1, maxMetrics: 3, maxGroupRows: 10 },
      } as any;
      const calls: any[] = [];
      (model as any).group = async (params: any) => {
        calls.push(params);
        return [{ level: 2, count_all: 1, count_id: 1, sum_level: 2 }];
      };
      (model as any).aggregate = async (params: any) => {
        calls.push(params);
        return { count_all: 1, count_id: 1, sum_level: 2 };
      };
      try {
        const input = { where: { field: 'name', op: 'eq', value: 'target' } };
        const group = $compileQuery(model as any, p, input, { mode: 'group', analysis });
        const rows = await $executeAnalysisGroup(model as any, analysis, group);
        assert.deepEqual(rows, [{ level: 2, count_all: '1', count_id: '1', sum_level: '2' }]);
        const aggregate = $compileQuery(model as any, p, input, { mode: 'aggregate', analysis });
        assert.deepEqual(await $executeAnalysisAggregate(model as any, analysis, aggregate), {
          count_all: '1',
          count_id: '1',
          sum_level: '2',
        });
        const authored = {
          joins: [['innerJoin', 'related', ['main.id', 'related.mainId']]],
          where: { 'level': 2, 'related.name': 'target' },
        };
        const original = structuredClone(authored);
        await $executeAnalysisGroup(model as any, analysis, authored as any);
        await $executeAnalysisAggregate(model as any, analysis, authored as any);
        assert.deepEqual(authored, original);
        for (const params of calls.slice(2)) {
          assert.equal(params.joins, authored.joins);
          assert.deepEqual(params.where, { 'main.level': 2, 'related.name': 'target' });
        }
        for (const params of calls) {
          assert.equal(params.joins.length, 1);
          const { sql } = model.selectSql(params);
          assert.doesNotMatch(sql, /\bin \(select/i);
          assert.match(sql, /count\(\*\) as ["`]count_all["`]/);
          assert.match(sql, /count\(["`]main["`]\.["`]id["`]\) as ["`]count_id["`]/);
          assert.match(sql, /sum\(["`]main["`]\.["`]level["`]\) as ["`]sum_level["`]/);
        }
        assert.deepEqual(calls[0].groups, ['main.level']);
      } finally {
        await model.connection.destroy();
      }
    }
  });

  it('compiles repeated predicates and scope without overwriting and escapes literal patterns', () => {
    const model = new Model();
    const p = policy();
    const params = $compileQuery(
      model as any,
      p,
      {
        where: {
          and: [
            { field: 'level', op: 'gte', value: 2 },
            { field: 'level', op: 'lt', value: 4 },
            { not: { field: 'name', op: 'containsI', value: 'a%_!' } },
          ],
        },
        orders: [{ field: 'name', direction: 'desc' }],
        pageNo: 2,
      },
      { scopeWhere: { userId: 'trusted' } },
    );
    const raw = model.selectSql(params);
    assert.match(raw.sql, /not.*ilike/s);
    assert.match(raw.sql, /escape '!'/);
    assert.doesNotMatch(raw.sql, /\bin \(select/i);
    assert.deepEqual(raw.bindings, ['trusted', 2, 4, '%a!%!_!!%', 1, false]);
    assert.deepEqual((params.where as any)._and_scope, { 'main.userId': 'trusted' });
    const orders = params.orders as any[];
    assert.equal(orders[0][0].toSQL().sql, 'case when "main"."name" is null then 1 else 0 end');
    assert.equal(orders[0][1], 'asc');
    assert.deepEqual(orders.slice(1), [
      ['main.name', 'desc'],
      ['main.id', 'asc'],
    ]);
    assert.equal(params.offset, 20);
    model.connection.destroy();
  });
});
