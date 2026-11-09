import knex from 'knex';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import z from 'zod';

import type { IQueryPolicy } from '../src/types/query.ts';

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

  prepareWhere(builder: any, _table: string, where: object = {}) {
    builder.where(where).where('main.iid', 1).where('main.deleted', false);
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
    const raw = (params.where as any)['main.id']._in_.toSQL();
    assert.match(raw.sql, /not.*ilike/s);
    assert.match(raw.sql, /escape '!'/);
    assert.deepEqual(raw.bindings, [2, 4, '%a!%!_!!%', 'trusted', 1, false]);
    assert.deepEqual((params.where as any)._and_scope, { userId: 'trusted' });
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
