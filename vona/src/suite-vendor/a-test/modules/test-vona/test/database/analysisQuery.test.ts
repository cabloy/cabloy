import type {
  OpenAPIObject,
  ParameterObject,
  ReferenceObject,
  SchemaObject,
} from 'openapi3-ts/oas31';
import type { TableIdentity } from 'table-identity';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';
import type { TypeAnalysisAggregateParams } from 'vona-module-a-orm';
import type z from 'zod';

import { ZodMetadata } from '@cabloy/zod-openapi';
import { OpenApiGeneratorV31, OpenAPIRegistry } from '@cabloy/zod-to-openapi';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $makeSchema, $schema, v } from 'vona-module-a-openapiutils';
import {
  $defineAnalysis,
  $executeAnalysisAggregate,
  $executeAnalysisGroup,
} from 'vona-module-a-orm';
import { prepareAnalysisFilter } from 'vona-module-a-web';

import { ControllerPost } from '../../src/controller/post.ts';
import { DtoPostAggregate } from '../../src/dto/postAggregate.ts';
import { DtoPostGroup } from '../../src/dto/postGroup.ts';
import { DtoPostSelectReq } from '../../src/dto/postSelectReq.ts';
import { postAnalysis } from '../../src/lib/postAnalysis.ts';
import { ModelPost } from '../../src/model/post.ts';
import { ModelUser } from '../../src/model/user.ts';

const is422 = (error: { code?: number }) => error.code === 422;

async function readPost(
  action: 'group' | 'aggregate' | 'findMany' | 'findManyEcho',
  query: Record<string, unknown>,
) {
  return await app.bean.executor.performAction('get', `/test/vona/post/${action}`, { query });
}

describe('analysisQuery.test.ts', { concurrency: false }, () => {
  it('emits separate action schemas with public finite capabilities regardless of registration order', async () => {
    await app.bean.executor.mockCtx(async () => {
      const base = $schema(DtoPostSelectReq);
      const baseRef = ZodMetadata.getRefId(base);
      assert.ok(baseRef);
      const baseObject = ZodMetadata.unwrapChained(base) as z.ZodObject;
      const originalFields = Object.keys(baseObject.shape);
      const originalMetadata = ZodMetadata.getOpenapiMetadata(base);
      const select = prepareAnalysisFilter(DtoPostSelectReq);
      const group = prepareAnalysisFilter(DtoPostSelectReq, { mode: 'group' });
      const aggregate = prepareAnalysisFilter(DtoPostSelectReq, { mode: 'aggregate' });
      assert.equal(ZodMetadata.getRefId(select.schema), `${baseRef}_select`);
      assert.deepEqual(
        Object.keys((select.schema as z.ZodObject).shape).sort(),
        originalFields.toSorted(),
      );
      for (const control of ['columns', 'joins', 'include', 'limit', 'offset']) {
        assert.equal(ZodMetadata.getFieldSchema(select.schema, control), undefined);
      }
      for (const schema of [group.schema, aggregate.schema]) {
        for (const control of ['columns', 'orders', 'pageNo', 'pageSize']) {
          assert.equal(ZodMetadata.getFieldSchema(schema, control), undefined);
        }
      }
      assert.deepEqual(group.analysis, postAnalysis);
      assert.equal(group.analysisMode, 'group');
      assert.equal(aggregate.analysisMode, 'aggregate');
      assert.equal(ZodMetadata.getRefId(group.schema), `${baseRef}_group`);
      assert.equal(ZodMetadata.getRefId(aggregate.schema), `${baseRef}_aggregate`);
      assert.equal(ZodMetadata.getFieldSchema(base, 'groups'), undefined);
      assert.equal(ZodMetadata.getFieldSchema(base, 'aggrs'), undefined);
      const groupDefaults = (group.schema as z.ZodObject).parse({});
      assert.deepEqual(groupDefaults.groups, ['userId']);
      assert.deepEqual(groupDefaults.aggrs, { count: ['*'], sum: ['stars'] });
      assert.deepEqual(
        (aggregate.schema as z.ZodObject).parse({}).aggrs,
        postAnalysis.defaults.aggregate?.aggrs,
      );
      assert.equal(group.schema.safeParse({ groups: ['stars'] }).success, false);
      assert.equal(group.schema.safeParse({ aggrs: { sum: ['title'] } }).success, false);
      const expectedCapabilities = {
        group: {
          mode: 'group',
          groups: ['title', 'userId'],
          aggrs: postAnalysis.aggrs,
          defaults: postAnalysis.defaults.group,
          limits: { maxGroups: 3, maxMetrics: 10, maxGroupRows: 1000 },
        },
        aggregate: {
          mode: 'aggregate',
          groups: [],
          aggrs: postAnalysis.aggrs,
          defaults: postAnalysis.defaults.aggregate,
          limits: { maxGroups: 3, maxMetrics: 10, maxGroupRows: 1000 },
        },
      };
      const resolve = (
        document: OpenAPIObject,
        schema: SchemaObject | ReferenceObject | undefined,
      ): SchemaObject & ISchemaObjectExtensionField => {
        assert.ok(schema);
        if (schema.$ref) {
          const component = document.components?.schemas?.[schema.$ref.split('/').at(-1)!];
          return resolve(document, component);
        }
        return schema as SchemaObject & ISchemaObjectExtensionField;
      };
      const assertAnalysis = (
        document: OpenAPIObject,
        schema: SchemaObject | ReferenceObject | undefined,
        mode: 'group' | 'aggregate',
      ) => {
        const object = resolve(document, schema);
        assert.deepEqual(object.filter?.capabilities?.analysis, expectedCapabilities[mode]);
        const aggrs = resolve(document, object.properties?.aggrs);
        assert.deepEqual(aggrs.default, postAnalysis.defaults[mode]?.aggrs);
        assert.deepEqual(Object.keys(aggrs.properties ?? {}).sort(), [
          'avg',
          'count',
          'max',
          'min',
          'sum',
        ]);
        for (const [fn, columns] of Object.entries(postAnalysis.aggrs)) {
          const metric = resolve(document, aggrs.properties?.[fn]);
          const items = resolve(document, metric.items as SchemaObject | ReferenceObject);
          assert.deepEqual(items.enum, columns);
        }
        assert.equal(aggrs.additionalProperties, false);
        if (mode === 'group') {
          const groups = resolve(document, object.properties?.groups);
          assert.deepEqual(groups.default, ['userId']);
          assert.deepEqual(resolve(document, groups.items as SchemaObject | ReferenceObject).enum, [
            'title',
            'userId',
          ]);
        } else {
          assert.equal(object.properties?.groups, undefined);
        }
      };
      const schemas = { select: select.schema, group: group.schema, aggregate: aggregate.schema };
      for (const order of [
        ['select', 'group', 'aggregate'],
        ['aggregate', 'group', 'select'],
      ] as const) {
        const registry = new OpenAPIRegistry();
        for (const mode of order) {
          registry.register(
            ZodMetadata.getRefId(schemas[mode] as z.ZodType)!,
            schemas[mode] as z.ZodType,
          );
        }
        const document = new OpenApiGeneratorV31(registry.definitions).generateDocument({
          openapi: '3.1.0',
          info: { title: 'Analysis schemas', version: '1.0.0' },
        });
        const components = document.components!.schemas!;
        const selectSchema = resolve(document, components[`${baseRef}_select`]);
        assert.equal(selectSchema.properties?.groups, undefined);
        assert.equal(selectSchema.properties?.aggrs, undefined);
        assert.deepEqual(
          Object.keys(selectSchema.properties ?? {}).sort(),
          originalFields.toSorted(),
        );
        assertAnalysis(document, components[`${baseRef}_group`], 'group');
        assertAnalysis(document, components[`${baseRef}_aggregate`], 'aggregate');
      }

      for (const action of ['findMany', 'group', 'aggregate'] as const) {
        const document = await app.bean.openapi.generateJsonOfControllerAction(
          ControllerPost,
          action,
          'V31',
        );
        const operation = Object.values(document.paths ?? {}).find(path => path?.get)?.get;
        assert.ok(operation);
        const parameters = (operation.parameters ?? []).filter(
          (parameter): parameter is ParameterObject => !('$ref' in parameter),
        );
        assert.equal(
          parameters.some(parameter => parameter.name === 'groups'),
          action === 'group',
        );
        assert.equal(
          parameters.some(parameter => parameter.name === 'aggrs'),
          action !== 'findMany',
        );
        for (const name of action === 'group'
          ? ['groups', 'aggrs']
          : action === 'aggregate'
            ? ['aggrs']
            : []) {
          const parameter = parameters.find(parameter => parameter.name === name);
          assert.ok(parameter);
          assert.equal(parameter.in, 'query');
          const schema = resolve(document, parameter.schema);
          assert.deepEqual(schema.filter, {
            capabilities: { analysis: expectedCapabilities[action as 'group' | 'aggregate'] },
          });
        }
        const serialized = JSON.stringify(document);
        for (const internal of [
          'modelLike',
          'modelClass',
          'joinOn',
          'testVonaPost',
          'testVonaUser',
        ]) {
          assert.equal(serialized.includes(`\"${internal}\"`), false, internal);
        }
      }
      // Register the actual controller actions together in both orders, rather than only
      // generating each operation in isolation (the shared-ref collision regression).
      for (const order of [
        ['findMany', 'group', 'aggregate'],
        ['aggregate', 'group', 'findMany'],
      ] as const) {
        const registry = new OpenAPIRegistry();
        for (const action of order) {
          app
            .scope('a-openapi')
            .service.openapi.collectController(registry, 'test-vona', ControllerPost, action);
        }
        const document = new OpenApiGeneratorV31(registry.definitions).generateDocument({
          openapi: '3.1.0',
          info: { title: 'Analysis actions', version: '1.0.0' },
        });
        app.scope('a-openapi').service.openapi.translate(document, 'rest');
        for (const action of ['findMany', 'group', 'aggregate'] as const) {
          const path = app.util.combineApiPathControllerAndAction(
            'test-vona',
            'post',
            action,
            true,
            true,
          );
          const operation = document.paths?.[path]?.get;
          assert.ok(operation, `Missing emitted operation: ${path}`);
          const parameters = (operation.parameters ?? []).filter(
            (parameter): parameter is ParameterObject => !('$ref' in parameter),
          );
          assert.equal(
            parameters.some(parameter => parameter.name === 'groups'),
            action === 'group',
          );
          assert.equal(
            parameters.some(parameter => parameter.name === 'aggrs'),
            action !== 'findMany',
          );
        }
      }
      assert.deepEqual(Object.keys(baseObject.shape), originalFields);
      assert.deepEqual(ZodMetadata.getOpenapiMetadata(base), originalMetadata);
    });
  });

  it('executes requested combinations, preserves defaults and rejects unsupported query controls', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('test-vona');
      const prefix = `analysisQuery:${randomUUID()}`;
      const userIds: TableIdentity[] = [];
      const where = { title: { _startsWith_: prefix } };
      const internalQuery = { where };
      const query = { where: { field: 'title', op: 'startsWith', value: prefix } };
      const jwt = await app.bean.passport.signinMock();
      try {
        for (const suffix of ['one', 'two']) {
          const user = await scope.model.user.insert({ name: `${prefix}:${suffix}` });
          userIds.push(user.id);
        }
        await scope.model.post.insertBulk([
          { title: `${prefix}:a`, userId: userIds[0], stars: 2 },
          { title: `${prefix}:a`, userId: userIds[0], stars: 4 },
          { title: `${prefix}:a`, userId: userIds[1] },
          { title: `${prefix}:b`, userId: userIds[1], stars: 8 },
        ]);
        const defaults = [
          { userId: userIds[0], count_all: '2', sum_stars: '6' },
          { userId: userIds[1], count_all: '2', sum_stars: '8' },
        ];
        assert.deepEqual(await readPost('group', query), defaults);
        assert.deepEqual(
          await $executeAnalysisGroup(scope.model.post, postAnalysis, internalQuery),
          defaults,
        );
        const aggregate = await readPost('aggregate', query);
        assert.deepEqual(Object.keys(aggregate).sort(), [
          'avg_stars',
          'count_all',
          'count_stars',
          'max_stars',
          'min_stars',
          'sum_stars',
        ]);
        assert.equal(aggregate.count_all, '4');
        assert.equal(aggregate.count_stars, '3');
        assert.equal(aggregate.sum_stars, '14');
        assert.equal(typeof aggregate.avg_stars, 'string');
        assert.ok(Math.abs(Number(aggregate.avg_stars) - 14 / 3) < 0.0001);
        assert.equal(aggregate.min_stars, '2');
        assert.equal(aggregate.max_stars, '8');
        assert.deepEqual(
          await $executeAnalysisAggregate(scope.model.post, postAnalysis, internalQuery),
          aggregate,
        );
        assert.deepEqual(await $schema(DtoPostAggregate).parseAsync(aggregate), aggregate);

        const multidimensional = await readPost('group', {
          ...query,
          groups: ['title', 'userId'],
          aggrs: { count: ['stars'], avg: ['stars'] },
        });
        assert.deepEqual(
          multidimensional.map((row: { avg_stars: string | null }) => ({
            ...row,
            avg_stars: row.avg_stars === null ? null : Number(row.avg_stars),
          })),
          [
            { title: `${prefix}:a`, userId: userIds[0], count_stars: '2', avg_stars: 3 },
            { title: `${prefix}:a`, userId: userIds[1], count_stars: '0', avg_stars: null },
            { title: `${prefix}:b`, userId: userIds[1], count_stars: '1', avg_stars: 8 },
          ],
        );
        for (const row of multidimensional) {
          if (row.avg_stars !== null) assert.equal(typeof row.avg_stars, 'string');
          const parsed = await $schema(DtoPostGroup).parseAsync(row);
          // TableIdentity follows the configured public identity representation, which
          // can be a decimal string even when this SQL driver returns numeric IDs.
          assert.equal(String(parsed.userId), String(row.userId));
          assert.deepEqual({ ...parsed, userId: row.userId }, row);
        }
        // A supplied dimension does not discard metric defaults, and vice versa.
        assert.deepEqual(await readPost('group', { ...query, groups: ['title'] }), [
          { title: `${prefix}:a`, count_all: '3', sum_stars: '6' },
          { title: `${prefix}:b`, count_all: '1', sum_stars: '8' },
        ]);
        assert.deepEqual(await readPost('group', { ...query, aggrs: { count: ['*'] } }), [
          { userId: userIds[0], count_all: '2' },
          { userId: userIds[1], count_all: '2' },
        ]);
        assert.deepEqual(await readPost('aggregate', { ...query, aggrs: { max: ['stars'] } }), {
          max_stars: '8',
        });
        assert.deepEqual(await $schema(DtoPostGroup).parseAsync({ count_all: '1' }), {
          count_all: '1',
        });

        // Analysis has no public list projection, ordering or pagination controls.
        for (const action of ['group', 'aggregate'] as const) {
          for (const invalid of [
            { columns: ['title'] },
            { orders: [{ field: 'title', direction: 'desc' }] },
            { pageNo: 2 },
            { pageSize: 1 },
            { pageSize: 0 },
            { pageNo: 0 },
          ]) {
            await assert.rejects(() => readPost(action, { ...query, ...invalid }), is422);
          }
        }
        const list = await readPost('findMany', { ...query, pageSize: 1 });
        assert.equal(list.total, '4');
        assert.equal(list.list.length, 1);
        assert.equal(Object.hasOwn(list.list[0], 'count_all'), false);

        // DTO-authored joined filters select main records for both lists and analysis.
        const joined = { ...query, userName: `${prefix}:one` };
        const selected = await readPost('findMany', joined);
        assert.equal(selected.total, '2');
        assert.equal(
          selected.list.every((row: { userId: TableIdentity }) => row.userId === userIds[0]),
          true,
        );
        const echo = await readPost('findManyEcho', joined);
        assert.deepEqual(echo, {
          where: {
            and: [query.where, { field: 'userName', op: 'eqI', value: `${prefix}:one` }],
          },
        });
        assert.deepEqual(await readPost('group', joined), [defaults[0]]);
        const joinedAggregate = await readPost('aggregate', joined);
        assert.equal(joinedAggregate.count_all, '2');
        assert.equal(joinedAggregate.sum_stars, '6');
        assert.equal(Number(joinedAggregate.avg_stars), 3);
        for (const action of ['group', 'aggregate'] as const) {
          await assert.rejects(
            () => readPost(action, { ...query, orders: [{ field: 'userName', direction: 'asc' }] }),
            is422,
          );
          const internalJoins = [['innerJoin', 'testVonaUser', ['userId', 'testVonaUser.id']]];
          for (const joins of [[], internalJoins, JSON.stringify(internalJoins)]) {
            await assert.rejects(() => readPost(action, { ...joined, joins }), is422);
          }
        }

        for (const invalid of [
          { groups: [] },
          { groups: ['title', 'title'] },
          { groups: ['stars'] },
          { groups: ['user.name'] },
          { groups: ['testVonaPost.title'] },
          { aggrs: {} },
          { aggrs: { count: [] } },
          { aggrs: { count: ['*', '*'] } },
          { aggrs: { count: ['userId'] } },
          { aggrs: { sum: ['title'] } },
          { aggrs: { median: ['stars'] } },
        ]) {
          await assert.rejects(() => readPost('group', { ...query, ...invalid }), is422);
          await assert.rejects(
            () =>
              $executeAnalysisGroup(scope.model.post, postAnalysis, {
                ...internalQuery,
                ...invalid,
              } as never),
            is422,
          );
        }
        for (const invalid of [
          { groups: [] },
          { groups: ['title'] },
          { aggrs: {} },
          { aggrs: { avg: ['title'] } },
        ]) {
          await assert.rejects(() => readPost('aggregate', { ...query, ...invalid }), is422);
          await assert.rejects(
            () =>
              $executeAnalysisAggregate(scope.model.post, postAnalysis, {
                ...internalQuery,
                ...invalid,
              } as never),
            is422,
          );
        }
        for (const invalid of [{ groups: ['title'] }, { aggrs: { count: ['*'] } }]) {
          await assert.rejects(() => readPost('findMany', { ...query, ...invalid }), is422);
        }
        for (const invalid of [{ having: { stars: { _gt_: 0 } } }, { include: { user: true } }]) {
          await assert.rejects(
            () =>
              $executeAnalysisGroup(scope.model.post, postAnalysis, {
                ...internalQuery,
                ...invalid,
              } as never),
            is422,
          );
          await assert.rejects(
            () =>
              $executeAnalysisAggregate(scope.model.post, postAnalysis, {
                ...internalQuery,
                ...invalid,
              } as never),
            is422,
          );
        }

        // Real HTTP query values use the same JSON convention as combineQueries.
        for (const [action, controls, expected] of [
          [
            'group',
            { groups: ['title'], aggrs: { count: ['*'] } },
            [
              { title: `${prefix}:a`, count_all: '3' },
              { title: `${prefix}:b`, count_all: '1' },
            ],
          ],
          ['aggregate', { aggrs: { sum: ['stars'] } }, { sum_stars: '14' }],
          ['group', { userName: `${prefix}:one` }, [defaults[0]]],
          ['aggregate', { userName: `${prefix}:one` }, joinedAggregate],
        ] as const) {
          const url = new URL(app.util.getAbsoluteUrlByApiPath(`/test/vona/post/${action}`));
          url.searchParams.set('where', JSON.stringify(query.where));
          for (const [key, value] of Object.entries(controls))
            url.searchParams.set(key, typeof value === 'string' ? value : JSON.stringify(value));
          const response = await fetch(url, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${jwt.accessToken}` },
          });
          assert.equal(response.status, 200);
          const body = await response.json();
          assert.equal(body.code, 0, JSON.stringify(body));
          assert.deepEqual(body.data, expected);
        }

        // A server policy override proves the cap without changing persisted/module configuration.
        const capped = $defineAnalysis(() => ModelPost, {
          groups: postAnalysis.groups,
          aggrs: postAnalysis.aggrs,
          defaults: {
            group: { groups: ['userId'], aggrs: { count: ['*'] } },
            aggregate: { aggrs: { count: ['*'] } },
          },
          limits: { maxGroups: 1, maxMetrics: 1, maxGroupRows: 2 },
        });
        assert.deepEqual(await $executeAnalysisGroup(scope.model.post, capped, internalQuery), [
          { userId: userIds[0], count_all: '2' },
          { userId: userIds[1], count_all: '2' },
        ]);
        for (const invalid of [
          { groups: ['title', 'userId'] },
          { aggrs: { count: ['*', 'stars'] } },
        ]) {
          await assert.rejects(
            () =>
              $executeAnalysisGroup(scope.model.post, capped, {
                ...internalQuery,
                ...invalid,
              } as never),
            is422,
          );
        }
        const oneRow = $defineAnalysis(() => ModelPost, {
          groups: postAnalysis.groups,
          aggrs: postAnalysis.aggrs,
          defaults: {
            group: { groups: ['userId'], aggrs: { count: ['*'], sum: ['stars'] } },
          },
          limits: { maxGroupRows: 1 },
        });
        await assert.rejects(
          () => $executeAnalysisGroup(scope.model.post, oneRow, internalQuery),
          is422,
        );
        assert.deepEqual(
          await $executeAnalysisGroup(scope.model.post, oneRow, {
            where: { title: `${prefix}:b` },
          }),
          [{ userId: userIds[1], count_all: '1', sum_stars: '8' }],
        );
        await assert.rejects(
          () =>
            $executeAnalysisAggregate(scope.model.post, capped, {
              ...internalQuery,
              aggrs: { sum: ['stars'], max: ['stars'] },
            }),
          is422,
        );

        for (const [emptyWhere, count] of [
          [
            {
              and: [
                { field: 'title', op: 'eq', value: `${prefix}:a` },
                {
                  field: 'userId',
                  op: 'eq',
                  value: $makeSchema(v.tableIdentity()).parse(userIds[1]),
                },
              ],
            },
            '1',
          ],
          [{ field: 'title', op: 'eq', value: `${prefix}:absent` }, '0'],
        ] as const) {
          assert.deepEqual(await readPost('aggregate', { where: emptyWhere }), {
            count_all: count,
            count_stars: '0',
            sum_stars: null,
            avg_stars: null,
            min_stars: null,
            max_stars: null,
          });
        }
        assert.deepEqual(
          await readPost('group', {
            where: { field: 'title', op: 'eq', value: `${prefix}:absent` },
          }),
          [],
        );
        // Warmed results remain ORM-owned and refresh after source mutations.
        assert.deepEqual(await readPost('group', query), defaults);
        await scope.model.post.update({ stars: 10 }, { where: { title: `${prefix}:b` } });
        assert.deepEqual(await readPost('aggregate', { ...query, aggrs: { sum: ['stars'] } }), {
          sum_stars: '16',
        });
      } finally {
        try {
          await scope.model.post.delete(where);
          for (const id of userIds.toReversed()) await scope.model.user.deleteById(id);
        } finally {
          await app.bean.passport.signout();
        }
      }
    });
  });

  it('preserves main-record metrics, Boolean predicates and scope through joined membership', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('test-vona');
      const prefix = `analysis-joins:${randomUUID()}`;
      const userIds: TableIdentity[] = [];
      const postIds: TableIdentity[] = [];
      const policy = $defineAnalysis(() => ModelUser, {
        groups: ['age'],
        aggrs: { count: ['*'], sum: ['scores'], avg: ['scores'] },
        defaults: {
          group: { groups: ['age'], aggrs: { count: ['*'], sum: ['scores'] } },
          aggregate: { aggrs: { count: ['*'], sum: ['scores'], avg: ['scores'] } },
        },
      });
      const joins: TypeAnalysisAggregateParams<typeof policy>['joins'] = [
        ['innerJoin', 'testVonaPost', ['testVonaUser.id', 'testVonaPost.userId']],
      ];
      try {
        for (const [name, scores] of [
          ['one', 10],
          ['two', 10],
          ['empty', 40],
          ['deleted', 100],
          ['other', 100],
        ] as const) {
          const user = await scope.model.user.insert({
            name: `${prefix}:${name}`,
            age: 20,
            scores,
          });
          userIds.push(user.id);
        }
        for (const [index, title, stars] of [
          [0, 'match', 1],
          [0, 'match', 2],
          [1, 'match', 3],
          [1, 'other', 9],
          [3, 'match', 100],
          [4, 'match', 100],
        ] as const) {
          const post = await scope.model.post.insert({
            userId: userIds[index],
            title: `${prefix}:${title}`,
            stars,
          });
          postIds.push(post.id);
        }
        // Raw updates create test-owned excluded records without altering shared instance state.
        await scope.model.user.builder().where('id', userIds[3]).update({ deleted: true });
        await scope.model.user.builder().where('id', userIds[4]).update({ iid: 0 });
        const params = {
          where: { 'id': userIds, 'testVonaPost.title': `${prefix}:match` },
          joins,
        };
        const original = structuredClone(params);
        const result = await $executeAnalysisAggregate(scope.model.user, policy, params);
        assert.equal(result.count_all, '2');
        assert.equal(result.sum_scores, '20');
        assert.equal(Number(result.avg_scores), 10);
        assert.deepEqual(await $executeAnalysisGroup(scope.model.user, policy, params), [
          { age: 20, count_all: '2', sum_scores: '20' },
        ]);
        assert.deepEqual(params, original);
        assert.deepEqual(await $executeAnalysisAggregate(scope.model.user, policy, params), result);

        // Both joined conditions must match the same child row, not independent EXISTS.
        const sameChild = await $executeAnalysisAggregate(scope.model.user, policy, {
          ...params,
          where: { ...params.where, 'testVonaPost.stars': 9 },
        });
        assert.equal(sameChild.count_all, '0');
        assert.equal(sameChild.sum_scores, null);

        const leftJoins: typeof joins = [
          ['leftJoin', 'testVonaPost', ['testVonaUser.id', 'testVonaPost.userId']],
        ];
        const mixed = await $executeAnalysisAggregate(scope.model.user, policy, {
          joins: leftJoins,
          where: {
            id: userIds,
            _or_: { 'name': `${prefix}:empty`, 'testVonaPost.title': `${prefix}:match` },
          },
        });
        assert.equal(mixed.count_all, '3');
        assert.equal(mixed.sum_scores, '60');
        assert.equal(Number(mixed.avg_scores), 20);
        const absent = await $executeAnalysisAggregate(scope.model.user, policy, {
          joins: leftJoins,
          where: { 'id': userIds, 'testVonaPost.id': null },
        });
        assert.equal(absent.count_all, '1');
        assert.equal(absent.sum_scores, '40');

        // Numbered logical branches qualify main columns without touching their operands.
        const nested = await $executeAnalysisAggregate(scope.model.user, policy, {
          joins,
          where: {
            _and_: { id: userIds },
            _or_1: { 'name': `${prefix}:one`, 'testVonaPost.stars': 3 },
            _not_: { name: `${prefix}:deleted` },
          } as never,
        });
        assert.equal(nested.count_all, '2');
        assert.equal(nested.sum_scores, '20');

        const dynamic = scope.model.user.newInstance(undefined, (_ctx, where) =>
          Object.hasOwn(where ?? {}, 'name') ? 'testVonaUser' : 'testVonaPost',
        );
        await assert.rejects(
          () =>
            $executeAnalysisAggregate(dynamic, policy, { joins, where: { name: `${prefix}:one` } }),
          is422,
        );
      } finally {
        try {
          if (postIds.length) await scope.model.post.builder().whereIn('id', postIds).delete();
        } finally {
          if (userIds.length) await scope.model.user.builder().whereIn('id', userIds).delete();
        }
      }
    });
  });

  it('rejects invalid server policies before SQL execution', async () => {
    const valid = {
      groups: ['title'],
      aggrs: { count: ['*'] },
      defaults: { group: { groups: ['title'], aggrs: { count: ['*'] } } },
    };
    for (const config of [
      { ...valid, groups: ['title', 'title'] },
      { ...valid, groups: ['groups'] },
      { ...valid, groups: ['user.name'] },
      { ...valid, groups: ['testVonaPost.title'] },
      { ...valid, aggrs: { count: ['*', '*'] } },
      { ...valid, aggrs: { sum: ['title'] } },
      { ...valid, defaults: { group: { groups: ['userId'], aggrs: { count: ['*'] } } } },
      { ...valid, defaults: { group: { groups: ['title'], aggrs: { sum: ['stars'] } } } },
      { ...valid, limits: { maxGroupRows: 0 } },
    ]) {
      assert.throws(() => $defineAnalysis(() => ModelPost, config as never), TypeError);
    }
  });
});
