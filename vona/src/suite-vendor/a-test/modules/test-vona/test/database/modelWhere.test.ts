import type { Knex } from 'knex';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { Op } from 'vona-module-a-orm';

describe('modelWhere.test.ts', { concurrency: false }, () => {
  it('matches literal EqI predicates and their complements on the active dialect', async () => {
    await app.bean.executor.mockCtx(async () => {
      const model = app.scope('test-vona').model.user;
      const prefix = `modelWhere:${randomUUID()}:`;
      const name = `${prefix}MiXeD%_!\\'`;
      const names = [name, `${prefix}MixedExtraX!\\'`, `${prefix}Other`];
      try {
        const users = await model.insertBulk(names.map(name => ({ name })));
        const ids = users.map(item => item.id);
        const value = name.toUpperCase();
        const equal = await model.select({ where: { id: ids, name: { _eqI_: value } } });
        assert.deepEqual(
          equal.map(item => item.name),
          [name],
        );
        const different = await model.select({
          where: { id: ids, name: { _notEqI_: value } },
        });
        assert.deepEqual(different.map(item => item.name).sort(), names.slice(1).sort());
        const nested = await model.select({
          where: {
            id: ids,
            _not_: { _or_: { name: { _notEqI_: value }, id: -1 } },
          },
        });
        assert.deepEqual(
          nested.map(item => item.name),
          [name],
        );

        const qualified = model.builder().select('name').whereIn('id', ids);
        model.buildWhere(qualified, { 'testVonaUser.name': { _eqI_: value } } as any);
        assert.deepEqual(
          (await qualified).map(item => item.name),
          [name],
        );

        const grouped = await model.group({
          groups: ['name'],
          aggrs: { count: '*' },
          where: { id: ids },
          having: { name: { _eqI_: value } },
        });
        assert.deepEqual(
          grouped.map(item => item.name),
          [name],
        );
        const groupedDifferent = await model.group({
          groups: ['name'],
          aggrs: { count: '*' },
          where: { id: ids },
          having: { name: { _notEqI_: value } },
        });
        assert.deepEqual(groupedDifferent.map(item => item.name).sort(), names.slice(1).sort());

        // Trusted raw/ref operands retain pattern semantics rather than being escaped.
        const pattern = await model.select({
          where: { id: ids, name: { _eqI_: model.raw('?', [`${prefix}%`]) as any } },
        });
        assert.equal(pattern.length, names.length);
        const referenced = await model.select({
          where: { id: users[2].id, name: { _eqI_: model.ref('name') as any } },
        });
        assert.deepEqual(
          referenced.map(item => item.name),
          [names[2]],
        );
        const startsWith = await model.select({
          where: { id: ids, name: { _startsWith_: prefix } },
        });
        assert.equal(startsWith.length, names.length);
        const includes = await model.select({
          where: { id: ids, name: { _includes_: 'Other' } },
        });
        assert.deepEqual(
          includes.map(item => item.name),
          [names[2]],
        );
      } finally {
        await model.delete({ name: names });
      }
    });
  });

  it('action:modelWhere', async () => {
    await app.bean.executor.mockCtx(async () => {
      if (app.bean.database.current.dialectName !== 'pg') return;
      const scopeTest = app.scope('test-vona');
      // ref
      let builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, { id: scopeTest.model.post.ref('id') as any });
      let sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost" where "id" = "id"');
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        id: scopeTest.model.post.ref('testVonaPost.id') as any,
      });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost" where "id" = "testVonaPost"."id"');
      // raw
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(
        builder,
        scopeTest.model.post.raw('?? = ?', ['id', 1]) as any,
      );
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost" where "id" = 1');
      // op: normal
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, { id: 1 });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost" where "id" = 1');
      // op: normal: joint
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, { id: { _or_: { _eq_: 3, _gt_: 4 } } });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost" where ((("id" = 3) or ("id" > 4)))');
      // undefined / Op.omit: omit
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, { id: 1, iid: undefined });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost" where "id" = 1');
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, { id: 1, iid: Op.omit });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost" where "id" = 1');
      // op: and
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _and_: { iid: 1, id: 2 },
      });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost" where (("iid" = 1) and ("id" = 2))');
      // op: and: omit
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _and_: Op.omit,
      });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost"');
      // op: and: empty
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _and_: { _and_: {} },
      });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost"');
      // op: or
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _or_: { iid: 1, id: 2 },
      });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost" where (("iid" = 1) or ("id" = 2))');
      // op: or: omit
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _or_: Op.omit,
      });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost"');
      // op: or: more
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _or_: {
          _and_: { iid: 1, id: 2 },
          title: 'test',
        },
      });
      sql = builder.toQuery();
      assert.equal(
        sql,
        'select * from "testVonaPost" where (((("iid" = 1) and ("id" = 2))) or ("title" = \'test\'))',
      );
      // op: not
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _not_: { iid: 1, id: 2 },
      });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost" where not ("iid" = 1 and "id" = 2)');
      // op: not: omit
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _not_: Op.omit,
      });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost"');
      // op: exists
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _exists_: Op.omit,
      });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost"');
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _exists_: function (this: Knex.QueryBuilder) {
          this.select('id')
            .from('testVonaUser')
            .where({ 'testVonaUser.id': app.bean.model.ref('userId') });
        } as any,
      });
      sql = builder.toQuery();
      assert.equal(
        sql,
        'select * from "testVonaPost" where exists (select "id" from "testVonaUser" where "testVonaUser"."id" = "userId")',
      );
      // op: notExists
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _notExists_: Op.omit,
      });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost"');
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        _notExists_: function (this: Knex.QueryBuilder) {
          this.select('id')
            .from('testVonaUser')
            .where({ 'testVonaUser.id': app.bean.model.ref('userId') });
        } as any,
      });
      sql = builder.toQuery();
      assert.equal(
        sql,
        'select * from "testVonaPost" where not exists (select "id" from "testVonaUser" where "testVonaUser"."id" = "userId")',
      );
      // op: array direct/in/notIn
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        id: [1, 2],
        iid: [],
        _or_: { id: { _in_: [2, 3] }, iid: { _notIn_: [3, 4] } },
      });
      sql = builder.toQuery();
      assert.equal(
        sql,
        'select * from "testVonaPost" where "id" in (1, 2) and 1 = 0 and ((("id" in (2, 3))) or (("iid" not in (3, 4))))',
      );
      // op: null/notNull
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        id: { _is_: null },
        iid: { _isNot_: null },
      });
      sql = builder.toQuery();
      assert.equal(
        sql,
        'select * from "testVonaPost" where ("id" is null) and ("iid" is not null)',
      );
      // op: between/notBetween
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        id: { _between_: [1, 3] },
        iid: { _notBetween_: [2, 4] },
      });
      sql = builder.toQuery();
      assert.equal(
        sql,
        'select * from "testVonaPost" where ("id" between 1 and 3) and ("iid" not between 2 and 4)',
      );
      // op: ref
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        iid: { _ref_: 'id' },
      });
      sql = builder.toQuery();
      assert.equal(sql, 'select * from "testVonaPost" where ("iid" = "id")');
      // op: gt/gte/lt/lte
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        id: { _gt_: 1, _gte_: 2, _lt_: 3, _lte_: 4 },
      });
      sql = builder.toQuery();
      assert.equal(
        sql,
        'select * from "testVonaPost" where ("id" > 1 and "id" >= 2 and "id" < 3 and "id" <= 4)',
      );
      // op: startsWith/endsWith/includes
      builder = scopeTest.model.post.builder();
      scopeTest.model.post.buildWhere(builder, {
        title: { _startsWith_: 'a', _endsWith_: 'b', _includes_: 'c' },
      });
      sql = builder.toQuery();
      assert.equal(
        sql,
        'select * from "testVonaPost" where ("title" like \'a%\' and "title" like \'%b\' and "title" like \'%c%\')',
      );
    });
  });
});
