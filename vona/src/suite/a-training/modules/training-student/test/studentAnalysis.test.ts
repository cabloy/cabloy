import type { TableIdentity } from 'table-identity';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';
import type { TypeQueryPredicate } from 'vona-module-a-orm';
import type { IPassport } from 'vona-module-a-user';

import { ZodMetadata } from '@cabloy/zod-openapi';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $schema } from 'vona-module-a-openapiutils';
import { getRbacDecision } from 'vona-module-a-rbac';
import { prepareAnalysisFilter } from 'vona-module-a-web';
import { controllerToolQuery } from 'vona-module-cabloy-mcp';

import { DtoStudentAggregateRes } from '../src/dto/studentAggregateRes.tsx';
import { DtoStudentGroupResItem } from '../src/dto/studentGroupResItem.tsx';
import { DtoStudentSelectReq, studentQuery } from '../src/dto/studentSelectReq.tsx';

type StudentGroup = { level: number; count_all: string };
type StudentAggregate = { count_all: string; count_imageId: string };

async function dropStudents(ids: TableIdentity[]) {
  const student = app.scope('training-student');
  for (const id of ids.toReversed()) {
    await student.model.studentContent.delete({ studentId: id }, { disableDeleted: true });
    await student.model.student.deleteById(id, { disableDeleted: true });
  }
}

async function readAnalysis(query: Record<string, unknown>) {
  const groups: StudentGroup[] = await app.bean.executor.performAction(
    'get',
    '/training/student/group',
    { query },
  );
  const aggregate: StudentAggregate = await app.bean.executor.performAction(
    'get',
    '/training/student/aggregate',
    { query },
  );
  return {
    groups: groups.sort((a, b) => a.level - b.level),
    aggregate,
  };
}

describe('studentAnalysis.test.ts', { concurrency: false }, () => {
  it('emits public query controls and optional analysis response field supersets', async () => {
    await app.bean.executor.mockCtx(async () => {
      const request = $schema(DtoStudentSelectReq);
      const requestMetadata = ZodMetadata.getOpenapiMetadata(
        prepareAnalysisFilter(DtoStudentSelectReq).schema,
      ) as ISchemaObjectExtensionField | undefined;
      assert.deepEqual(requestMetadata?.filter?.capabilities?.query?.orderable, [
        'id',
        'name',
        'level',
        'createdAt',
      ]);
      assert.equal(request.safeParse({}).success, true);
      assert.equal(
        request.safeParse({ name: 'Student', level: 2, createdAt: '2026-03-10~2026-03-10' })
          .success,
        true,
      );
      assert.equal(
        request.safeParse({
          where: { field: 'level', op: 'gte', value: 2 },
          orders: [{ field: 'level', direction: 'desc' }],
          pageNo: 2,
          pageSize: 1,
        }).success,
        true,
      );
      assert.equal(request.safeParse({ pageSize: 0 }).success, false);
      const relation = requestMetadata?.filter?.capabilities?.query?.relations?.trainingRecords;
      const relationPolicy = studentQuery.relations?.trainingRecords;
      assert.equal(relationPolicy?.authorizationRequired, true);
      assert.ok(relation?.title && relation.description);
      assert.ok(relationPolicy?.title && relationPolicy.description);
      assert.equal(app.meta.text(relation.title), app.meta.text(relationPolicy.title));
      assert.equal(app.meta.text(relation.description), app.meta.text(relationPolicy.description));
      assert.deepEqual(relation?.operators, ['exists', 'notExists']);
      assert.deepEqual(Object.keys(relation?.fields ?? {}).sort(), [
        'averageScore',
        'createdAt',
        'name',
        'subjectCount',
        'totalScore',
        'trainingTime',
      ]);
      assert.equal(
        request.safeParse({
          where: {
            relation: 'trainingRecords',
            op: 'exists',
            where: { field: 'totalScore', op: 'gte', value: 80 },
          },
        }).success,
        true,
      );
      for (const where of [
        {
          relation: 'trainingRecords',
          op: 'exists',
          where: { field: 'studentName', op: 'eq', value: 'hidden' },
        },
        {
          relation: 'trainingRecords',
          op: 'exists',
          where: { field: 'name', op: 'startsWith', value: 'hidden' },
        },
        { relation: 'trainingRecords', op: 'exists', where: { relation: 'student', op: 'exists' } },
      ]) {
        assert.equal(request.safeParse({ where }).success, false);
      }
      // Filter transforms belong to runtime schema metadata; public OpenAPI strips them.
      const createdAtSchema = ZodMetadata.getFieldSchema(request, 'createdAt');
      assert.ok(createdAtSchema);
      const createdAtMetadata = ZodMetadata.getOpenapiMetadata(createdAtSchema) as
        | ISchemaObjectExtensionField
        | undefined;
      assert.equal(createdAtMetadata?.filter?.transform?.[0], 'a-web:dateRange');
      for (const [DtoClass, expectedFields] of [
        [
          DtoStudentSelectReq,
          ['createdAt', 'level', 'name', 'orders', 'pageNo', 'pageSize', 'where'],
        ],
        [DtoStudentGroupResItem, ['count_all', 'count_imageId', 'level']],
        [DtoStudentAggregateRes, ['count_all', 'count_imageId']],
      ] as const) {
        const document = await app.bean.openapi.generateJsonOfClass(DtoClass, 'V31');
        const component = Object.values(document.components!.schemas!).find(
          item => !('$ref' in item) && Object.hasOwn(item.properties ?? {}, expectedFields[0]),
        );
        assert.ok(component && !('$ref' in component));
        assert.deepEqual(Object.keys(component.properties ?? {}).sort(), [...expectedFields]);
        if (DtoClass === DtoStudentSelectReq) {
          const published = controllerToolQuery(
            component,
            document.components!.schemas!,
            [{ type: 'query', query: studentQuery }],
            true,
          );
          const publishedRelation =
            published.bindings[0].capabilities.query.relations.trainingRecords;
          assert.deepEqual(Object.keys(publishedRelation).sort(), [
            'description',
            'fields',
            'operators',
            'title',
          ]);
          assert.deepEqual(publishedRelation, JSON.parse(JSON.stringify(relation)));
          for (const privateName of [
            'authorizationRequired',
            'relationScopes',
            'modelLike',
            'modelClass',
            'entityClass',
            'training-record.controller.record',
          ]) {
            assert.equal(JSON.stringify(document).includes(privateName), false);
            assert.equal(JSON.stringify(published).includes(privateName), false);
          }
        }
        for (const field of expectedFields.filter(field => field.startsWith('count_'))) {
          const schema = component.properties![field];
          assert.ok(schema && !('$ref' in schema));
          // v.optional() emits a nullable string in the V31 schema dialect.
          assert.deepEqual(schema.type, ['string', 'null']);
        }
      }
      assert.deepEqual($schema(DtoStudentGroupResItem).parse({ count_imageId: '1' }), {
        count_imageId: '1',
      });
      assert.deepEqual($schema(DtoStudentGroupResItem).parse({ level: 2, count_all: '3' }), {
        level: 2,
        count_all: '3',
      });
      assert.deepEqual(
        $schema(DtoStudentAggregateRes).parse({ count_all: '3', count_imageId: '1' }),
        { count_all: '3', count_imageId: '1' },
      );
    });
  });

  it('filters real API results and refreshes warmed counts after create, update and soft delete', async () => {
    await app.bean.executor.mockCtx(async () => {
      const jwt = await app.bean.passport.signinMock();
      const ids: TableIdentity[] = [];
      const name = `Analysis-${randomUUID()}`;
      let imageId: TableIdentity | undefined;
      let directory: string | undefined;
      const student = app.scope('training-student');
      try {
        const empty = {
          groups: [],
          aggregate: { count_all: '0', count_imageId: '0' },
        };
        assert.deepEqual(await readAnalysis({ name }), empty);
        directory = await mkdtemp(path.join(os.tmpdir(), 'student-analysis-'));
        const file = path.join(directory, 'student.png');
        await writeFile(
          file,
          Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFAAH/e+m+7wAAAABJRU5ErkJggg==',
            'base64',
          ),
        );
        const image = await app.bean.image.upload(
          'image-native:native',
          { file, filename: 'student.png', contentType: 'image/png' },
          { imageScene: 'training-student:studentImage' },
        );
        imageId = image.id;
        for (const [index, level] of [1, 1, 2].entries()) {
          const id = await app.bean.executor.performAction('post', '/training/student', {
            body: {
              name: `${name}-${index}`,
              mobile: '13812345678',
              level,
              ...(index === 0 ? { imageId } : {}),
            },
          });
          ids.push(id);
          await student.model.student.updateById(id, {
            createdAt: new Date(index === 2 ? '2026-03-11T12:00:00Z' : '2026-03-10T12:00:00Z'),
          });
        }
        const initial = {
          groups: [
            { level: 1, count_all: '2' },
            { level: 2, count_all: '1' },
          ],
          aggregate: { count_all: '3', count_imageId: '1' },
        };
        assert.deepEqual(await readAnalysis({ name }), initial);
        assert.deepEqual(await readAnalysis({ name }), initial);
        assert.deepEqual(
          await app.bean.executor.performAction('get', '/training/student/group', {
            query: { name, aggrs: { count: ['imageId'] } },
          }),
          [
            { level: 1, count_imageId: '1' },
            { level: 2, count_imageId: '0' },
          ],
        );
        assert.deepEqual(
          await student.service.student.group({
            where: { name: { _startsWith_: name } },
            groups: ['level'],
          }),
          initial.groups,
        );
        assert.deepEqual(
          await student.service.student.aggregate({
            where: { name: { _startsWith_: name } },
            aggrs: { count: ['imageId'] },
          }),
          { count_imageId: '1' },
        );
        const internalSelected = await student.service.student.select({
          where: { name: { _startsWith_: name } },
          orders: [['createdAt', 'desc']],
          limit: 1,
          offset: 1,
        });
        assert.equal(internalSelected.total, '3');
        assert.equal(internalSelected.list.length, 1);
        assert.equal(internalSelected.list[0].level, 1);
        const selected = await app.bean.executor.performAction('get', '/training/student', {
          query: { name, pageSize: 1 },
        });
        assert.equal(selected.total, '3');
        assert.equal(selected.list.length, 1);
        assert.equal(Object.hasOwn(selected.list[0], 'count_all'), false);
        assert.deepEqual(await readAnalysis({ name, level: 2 }), {
          groups: [{ level: 2, count_all: '1' }],
          aggregate: { count_all: '1', count_imageId: '0' },
        });
        assert.deepEqual(await readAnalysis({ name, createdAt: '2026-03-10~2026-03-10' }), {
          groups: [{ level: 1, count_all: '2' }],
          aggregate: { count_all: '2', count_imageId: '1' },
        });
        assert.deepEqual(await readAnalysis({ name: `${name}-absent` }), empty);

        // URL query values are strings even when the inherited field contract is numeric.
        for (const level of [undefined, 1, 2, 3, 4, 1.5]) {
          const url = new URL(app.util.getAbsoluteUrlByApiPath('/training/student'));
          url.searchParams.set('name', name);
          url.searchParams.set('pageNo', '1');
          url.searchParams.set('pageSize', '20');
          if (level !== undefined) url.searchParams.set('level', String(level));
          const response = await fetch(url, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${jwt.accessToken}`,
            },
          });
          const body = await response.json();
          if (level === 4 || level === 1.5) {
            assert.equal(response.status, 422);
            assert.equal(body.code, 422);
          } else {
            assert.equal(response.status, 200);
            assert.equal(body.code, 0, JSON.stringify(body));
            const expectedIds = ids.filter(
              (_, index) => level === undefined || level === (index === 2 ? 2 : 1),
            );
            assert.equal(body.data.total, String(expectedIds.length));
            assert.deepEqual(body.data.list.map(item => item.id).sort(), expectedIds.toSorted());
            if (level !== undefined) {
              assert.ok(body.data.list.every(item => item.level === level));
            }
          }
        }

        // Dispatch concrete URLs through the HTTP router, where /:id could otherwise win.
        for (const [action, expected] of [
          ['group', initial.groups],
          ['aggregate', initial.aggregate],
        ] as const) {
          const url = new URL(app.util.getAbsoluteUrlByApiPath(`/training/student/${action}`));
          url.searchParams.set('name', name);
          const response = await fetch(url, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${jwt.accessToken}`,
            },
          });
          assert.equal(response.status, 200);
          const body = await response.json();
          assert.equal(body.code, 0, JSON.stringify(body));
          const actual =
            action === 'group'
              ? body.data.sort((a: StudentGroup, b: StudentGroup) => a.level - b.level)
              : body.data;
          assert.deepEqual(actual, expected);
        }
        for (const [action, controls, expected] of [
          [
            'group',
            { groups: ['level'], aggrs: { count: ['imageId'] } },
            [
              { level: 1, count_imageId: '1' },
              { level: 2, count_imageId: '0' },
            ],
          ],
          ['aggregate', { aggrs: { count: ['*'] } }, { count_all: '3' }],
        ] as const) {
          const url = new URL(app.util.getAbsoluteUrlByApiPath(`/training/student/${action}`));
          url.searchParams.set('name', name);
          for (const [key, value] of Object.entries(controls)) {
            url.searchParams.set(key, JSON.stringify(value));
          }
          const response = await fetch(url, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${jwt.accessToken}`,
            },
          });
          assert.equal(response.status, 200);
          const body = await response.json();
          assert.equal(body.code, 0, JSON.stringify(body));
          assert.deepEqual(body.data, expected);
        }
        for (const [action, field, value] of [
          ['group', 'groups', 'level'],
          ['group', 'groups', '["level"'],
          ['group', 'aggrs', '{"count":'],
          ['aggregate', 'aggrs', '{"count":'],
        ]) {
          const url = new URL(app.util.getAbsoluteUrlByApiPath(`/training/student/${action}`));
          url.searchParams.set('name', name);
          url.searchParams.set(field, value);
          const response = await fetch(url, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${jwt.accessToken}`,
            },
          });
          assert.equal(response.status, 422);
          assert.equal((await response.json()).code, 422);
        }
        for (const [action, controls] of [
          ['', { groups: ['level'] }],
          ['', { aggrs: { count: ['*'] } }],
          ['group', { groups: [] }],
          ['group', { groups: ['level', 'level'] }],
          ['group', { groups: ['name'] }],
          ['group', { aggrs: {} }],
          ['group', { aggrs: { count: [] } }],
          ['group', { aggrs: { count: ['*', '*'] } }],
          ['group', { aggrs: { count: ['mobile'] } }],
          ['group', { aggrs: { sum: ['level'] } }],
          ['aggregate', { groups: ['level'] }],
          ['aggregate', { groups: [] }],
        ] as const) {
          await assert.rejects(
            () =>
              app.bean.executor.performAction(
                'get',
                action === '' ? '/training/student' : `/training/student/${action}`,
                {
                  query: { name, ...controls },
                },
              ),
            (error: { code?: number }) => error.code === 422,
          );
        }
        await assert.rejects(
          () => student.service.student.group({ groups: ['name'] } as never),
          (error: { code?: number }) => error.code === 422,
        );
        await assert.rejects(
          () => student.service.student.aggregate({ groups: ['level'] } as never),
          (error: { code?: number }) => error.code === 422,
        );
        for (const action of ['group', 'aggregate'] as const) {
          for (const controls of [
            { columns: ['name'] },
            { orders: [{ field: 'level', direction: 'desc' }] },
            { pageNo: 2 },
            { pageSize: 1 },
          ]) {
            await assert.rejects(
              () =>
                app.bean.executor.performAction('get', `/training/student/${action}`, {
                  query: { name, ...controls },
                }),
              (error: { code?: number }) => error.code === 422,
            );
          }
        }
        // Canonical predicates compose with named filters; neither can override the other.
        assert.deepEqual(
          await readAnalysis({ name, level: 1, where: { field: 'level', op: 'eq', value: 2 } }),
          empty,
        );
        assert.deepEqual(
          await readAnalysis({ name, where: { field: 'level', op: 'eq', value: 2 } }),
          {
            groups: [{ level: 2, count_all: '1' }],
            aggregate: { count_all: '1', count_imageId: '0' },
          },
        );
        for (const action of ['group', 'aggregate'] as const) {
          for (const query of [
            { name, pageSize: 0 },
            { name, pageNo: 0 },
          ]) {
            await assert.rejects(
              () =>
                app.bean.executor.performAction('get', `/training/student/${action}`, { query }),
              (error: { code?: number }) => error.code === 422,
            );
          }
        }
        await app.bean.executor.performAction('patch', '/training/student/:id', {
          params: { id: ids[1] },
          body: { name: `${name}-1`, mobile: '13812345678', level: 2 },
        });
        assert.deepEqual(await readAnalysis({ name }), {
          groups: [
            { level: 1, count_all: '1' },
            { level: 2, count_all: '2' },
          ],
          aggregate: { count_all: '3', count_imageId: '1' },
        });
        await app.bean.executor.performAction('delete', '/training/student/:id', {
          params: { id: ids[0] },
        });
        assert.equal(
          (await student.model.student.getById(ids[0], { disableDeleted: true }))?.deleted,
          true,
        );
        assert.deepEqual(await readAnalysis({ name }), {
          groups: [{ level: 2, count_all: '2' }],
          aggregate: { count_all: '2', count_imageId: '0' },
        });
      } finally {
        try {
          await dropStudents(ids);
          if (imageId !== undefined) await app.bean.image.delete(imageId);
        } finally {
          if (directory) await rm(directory, { recursive: true, force: true });
          await app.bean.passport.signout();
        }
      }
    });
  });

  it('authorizes the actual Record select action for nonadmin relation predicates without replacing the parent decision', async () => {
    await app.bean.executor.mockCtx(async () => {
      const context = app.ctx;
      const passportPrevious = app.bean.passport.current;
      const passport: IPassport = {
        user: {
          id: 'student-relation-contract-user',
          name: 'Student relation contract fixture',
          activated: true,
          accountStatus: 'active',
        },
        auth: { id: 'student-relation-contract-auth' },
        roles: [],
      };
      const studentController = 'training-student.controller.student';
      const recordAction = 'training-record.controller.record#select';
      const studentActions = ['select', 'group', 'aggregate'].map(
        action => `${studentController}#${action}`,
      );
      const policyActions: string[] = [];
      const parents: Array<{
        context: typeof context;
        decision: ReturnType<typeof getRbacDecision>;
      }> = [];
      let recordAllowed = true;
      let studentAllowed = true;
      const off = app.scope('a-rbac').event.resolvePolicy.on((request, next) => {
        // performAction and relation authorization each introduce child contexts.
        let caller: typeof context | undefined = app.ctx;
        while (caller && caller !== context) caller = caller.ctxCaller;
        if (
          caller !== context ||
          app.bean.passport.currentUser?.id !== passport.user!.id ||
          ![...studentActions, recordAction].includes(request.action.actionKey)
        ) {
          return next();
        }
        assert.equal(app.bean.passport.currentAuth?.id, passport.auth!.id);
        assert.deepEqual(app.bean.passport.currentRoles, []);
        assert.equal(app.ctx.innerAccess, false);
        assert.equal(Boolean(request.action.options.dataScope), false);
        const isRecord = request.action.actionKey === recordAction;
        assert.equal(
          request.policyActionKey,
          isRecord ? recordAction : `${studentController}#select`,
        );
        policyActions.push(request.action.actionKey);
        if (isRecord) {
          const parent = app.ctx.ctxCaller;
          assert.ok(parent);
          const decision = getRbacDecision(parent);
          assert.ok(decision?.allowed);
          assert.ok(studentActions.includes(decision.actionKey));
          parents.push({ context: parent, decision });
        }
        return {
          allowed: isRecord ? recordAllowed : studentAllowed,
          actionKey: request.action.actionKey,
          action: request.action,
        };
      });
      const marker = `Policy-${randomUUID()}`;
      const studentModel = app.scope('training-student').model.student;
      const recordModel = app.scope('training-record').model.record;
      const studentIds: TableIdentity[] = [];
      const recordIds: TableIdentity[] = [];
      const recordChecks = () => policyActions.filter(action => action === recordAction).length;
      const paths = [
        '/training/student',
        '/training/student/group',
        '/training/student/aggregate',
      ] as const;
      const exists: TypeQueryPredicate = { relation: 'trainingRecords', op: 'exists' };
      const notExists: TypeQueryPredicate = { relation: 'trainingRecords', op: 'notExists' };
      const assertParents = () => {
        for (const parent of parents) {
          assert.equal(getRbacDecision(parent.context), parent.decision);
          assert.equal(Object.hasOwn(parent.decision!, 'terms'), false);
        }
      };
      try {
        await app.bean.passport.setCurrent(passport);
        assert.equal(await app.bean.passport.isSystemAdmin(), false);
        for (const actionKey of [...studentActions, recordAction]) {
          const descriptor = app.bean.rbacCatalog.getCatalog().get(actionKey);
          assert.ok(descriptor, `${actionKey} is registered in the RBAC catalog`);
          assert.equal(Boolean(descriptor.options.dataScope), false);
        }
        for (const level of [1, 2]) {
          const student = await studentModel.insert({
            name: `${marker}-${level}`,
            mobile: '13812345678',
            level,
          });
          studentIds.push(student.id);
        }
        const record = await recordModel.insert({
          studentId: studentIds[0],
          name: marker,
          subjectCount: 1,
          totalScore: 90,
          averageScore: 90,
        });
        recordIds.push(record.id);
        const assertResults = async (
          where: TypeQueryPredicate | undefined,
          indexes: number[],
          expectedChecks: number,
        ) => {
          const before = recordChecks();
          const query = { name: marker, ...(where ? { where } : {}) };
          const selected = await app.bean.executor.performAction('get', paths[0], {
            innerAccess: false,
            query: { ...query, pageSize: 1 },
          });
          assert.equal(recordChecks() - before, expectedChecks);
          assert.equal(selected.total, String(indexes.length));
          assert.equal(selected.list.length, Math.min(indexes.length, 1));
          for (const item of selected.list) {
            assert.ok(indexes.some(index => String(studentIds[index]) === String(item.id)));
            assert.equal(Object.hasOwn(item, 'trainingRecords'), false);
          }
          const groups = await app.bean.executor.performAction('get', paths[1], {
            innerAccess: false,
            query,
          });
          const aggregate = await app.bean.executor.performAction('get', paths[2], {
            innerAccess: false,
            query,
          });
          assert.equal(recordChecks() - before, expectedChecks * 3);
          assert.deepEqual(
            groups.sort((a: StudentGroup, b: StudentGroup) => a.level - b.level),
            indexes.map(index => ({ level: index + 1, count_all: '1' })),
          );
          assert.deepEqual(aggregate, { count_all: String(indexes.length), count_imageId: '0' });
          assertParents();
        };
        await assertResults(undefined, [0, 1], 0);
        await assertResults(exists, [0], 1);
        await assertResults(notExists, [1], 1);
        await assertResults({ and: [exists, { field: 'level', op: 'eq', value: 1 }] }, [0], 1);
        recordAllowed = false;
        // Denying the child action must not affect relation-free parent queries.
        await assertResults(undefined, [0, 1], 0);
        for (const where of [
          exists,
          notExists,
          { or: [{ field: 'level', op: 'eq', value: 1 }, exists] },
          { not: exists },
        ] satisfies TypeQueryPredicate[]) {
          for (const apiPath of paths) {
            const before = recordChecks();
            await assert.rejects(
              () =>
                app.bean.executor.performAction('get', apiPath, {
                  innerAccess: false,
                  query: { name: marker, where },
                }),
              (error: { code?: number }) => error.code === 403,
            );
            assert.equal(recordChecks() - before, 1);
            assertParents();
          }
        }
        // A child grant cannot bypass the independent parent admission decision.
        recordAllowed = true;
        studentAllowed = false;
        for (const apiPath of paths) {
          const before = recordChecks();
          await assert.rejects(
            () =>
              app.bean.executor.performAction('get', apiPath, {
                innerAccess: false,
                query: { name: marker, where: exists },
              }),
            (error: { code?: number }) => error.code === 403,
          );
          assert.equal(recordChecks(), before);
        }
        assert.deepEqual(
          [...new Set(policyActions)].toSorted(),
          [recordAction, ...studentActions].toSorted(),
        );
      } finally {
        off();
        try {
          for (const id of recordIds.toReversed()) {
            await recordModel.deleteById(id, { disableDeleted: true });
          }
          await dropStudents(studentIds);
        } finally {
          await app.bean.passport.setCurrent(passportPrevious);
        }
      }
    });
  });

  it('filters students by active, current-instance training-record existence without changing projection', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      const marker = `Relation-${randomUUID()}`;
      const studentModel = app.scope('training-student').model.student;
      const recordModel = app.scope('training-record').model.record;
      const studentIds: TableIdentity[] = [];
      const recordIds: TableIdentity[] = [];
      try {
        const withoutRecord = await studentModel.insert({
          name: `${marker}-without`,
          mobile: '13812345678',
          level: 1,
        });
        const withRecord = await studentModel.insert({
          name: `${marker}-with`,
          mobile: '13812345678',
          level: 2,
        });
        const withOtherRecord = await studentModel.insert({
          name: `${marker}-other`,
          mobile: '13812345678',
          level: 3,
        });
        studentIds.push(withoutRecord.id, withRecord.id, withOtherRecord.id);
        const matching = await recordModel.insert({
          studentId: withRecord.id,
          name: `${marker}-matching`,
          subjectCount: 2,
          totalScore: 180,
          averageScore: 90,
        });
        const other = await recordModel.insert({
          studentId: withOtherRecord.id,
          name: `${marker}-other-record`,
          subjectCount: 1,
          totalScore: 70,
          averageScore: 70,
        });
        const deleted = await recordModel.insert({
          studentId: withoutRecord.id,
          name: `${marker}-deleted`,
          subjectCount: 1,
          totalScore: 60,
          averageScore: 60,
        });
        recordIds.push(matching.id, other.id, deleted.id);
        await recordModel.deleteById(deleted.id);

        const select = async (where: Record<string, unknown>) =>
          await app.bean.executor.performAction('get', '/training/student', {
            query: { name: marker, where, pageSize: 20 },
          });
        const ids = (result: { list: Array<{ id: TableIdentity }> }) =>
          result.list.map(item => String(item.id)).toSorted();
        const notExists = await select({ relation: 'trainingRecords', op: 'notExists' });
        assert.deepEqual(ids(notExists), [String(withoutRecord.id)].sort());
        assert.equal(Object.hasOwn(notExists.list[0], 'trainingRecords'), false);
        assert.equal(Object.hasOwn(notExists.list[0], 'mobile'), true);

        const existsMatching = await select({
          relation: 'trainingRecords',
          op: 'exists',
          where: { field: 'name', op: 'eq', value: `${marker}-matching` },
        });
        assert.deepEqual(ids(existsMatching), [String(withRecord.id)]);

        const noOtherNamedRecord = await select({
          relation: 'trainingRecords',
          op: 'notExists',
          where: { field: 'name', op: 'eq', value: `${marker}-matching` },
        });
        assert.deepEqual(
          ids(noOtherNamedRecord),
          [String(withoutRecord.id), String(withOtherRecord.id)].sort(),
        );

        assert.deepEqual(
          await readAnalysis({
            name: marker,
            where: { relation: 'trainingRecords', op: 'notExists' },
          }),
          {
            groups: [{ level: 1, count_all: '1' }],
            aggregate: { count_all: '1', count_imageId: '0' },
          },
        );
        assert.deepEqual(
          await readAnalysis({
            name: marker,
            where: {
              relation: 'trainingRecords',
              op: 'exists',
              where: { field: 'name', op: 'eq', value: `${marker}-matching` },
            },
          }),
          {
            groups: [{ level: 2, count_all: '1' }],
            aggregate: { count_all: '1', count_imageId: '0' },
          },
        );
        assert.equal(matching.id !== other.id, true);

        // Warm list/count and analysis queries before changing their Record source.
        assert.equal(studentModel.cacheQuery.enabled, true);
        const highScore: TypeQueryPredicate = {
          relation: 'trainingRecords',
          op: 'exists',
          where: { field: 'averageScore', op: 'gte', value: 80 },
        };
        const assertWarmed = async (present: boolean) => {
          const query = { name: marker, where: highScore };
          const selected = await app.bean.executor.performAction('get', '/training/student', {
            innerAccess: false,
            query,
          });
          assert.equal(selected.total, present ? '1' : '0');
          assert.deepEqual(ids(selected), present ? [String(withRecord.id)] : []);
          assert.deepEqual(await readAnalysis(query), {
            groups: present ? [{ level: 2, count_all: '1' }] : [],
            aggregate: { count_all: present ? '1' : '0', count_imageId: '0' },
          });
        };
        await assertWarmed(true);
        await assertWarmed(true);
        await recordModel.updateById(matching.id, { averageScore: 50 });
        await assertWarmed(false);
        await recordModel.updateById(matching.id, { averageScore: 90 });
        await assertWarmed(true);
        await recordModel.deleteById(matching.id);
        await assertWarmed(false);
        await recordModel.updateById(matching.id, { deleted: false }, { disableDeleted: true });
        await assertWarmed(true);
      } finally {
        for (const id of recordIds.toReversed())
          await recordModel.deleteById(id, { disableDeleted: true });
        await dropStudents(studentIds);
        await app.bean.passport.signout();
      }
    });
  });

  it('excludes students owned by another instance', async () => {
    // Keep the full UUID within the VARCHAR(50) name column.
    const name = `Analysis-${randomUUID()}`;
    const ids: TableIdentity[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          ids.push(
            await app.bean.executor.performAction('post', '/training/student', {
              body: { name, mobile: '13812345678', level: 3 },
            }),
          );
          assert.deepEqual(await readAnalysis({ name }), {
            groups: [{ level: 3, count_all: '1' }],
            aggregate: { count_all: '1', count_imageId: '0' },
          });
        } finally {
          await app.bean.passport.signout();
        }
      });
      await app.bean.executor.mockCtx(
        async () => {
          await app.bean.passport.signinMock();
          try {
            assert.deepEqual(await readAnalysis({ name }), {
              groups: [],
              aggregate: { count_all: '0', count_imageId: '0' },
            });
          } finally {
            await app.bean.passport.signout();
          }
        },
        { instanceName: 'shareTest' as any },
      );
      await app.bean.executor.mockCtx(async () => {
        assert.deepEqual(
          await app.scope('training-student').service.student.aggregate({
            where: { name },
          }),
          { count_all: '1', count_imageId: '0' },
        );
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await dropStudents(ids);
      });
    }
  });
});
