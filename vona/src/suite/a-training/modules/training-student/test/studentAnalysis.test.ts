import type { TableIdentity } from 'table-identity';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';

import { ZodMetadata } from '@cabloy/zod-openapi';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $schema } from 'vona-module-a-openapiutils';

import { DtoStudentAggregateRes } from '../src/dto/studentAggregateRes.tsx';
import { DtoStudentGroupResItem } from '../src/dto/studentGroupResItem.tsx';
import { DtoStudentSelectReq } from '../src/dto/studentSelectReq.tsx';

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
  it('keeps select unchanged and emits optional analysis response field supersets', async () => {
    await app.bean.executor.mockCtx(async () => {
      const request = $schema(DtoStudentSelectReq);
      const requestMetadata = ZodMetadata.getOpenapiMetadata(request) as
        | ISchemaObjectExtensionField
        | undefined;
      assert.equal(requestMetadata?.filter?.table, 'trainingStudent');
      assert.equal(request.safeParse({}).success, true);
      assert.equal(
        request.safeParse({ name: 'Student', level: 2, createdAt: '2026-03-10~2026-03-10' })
          .success,
        true,
      );
      assert.equal(
        request.safeParse({
          where: { level: { _gte_: 2 } },
          columns: ['name'],
          orders: 'level,desc',
          pageNo: 2,
          pageSize: 1,
        }).success,
        true,
      );
      assert.equal(request.safeParse({ pageSize: 0 }).success, false);
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
          ['columns', 'createdAt', 'level', 'name', 'orders', 'pageNo', 'pageSize', 'where'],
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
        assert.deepEqual(
          await readAnalysis({
            name,
            columns: ['name'],
            orders: 'level,desc',
            pageNo: 2,
            pageSize: 1,
          }),
          initial,
        );
        // Raw predicates are shared with select and take precedence over named filters.
        assert.deepEqual(
          await readAnalysis({
            name,
            level: 1,
            where: { level: 2 },
          }),
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

  it('excludes students owned by another instance', async () => {
    const name = `Analysis-instance-${randomUUID()}`;
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
