import type { DtoStudentSelectRes, EntityStudent } from 'vona-module-training-student';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { appMetadata } from 'vona';
import { app } from 'vona-mock';
import { $schema, SymbolOpenApiOptions } from 'vona-module-a-openapiutils';
import {
  DtoStudentCreate,
  DtoStudentSelectResItem,
  DtoStudentUpdate,
  DtoStudentView,
} from 'vona-module-training-student';

import type { DtoStudentLookupRes } from '../src/dto/studentLookupRes.tsx';

import { DtoDetailRecordResItem } from '../src/dto/detailRecordResItem.tsx';
import { DtoStudentSummary } from '../src/dto/studentSummary.tsx';

describe('student.test.ts', { concurrency: false }, () => {
  it('action:student:formLayoutMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const DtoClass of [DtoStudentCreate, DtoStudentUpdate, DtoStudentView]) {
        const apiJson = await app.bean.openapi.generateJsonOfClass(DtoClass);
        const component = Object.values(apiJson.components!.schemas as any).find(item => {
          return (item as any).properties?.trainingRecords;
        });
        const blocks = (component as any)?.rest?.blocks;
        const formLayout =
          blocks?.[0]?.options?.blocks?.[0]?.options?.blocks?.[0]?.options?.formLayout;
        const tabs = formLayout?.children[0];
        const groups = tabs?.children[0]?.children;
        const profileSection = groups?.[0]?.children[0];
        const studentContentSection = groups?.[1]?.children[0];
        const trainingRecordsSection = tabs?.children[1]?.children[1];
        assert.equal(tabs?.type, 'tabs');
        assert.equal(tabs?.id, undefined);
        assert.equal(tabs?.children[1]?.type, 'tab');
        assert.equal(tabs?.children[1]?.id, undefined);
        assert.equal(groups?.length, 2);
        assert.deepEqual(
          groups?.map(item => item.type),
          ['group', 'group'],
        );
        assert.deepEqual(profileSection?.columns, { default: 1, md: 2 });
        assert.deepEqual(
          profileSection?.children.map(item => item.name),
          ['name', 'mobile', 'imageId'],
        );
        const descriptionFieldName =
          DtoClass === DtoStudentView ? '_descriptionMarkdown' : 'content';
        assert.deepEqual(
          studentContentSection?.children.map(item => item.name),
          [descriptionFieldName],
        );
        const descriptionField = (component as any).properties[descriptionFieldName];
        assert.equal(descriptionField.rest.fieldSource, 'content.descriptionMarkdown');
        assert.equal(descriptionField.rest.form.render, 'basic-markdown:formFieldMarkdown');
        if (DtoClass === DtoStudentView) {
          assert.equal((component as any).required?.includes('_descriptionMarkdown'), false);
        }
        assert.equal(tabs?.children[1]?.children[0]?.name, 'level');
        assert.deepEqual(
          trainingRecordsSection?.children.map(item => item.name),
          ['trainingRecords'],
        );
      }
    });
  });

  it('action:student:nestedCreateProjection', async () => {
    await app.bean.executor.mockCtx(async () => {
      const input = {
        name: 'DTO projection',
        mobile: '13800138000',
        level: 1,
        trainingRecords: [
          {
            id: 101,
            deleted: false,
            name: 'Record',
            trainingRecordSubjects: [{ id: 102, deleted: false, name: 'Math', score: 95 }],
          },
        ],
      };
      const created = await $schema(DtoStudentCreate).parseAsync(input);
      const record = created.trainingRecords?.[0];
      const subject = record?.trainingRecordSubjects?.[0];
      assert.ok(subject);
      assert.equal((record as any).id, undefined);
      assert.equal((record as any).deleted, undefined);
      assert.equal((subject as any).id, undefined);
      assert.equal((subject as any).deleted, undefined);
      assert.equal(subject.name, 'Math');
      assert.equal(subject.score, 95);
      const updated = await $schema(DtoStudentUpdate).parseAsync(input);
      assert.equal(updated.trainingRecords?.[0]?.id, 101);
      assert.equal(updated.trainingRecords?.[0]?.trainingRecordSubjects?.[0]?.id, 102);
      assert.equal(updated.trainingRecords?.[0]?.trainingRecordSubjects?.[0]?.deleted, false);
    });
  });

  it('action:student:openapiMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const controller = app.bean.onion.controller
        .getOnionsEnabledCached()
        .find(item => item.beanOptions.beanFullName === 'training-student.controller.student')
        ?.beanOptions.beanClass;
      if (!controller) throw new Error('training-student.controller.student not found');
      const controllerMetadata = appMetadata.getMetadata<any>(SymbolOpenApiOptions, controller);
      assert.equal(controllerMetadata?.summary?.toString(), 'training-student::StudentController');
      const expectedSummaries = {
        create: ['post', '/api/training/student', 'Create Student'],
        select: ['get', '/api/training/student', 'List Students'],
        lookup: ['get', '/api/training/student/lookup', 'Find Students'],
        group: ['get', '/api/training/student/group', 'Group Students'],
        aggregate: ['get', '/api/training/student/aggregate', 'Aggregate Students'],
        view: ['get', '/api/training/student/{id}', 'View Student'],
        update: ['patch', '/api/training/student/{id}', 'Update Student'],
        summary: ['get', '/api/training/student/summary/{id}', 'View Student Summary'],
        delete: ['delete', '/api/training/student/{id}', 'Delete Student'],
        deleteForce: [
          'delete',
          '/api/training/student/deleteForce/{id}',
          'Permanently Delete Student',
        ],
        deleteBulk: ['post', '/api/training/student/bulk/delete', 'Bulk Delete Students'],
      } as const;
      for (const [action, [method, path, summary]] of Object.entries(expectedSummaries)) {
        const apiJson = await app.bean.openapi.generateJsonOfControllerAction(
          controller,
          action,
          'V31',
        );
        const operation = (apiJson.paths as any)?.[path]?.[method];
        assert.ok(operation, `${action} operation is missing`);
        assert.equal(operation.summary?.toJSON(), summary);
      }
      const apiJson = await app.bean.openapi.generateJsonOfControllerAction(
        controller,
        'deleteBulk',
        'V31',
      );
      const operation = apiJson.paths?.['/api/training/student/bulk/delete']?.post;
      assert.equal(operation?.operationId, 'TrainingStudent_deleteBulk');
      const requestBody = operation?.requestBody;
      assert.ok(requestBody);
      assert.ok(!('$ref' in requestBody));
      const requestSchema = requestBody.content['application/json']?.schema;
      assert.ok(requestSchema && '$ref' in requestSchema);
      const requestSchemaRef = requestSchema.$ref;
      assert.ok(typeof requestSchemaRef === 'string');
      const requestSchemaName = requestSchemaRef.replace('#/components/schemas/', '');
      const component = apiJson.components?.schemas?.[requestSchemaName];
      assert.ok(component && !('$ref' in component));
      const idsSchema = component.properties?.ids;
      assert.ok(idsSchema && !('$ref' in idsSchema));
      assert.equal(idsSchema.minItems, 1);
      assert.equal(idsSchema.maxItems, 100);
    });
  });

  it('action:student:levelDescription', async () => {
    for (const [locale, description] of [
      ['en-us', '1=Foundation Track; 2=Progress Track; 3=Advanced Workshop'],
      ['zh-cn', '1=基础班; 2=提升班; 3=高级研修班'],
    ] as const) {
      await app.bean.executor.mockCtx(
        async () => {
          for (const DtoClass of [
            DtoStudentCreate,
            DtoStudentUpdate,
            DtoStudentSelectResItem,
            DtoStudentView,
            DtoStudentSummary,
          ]) {
            const apiJson = JSON.parse(
              JSON.stringify(await app.bean.openapi.generateJsonOfClass(DtoClass, 'V31')),
            );
            const component = Object.values(apiJson.components.schemas).find(
              (item: any) => item.properties?.level,
            ) as any;
            assert.ok(component?.properties.level, `${DtoClass.name} level schema is missing`);
            assert.equal(component.properties.level.description, description);
          }
          const student = { name: 'Level semantics', mobile: '13800138000', level: 2 };
          const parsed = await $schema(DtoStudentCreate).parseAsync(student);
          assert.equal(parsed.level, 2);
          assert.equal(
            (await $schema(DtoStudentCreate).safeParseAsync({ ...student, level: '2' })).success,
            false,
          );
        },
        { locale },
      );
    }
  });

  it('action:student:filterFormLayoutMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoStudentSelectResItem);
      const component = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).properties?._operationsRow;
      });
      const pageBlocks = (component as any)?.rest?.blocks?.[0]?.options?.blocks;
      const toolbarBlock = pageBlocks?.[1];
      assert.equal(toolbarBlock?.render, 'basic-page:blockToolbarBulk');
      const deleteBulkAction = toolbarBlock?.options?.actions?.find(
        (action: any) => action.render === 'basic-table:actionDeleteBulk',
      );
      assert.equal(deleteBulkAction?.options?.requiresSelection, true);
      assert.equal(deleteBulkAction?.options?.selectedMaxIds, 100);
      const refreshAction = toolbarBlock?.options?.actions?.find(
        (action: any) => action.render === 'basic-table:actionRefresh',
      );
      assert.equal(refreshAction?.options?.requiresSelection, undefined);
      assert.equal(refreshAction?.options?.selectedMaxIds, undefined);
      const columnConfigAction = toolbarBlock?.options?.actions?.find(
        (action: any) => action.render === 'basic-table:actionColumnConfig',
      );
      assert.deepEqual(columnConfigAction?.options?.permission, { public: true });
      assert.equal(columnConfigAction?.options?.placement, 'end');

      const filterBlock = pageBlocks?.[0];
      assert.equal(filterBlock?.render, 'basic-page:blockFilter');
      assert.equal(filterBlock?.options?.formFieldLayout?.inline, true);
      assert.deepEqual(
        filterBlock?.options?.blocks?.map(item => item.render),
        ['basic-form:blockFormLayout'],
      );
      const formLayout = filterBlock?.options?.blocks?.[0]?.options?.formLayout;
      const filterLayoutChildren = formLayout?.children[0]?.children;
      assert.equal(formLayout?.children[0]?.layout, 'flow');
      assert.equal(formLayout?.children[0]?.columns, undefined);
      assert.equal(filterLayoutChildren?.length, 4);
      assert.deepEqual(
        filterLayoutChildren?.map(item => item.type),
        ['field', 'field', 'field', 'block'],
      );
      assert.deepEqual(
        filterLayoutChildren?.slice(0, 3).map(item => item.name),
        ['name', 'level', 'createdAt'],
      );
      assert.equal(filterLayoutChildren?.[2]?.span, undefined);
      assert.equal(filterLayoutChildren?.[3]?.block?.render, 'basic-page:blockFilterActions');
    });
  });

  it('action:student:tableColumnMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoStudentSelectResItem);
      const component = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).properties?._operationsRow;
      }) as any;
      assert.deepEqual(
        {
          align: component.properties.name.rest.table.align,
          width: component.properties.name.rest.table.width,
          fixed: component.properties.name.rest.table.fixed,
          enableSorting: component.properties.name.rest.table.enableSorting,
        },
        { align: 'left', width: 240, fixed: 'left', enableSorting: true },
      );
      assert.deepEqual(
        {
          align: component.properties.level.rest.table.align,
          width: component.properties.level.rest.table.width,
          enableSorting: component.properties.level.rest.table.enableSorting,
        },
        { align: 'center', width: 140, enableSorting: true },
      );
      assert.deepEqual(
        {
          align: component.properties.createdAt.rest.table.align,
          width: component.properties.createdAt.rest.table.width,
          enableSorting: component.properties.createdAt.rest.table.enableSorting,
        },
        { align: 'center', width: 180, enableSorting: true },
      );
      assert.deepEqual(
        {
          align: component.properties._operationsRow.rest.table.align,
          width: component.properties._operationsRow.rest.table.width,
          fixed: component.properties._operationsRow.rest.table.fixed,
        },
        { align: 'center', width: 360, fixed: 'right' },
      );
    });
  });

  it('action:student:serverSorting', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      const studentIds: string[] = [];
      const names = ['__StudentSortA__', '__StudentSortZ__'];
      try {
        for (const [index, name] of names.entries()) {
          const studentId = await app.bean.executor.performAction('post', '/training/student', {
            body: {
              name,
              mobile: `13812345${678 + index}`,
              level: 1,
            },
          });
          studentIds.push(studentId);
        }
        const ascending: DtoStudentSelectRes = await app.bean.executor.performAction(
          'get',
          '/training/student',
          { query: { orders: [['name', 'asc']] } },
        );
        const descending: DtoStudentSelectRes = await app.bean.executor.performAction(
          'get',
          '/training/student',
          { query: { orders: [['name', 'desc']] } },
        );
        const ascendingIndexes = names.map(name =>
          ascending.list.findIndex(item => item.name === name),
        );
        const descendingIndexes = names.map(name =>
          descending.list.findIndex(item => item.name === name),
        );
        assert.equal(
          ascendingIndexes.every(index => index >= 0),
          true,
        );
        assert.equal(
          descendingIndexes.every(index => index >= 0),
          true,
        );
        assert.equal(ascendingIndexes[0] < ascendingIndexes[1], true);
        assert.equal(descendingIndexes[0] > descendingIndexes[1], true);
      } finally {
        for (const studentId of studentIds.reverse()) {
          await app
            .scope('training-student')
            .model.studentContent.delete({ studentId }, { disableDeleted: true });
          await app
            .scope('training-student')
            .model.student.deleteById(studentId, { disableDeleted: true });
        }
        await app.bean.passport.signout();
      }
    });
  });

  it('action:student:lookup', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      const training = app.scope('training-student');
      const prefix = `L${randomUUID().slice(0, 6)}`;
      const literals = ['%', '_', '!', "'", '\\'];
      const literalName = literals.map(literal => `${prefix}${literal}`).join('|');
      const expected: DtoStudentLookupRes['list'] = [];
      let foreignStudentId: string | undefined;
      const lookup = (query: object): Promise<DtoStudentLookupRes> =>
        app.bean.executor.performAction('get', '/training/student/lookup', {
          query,
          innerAccess: false,
        });
      try {
        // Name order deliberately differs from insertion/ID order.
        for (const [name, level] of [
          [`Z-${literalName}`, 1],
          [`A-${prefix}-plain`, 2],
          [`M-${literalName}`, 1],
        ] as const) {
          const student = await training.model.student.insert({
            name,
            mobile: '13812345678',
            level,
          });
          expected.push({ id: student.id, name: student.name, level });
        }
        await training.model.studentContent.insert({
          studentId: expected[0].id,
          descriptionMarkdown: 'Private lookup notes',
          descriptionHtml: '<p>Private lookup notes</p>',
        });
        await app.bean.executor.mockCtx(
          async () => {
            const student = await app.scope('training-student').model.student.insert({
              name: expected[0].name,
              mobile: '13987654321',
              level: 1,
            });
            foreignStudentId = String(student.id);
          },
          { instanceName: 'shareTest' as any },
        );

        const defaults = await lookup({ name: `  ${prefix}  ` });
        assert.deepEqual(defaults, {
          list: expected,
          total: '3',
          pageNo: 1,
          pageSize: 10,
          pageCount: 1,
        });
        for (const item of defaults.list) {
          assert.deepEqual(Object.keys(item).sort(), ['id', 'level', 'name']);
        }
        assert.ok(BigInt(String(expected[0].id)) < BigInt(String(expected[1].id)));
        assert.ok(BigInt(String(expected[1].id)) < BigInt(String(expected[2].id)));
        assert.deepEqual(
          await training.service.student.lookup({ name: prefix, pageNo: 1, pageSize: 10 }),
          defaults,
          'the service itself excludes mobile, content, relations and UI fields',
        );
        for (const literal of literals) {
          assert.deepEqual(
            await lookup({ name: `${prefix}${literal}` }),
            { ...defaults, list: [expected[0], expected[2]], total: '2' },
            `${literal} is a bound literal, not wildcard or SQL syntax`,
          );
        }
        const filtered = await lookup({ name: prefix, level: 2 });
        assert.deepEqual(filtered, { ...defaults, list: [expected[1]], total: '1' });
        assert.deepEqual(await lookup({ name: prefix, level: 3 }), {
          ...defaults,
          list: [],
          total: '0',
          pageCount: 0,
        });
        for (const [pageNo, list] of [
          [1, expected.slice(0, 2)],
          [2, expected.slice(2)],
          [3, []],
        ] as const) {
          assert.deepEqual(await lookup({ name: prefix, pageNo, pageSize: 2 }), {
            list,
            total: '3',
            pageNo,
            pageSize: 2,
            pageCount: 2,
          });
        }
        assert.equal(
          await training.service.student.summary(foreignStudentId!),
          undefined,
          'lookup cannot turn a foreign-instance match into a local summary',
        );
      } finally {
        try {
          for (const student of expected.reverse()) {
            await training.model.studentContent.delete(
              { studentId: student.id },
              { disableDeleted: true },
            );
            await training.model.student.deleteById(student.id, { disableDeleted: true });
          }
        } finally {
          try {
            if (foreignStudentId) {
              await app.bean.executor.mockCtx(
                async () => {
                  await app
                    .scope('training-student')
                    .model.student.deleteById(foreignStudentId!, { disableDeleted: true });
                },
                { instanceName: 'shareTest' as any },
              );
            }
          } finally {
            await app.bean.passport.signout();
          }
        }
      }
    });
  });

  it('action:student:lookup rejects invalid input and query controls', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const invalidQueries = [
          {},
          { name: '' },
          { name: '   ' },
          { name: 'a'.repeat(101) },
          ...[0, 4, 1.5, 'invalid'].map(level => ({ name: 'Lookup', level })),
          ...[0, -1, 1.5].map(pageNo => ({ name: 'Lookup', pageNo })),
          ...[0, -1, 1.5, 21].map(pageSize => ({ name: 'Lookup', pageSize })),
          ...Object.entries({
            where: { name: 'Lookup' },
            orders: [['name', 'desc']],
            columns: ['mobile'],
            include: { content: true },
            filter: { name: 'Lookup' },
            offset: 0,
            limit: 100,
            instanceName: 'shareTest',
          }).map(([key, value]) => ({ name: 'Lookup', [key]: value })),
        ];
        for (const query of invalidQueries) {
          await assert.rejects(
            () =>
              app.bean.executor.performAction('get', '/training/student/lookup', {
                query,
                innerAccess: false,
              }),
            { code: 422 },
            JSON.stringify(query),
          );
        }
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:student:emittedDtoSchemas', async () => {
    await app.bean.executor.mockCtx(async () => {
      const summaryApiJson = await app.bean.openapi.generateJsonOfClass(DtoStudentSummary);
      const summaryComponent = Object.values(summaryApiJson.components!.schemas as any).find(
        item => {
          return (item as any).properties?.summaryText;
        },
      ) as any;
      assert.ok(summaryComponent);
      assert.deepEqual(
        Object.keys(summaryComponent.properties).sort(),
        [
          'id',
          'name',
          'mobile',
          'level',
          'descriptionMarkdown',
          'descriptionHtml',
          'levelTitle',
          'descriptionLength',
          'summaryText',
        ].sort(),
      );

      const detailRecordApiJson =
        await app.bean.openapi.generateJsonOfClass(DtoDetailRecordResItem);
      const detailRecordComponent = Object.values(
        detailRecordApiJson.components!.schemas as any,
      ).find(item => (item as any).properties?._lineNumber) as any;
      assert.ok(detailRecordComponent?.properties?._lineNumber);
      assert.equal(detailRecordComponent.required?.includes('_lineNumber'), false);
    });
  });

  it('action:student', async () => {
    await app.bean.executor.mockCtx(async () => {
      // data
      const mobile = '13812345678';
      const maskedMobile = '138****5678';
      const mobileUpdate = '13987654321';
      const maskedMobileUpdate = '139****4321';
      const trainingTime = new Date('2026-03-10T08:00:00.000Z');
      const trainingTimeUpdate = new Date('2026-04-18T13:20:00.000Z');
      const description =
        `# Student profile\n\n${'This is a long Markdown description. '.repeat(10)}`.trim();
      const descriptionUpdate =
        `## Updated profile\n\n${'This is updated Markdown content. '.repeat(10)}`.trim();
      const data = {
        name: '__Tom__',
        content: { descriptionMarkdown: description },
        mobile,
        level: 1,
        trainingRecords: [
          {
            name: '__Record__',
            subjectCount: 1,
            totalScore: 88,
            averageScore: 88,
            trainingTime,
            description: 'This is a record',
            trainingRecordSubjects: [
              {
                name: '__Math__',
                score: 95,
                description: 'Math subject',
              },
            ],
          },
        ],
      } as any as DtoStudentCreate;
      // login
      await app.bean.passport.signinMock();
      // create
      const studentId = await app.bean.executor.performAction('post', '/training/student', {
        body: data,
      });
      assert.equal(!!studentId, true);
      // findMany
      const selectRes: DtoStudentSelectRes = await app.bean.executor.performAction(
        'get',
        '/training/student',
      );
      const studentItem = selectRes.list.find(item => item.name === data.name);
      assert.equal(!!studentItem, true);
      assert.equal(studentItem!.level, data.level);
      assert.equal(studentItem!.mobile, maskedMobile);
      assert.equal((studentItem as any).description, undefined);
      // findMany: level filter
      const selectResByLevel: DtoStudentSelectRes = await app.bean.executor.performAction(
        'get',
        '/training/student',
        {
          query: {
            level: data.level,
          },
        },
      );
      assert.equal(
        selectResByLevel.list.some(item => item.name === data.name),
        true,
      );
      assert.equal(
        selectResByLevel.list.every(item => item.level === data.level),
        true,
      );
      // findOne and nested create check
      let student: any = await app.bean.executor.performAction('get', '/training/student/:id', {
        params: { id: studentId },
      });
      const record = student.trainingRecords?.[0];
      const recordSubject = record?.trainingRecordSubjects?.[0];
      assert.equal(student.trainingRecords?.length, 1);
      assert.equal(student.content?.descriptionMarkdown, description);
      assert.equal(record?.name, '__Record__');
      assert.equal(record?.subjectCount, 1);
      assert.equal(record?.totalScore, 88);
      assert.equal(Number(record?.averageScore), 88);
      assert.equal(new Date(record?.trainingTime).toISOString(), trainingTime.toISOString());
      assert.equal(record?.trainingRecordSubjects?.length, 1);
      assert.equal(recordSubject?.name, '__Math__');
      assert.equal(recordSubject?.score, 95);
      // update
      const dataUpdate = {
        name: '__TomNew__',
        content: { descriptionMarkdown: descriptionUpdate },
        mobile: mobileUpdate,
        level: 2,
        trainingRecords: [
          {
            id: record.id,
            name: '__RecordNew__',
            subjectCount: 2,
            totalScore: 183,
            averageScore: 91.5,
            trainingTime: trainingTimeUpdate,
            description: 'This is an updated record',
            trainingRecordSubjects: [
              {
                id: recordSubject.id,
                name: '__MathNew__',
                score: 96,
                description: 'Updated math subject',
              },
              {
                name: '__English__',
                score: 87,
                description: 'English subject',
              },
            ],
          },
        ],
      } as any as DtoStudentUpdate;
      const updateRes = await app.bean.executor.performAction('patch', '/training/student/:id', {
        params: { id: studentId },
        body: dataUpdate,
      });
      assert.equal(updateRes, null);
      // findOne after nested update
      student = await app.bean.executor.performAction('get', '/training/student/:id', {
        params: { id: studentId },
      });
      const updatedRecord = student.trainingRecords?.[0];
      const [updatedMathSubject, updatedEnglishSubject] =
        updatedRecord?.trainingRecordSubjects ?? [];
      assert.equal(student.name, dataUpdate.name);
      assert.equal(student.level, dataUpdate.level);
      assert.equal(student.mobile, maskedMobileUpdate);
      assert.equal(student.content?.descriptionMarkdown, descriptionUpdate);
      assert.equal(student.trainingRecords?.length, 1);
      assert.equal(updatedRecord?.name, '__RecordNew__');
      assert.equal(updatedRecord?.subjectCount, 2);
      assert.equal(updatedRecord?.totalScore, 183);
      assert.equal(Number(updatedRecord?.averageScore), 91.5);
      assert.equal(
        new Date(updatedRecord?.trainingTime).toISOString(),
        trainingTimeUpdate.toISOString(),
      );
      assert.equal(updatedRecord?.trainingRecordSubjects?.length, 2);
      assert.equal(updatedMathSubject?.name, '__MathNew__');
      assert.equal(updatedMathSubject?.score, 96);
      assert.equal(updatedEnglishSubject?.name, '__English__');
      assert.equal(updatedEnglishSubject?.score, 87);
      const studentRaw = await app.bean.scope('training-student').model.student.getById(studentId, {
        disableDeleted: true,
      });
      assert.equal(studentRaw!.mobile, mobileUpdate);
      assert.equal((studentRaw as any).description, undefined);
      const studentContent = await app
        .scope('training-student')
        .model.studentContent.get({ studentId });
      assert.equal(studentContent?.descriptionMarkdown, descriptionUpdate);
      assert.equal(
        studentContent?.descriptionHtml,
        app.bean.markdown.renderHtml(descriptionUpdate),
      );
      // summary
      const summary: DtoStudentSummary = await app.bean.executor.performAction(
        'get',
        '/training/student/summary/:id',
        { params: { id: studentId } },
      );
      assert.equal(summary.name, dataUpdate.name);
      assert.equal(summary.mobile, maskedMobileUpdate);
      assert.equal(summary.level, dataUpdate.level);
      assert.equal(summary.descriptionMarkdown, descriptionUpdate);
      assert.equal(summary.descriptionHtml, app.bean.markdown.renderHtml(descriptionUpdate));
      assert.equal(summary.descriptionLength, descriptionUpdate.length);
      assert.equal(typeof summary.levelTitle, 'string');
      assert.equal(typeof summary.summaryText, 'string');
      // delete
      const deleteRes = await app.bean.executor.performAction('delete', '/training/student/:id', {
        params: { id: student.id },
      });
      assert.equal(deleteRes, null);
      const studentContentDeleted = await app
        .scope('training-student')
        .model.studentContent.get({ studentId }, { disableDeleted: true });
      assert.equal(studentContentDeleted?.deleted, true);
      assert.equal(
        await app.scope('training-student').model.studentContent.get({ studentId }),
        undefined,
      );
      // findOne
      student = await app.bean.executor.performAction('get', '/training/student/:id', {
        params: { id: student.id },
      });
      assert.equal(student, undefined);
      // create again for force delete
      const studentIdForce = await app.bean.executor.performAction('post', '/training/student', {
        body: data,
      });
      const deleteForceRes = await app.bean.executor.performAction(
        'delete',
        '/training/student/deleteForce/:id',
        {
          params: { id: studentIdForce },
        },
      );
      assert.equal(deleteForceRes, null);
      const studentForce: EntityStudent | undefined = await app.bean
        .scope('training-student')
        .model.student.getById(studentIdForce, {
          disableDeleted: true,
        });
      assert.equal(studentForce, undefined);
      assert.equal(
        await app
          .scope('training-student')
          .model.studentContent.get({ studentId: studentIdForce }, { disableDeleted: true }),
        undefined,
      );
      // logout
      await app.bean.passport.signout();
    });
  });

  it('action:student:deleteBulk', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      const studentIds: string[] = [];
      try {
        for (const name of ['__DeleteBulkA__', '__DeleteBulkB__']) {
          const studentId = await app.bean.executor.performAction('post', '/training/student', {
            body: { name, mobile: `138${studentIds.length}1234567`, level: 1 },
          });
          studentIds.push(studentId);
        }
        const deleted = await app.bean.executor.performAction(
          'post',
          '/training/student/bulk/delete',
          { body: { ids: studentIds } },
        );
        assert.equal(deleted, null);
        for (const studentId of studentIds) {
          assert.equal(
            await app.scope('training-student').model.student.getById(studentId),
            undefined,
          );
        }
      } finally {
        for (const studentId of studentIds.reverse()) {
          await app
            .scope('training-student')
            .model.studentContent.delete({ studentId }, { disableDeleted: true });
          await app
            .scope('training-student')
            .model.student.deleteById(studentId, { disableDeleted: true });
        }
        await app.bean.passport.signout();
      }
    });
  });

  it('action:student:deleteBulk accepts duplicate and missing IDs', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      let studentId: string | undefined;
      try {
        const createdStudentId = await app.bean.executor.performAction(
          'post',
          '/training/student',
          {
            body: { name: '__DeleteBulkIdempotent__', mobile: '13891234567', level: 1 },
          },
        );
        studentId = createdStudentId;
        const deleted = await app.bean.executor.performAction(
          'post',
          '/training/student/bulk/delete',
          { body: { ids: [createdStudentId, createdStudentId, '-1'] } },
        );
        assert.equal(deleted, null);
        assert.equal(
          await app.scope('training-student').model.student.getById(createdStudentId),
          undefined,
        );
      } finally {
        if (studentId) {
          await app
            .scope('training-student')
            .model.studentContent.delete({ studentId }, { disableDeleted: true });
          await app
            .scope('training-student')
            .model.student.deleteById(studentId, { disableDeleted: true });
        }
        await app.bean.passport.signout();
      }
    });
  });

  it('action:student:contentPersistence', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      let studentId: string | undefined;
      try {
        studentId = await app.bean.executor.performAction('post', '/training/student', {
          body: {
            name: '__ContentStudent__',
            mobile: '13812345678',
            level: 1,
          },
        });
        const studentContentModel = app.scope('training-student').model.studentContent;
        const createdContent = await studentContentModel.get({ studentId });
        assert.equal(createdContent?.descriptionMarkdown, '');
        assert.equal(createdContent?.descriptionHtml, '');

        await app.bean.executor.performAction('patch', '/training/student/:id', {
          params: { id: studentId },
          body: {
            name: '__ContentStudentUpdated__',
            mobile: '13812345678',
            level: 1,
          },
        });
        const preservedContent = await studentContentModel.get({ studentId });
        assert.equal(preservedContent?.descriptionMarkdown, '');
        assert.equal(preservedContent?.descriptionHtml, '');

        const markdown = '  ## Created later  ';
        await app.bean.executor.performAction('patch', '/training/student/:id', {
          params: { id: studentId },
          body: {
            name: '__ContentStudentUpdated__',
            mobile: '13812345678',
            level: 1,
            content: {
              descriptionMarkdown: markdown,
              descriptionHtml: '<p>Forged HTML</p>',
            },
          },
        });
        const studentContent = await studentContentModel.get({ studentId });
        assert.equal(studentContent?.descriptionMarkdown, markdown);
        assert.equal(studentContent?.descriptionHtml, app.bean.markdown.renderHtml(markdown));
        assert.notEqual(studentContent?.descriptionHtml, '<p>Forged HTML</p>');

        const whitespaceMarkdown = ' \n\t ';
        await app.bean.executor.performAction('patch', '/training/student/:id', {
          params: { id: studentId },
          body: {
            name: '__ContentStudentUpdated__',
            mobile: '13812345678',
            level: 1,
            content: { descriptionMarkdown: whitespaceMarkdown },
          },
        });
        const whitespaceContent = await studentContentModel.get({ studentId });
        assert.equal(whitespaceContent?.descriptionMarkdown, whitespaceMarkdown);
        assert.equal(
          whitespaceContent?.descriptionHtml,
          app.bean.markdown.renderHtml(whitespaceMarkdown),
        );
      } finally {
        if (studentId) {
          await app
            .scope('training-student')
            .model.studentContent.delete({ studentId }, { disableDeleted: true });
          await app
            .scope('training-student')
            .model.student.deleteById(studentId, { disableDeleted: true });
        }
        await app.bean.passport.signout();
      }
    });
  });

  it('action:student:update admits only an existing current-instance root', async () => {
    const marker = `__UpdateRoot_${randomUUID()}__`;
    const ownedIds: string[] = [];
    let foreignId: string | undefined;
    try {
      await app.bean.executor.mockCtx(
        async () => {
          const foreign = await app.scope('training-student').service.student.create({
            name: `${marker}foreign`,
            mobile: '13812345678',
            level: 1,
          } as DtoStudentCreate);
          foreignId = String(foreign.id);
        },
        { instanceName: 'shareTest' as any },
      );
      await app.bean.executor.mockCtx(async () => {
        const scope = app.scope('training-student');
        const missing = await scope.service.student.create({
          name: `${marker}missing`,
          mobile: '13812345678',
          level: 1,
        } as DtoStudentCreate);
        ownedIds.push(String(missing.id));
        await scope.service.student.deleteForce(missing.id);
        const deleted = await scope.service.student.create({
          name: `${marker}deleted`,
          mobile: '13812345678',
          level: 1,
          content: { descriptionMarkdown: 'Original deleted content' },
        } as DtoStudentCreate);
        ownedIds.push(String(deleted.id));
        await scope.service.student.delete(deleted.id);
        const deletedContent = await scope.model.studentContent.get(
          { studentId: deleted.id },
          { disableDeleted: true },
        );
        assert.ok(deletedContent?.deleted);
        assert.ok(foreignId);
        for (const [kind, id] of [
          ['missing', String(missing.id)],
          ['deleted', String(deleted.id)],
          ['foreign', foreignId],
        ] as const) {
          assert.equal(await scope.model.student.getById(id), undefined);
          await scope.service.student.update(id, {
            name: `${marker}${kind}changed`,
            mobile: '13987654321',
            level: 2,
            content: { descriptionMarkdown: `Changed ${kind} content` },
            trainingRecords: [
              {
                name: `${marker}${kind}record`,
                trainingRecordSubjects: [{ name: `${marker}${kind}subject`, score: 88 }],
              },
            ],
          } as DtoStudentUpdate);
          assert.equal(await scope.model.student.getById(id), undefined);
          assert.equal(
            await app
              .scope('training-record')
              .model.record.get({ name: `${marker}${kind}record` }, { disableDeleted: true }),
            undefined,
          );
          assert.equal(
            await app
              .scope('training-recordsubject')
              .model.subject.get({ name: `${marker}${kind}subject` }, { disableDeleted: true }),
            undefined,
          );
          const content = await scope.model.studentContent.get(
            { studentId: id },
            { disableDeleted: true },
          );
          assert.deepEqual(content, kind === 'deleted' ? deletedContent : undefined);
        }
      });
      await app.bean.executor.mockCtx(
        async () => {
          const foreign = await app.scope('training-student').service.student.view(foreignId!);
          assert.equal(foreign?.name, `${marker}foreign`);
          assert.equal(foreign?.content?.descriptionMarkdown, '');
          assert.deepEqual(foreign?.trainingRecords, []);
        },
        { instanceName: 'shareTest' as any },
      );
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          for (const kind of ['foreign', 'deleted', 'missing']) {
            const subjectModel = app.scope('training-recordsubject').model.subject;
            const subject = await subjectModel.get(
              { name: `${marker}${kind}subject` },
              { disableDeleted: true },
            );
            if (subject) await subjectModel.deleteById(subject.id, { disableDeleted: true });
            const recordModel = app.scope('training-record').model.record;
            const record = await recordModel.get(
              { name: `${marker}${kind}record` },
              { disableDeleted: true },
            );
            if (record) await recordModel.deleteById(record.id, { disableDeleted: true });
          }
          for (const id of [...ownedIds, ...(foreignId ? [foreignId] : [])].reverse()) {
            await app
              .scope('training-student')
              .model.studentContent.delete({ studentId: id }, { disableDeleted: true });
          }
          for (const id of ownedIds.toReversed()) {
            await app.scope('training-student').service.student.deleteForce(id);
          }
        });
      } finally {
        if (foreignId) {
          await app.bean.executor.mockCtx(
            async () => {
              await app.scope('training-student').service.student.deleteForce(foreignId!);
            },
            { instanceName: 'shareTest' as any },
          );
        }
      }
    }
  });

  it('action:student:delete admits only an existing current-instance root', async () => {
    const marker = `__DeleteRoot_${randomUUID()}__`;
    type Fixture = {
      kind: string;
      rootId?: string;
      contentId?: string;
      recordId?: string;
      subjectId?: string;
    };
    const local: Fixture[] = ['missing', 'deleted', 'foreign'].map(kind => ({ kind }));
    const foreign: Fixture = { kind: 'foreignAggregate' };
    const createRoot = async (fixture: Fixture) => {
      const root = await app.scope('training-student').model.student.insert({
        name: `${marker}${fixture.kind}`,
        mobile: '13812345678',
        level: 1,
      });
      fixture.rootId = String(root.id);
    };
    const createDescendants = async (fixture: Fixture) => {
      assert.ok(fixture.rootId);
      const content = await app.scope('training-student').model.studentContent.insert({
        studentId: fixture.rootId,
        descriptionMarkdown: `${marker}${fixture.kind} content`,
        descriptionHtml: `<p>${marker}${fixture.kind} content</p>`,
      });
      fixture.contentId = String(content.id);
      const record = await app.scope('training-record').model.record.insert({
        studentId: fixture.rootId,
        name: `${marker}${fixture.kind}record`,
        subjectCount: 1,
        totalScore: 88,
        averageScore: 88,
      });
      fixture.recordId = String(record.id);
      const subject = await app.scope('training-recordsubject').model.subject.insert({
        recordId: fixture.recordId,
        name: `${marker}${fixture.kind}subject`,
        score: 88,
      });
      fixture.subjectId = String(subject.id);
    };
    const snapshot = async (fixture: Fixture) => ({
      root: await app.scope('training-student').model.student.getById(fixture.rootId!, {
        disableDeleted: true,
      }),
      content: await app
        .scope('training-student')
        .model.studentContent.getById(fixture.contentId!, { disableDeleted: true }),
      record: await app.scope('training-record').model.record.getById(fixture.recordId!, {
        disableDeleted: true,
      }),
      subject: await app.scope('training-recordsubject').model.subject.getById(fixture.subjectId!, {
        disableDeleted: true,
      }),
    });
    const cleanup = async (fixtures: Fixture[]) => {
      const reversed = fixtures.toReversed();
      // Exact owned names recover inserts that persisted before returning an ID.
      for (const fixture of reversed) {
        const model = app.scope('training-recordsubject').model.subject;
        const id =
          fixture.subjectId ??
          (await model.get({ name: `${marker}${fixture.kind}subject` }, { disableDeleted: true }))
            ?.id;
        if (id) await model.deleteById(id, { disableDeleted: true });
      }
      for (const fixture of reversed) {
        const model = app.scope('training-record').model.record;
        const id =
          fixture.recordId ??
          (await model.get({ name: `${marker}${fixture.kind}record` }, { disableDeleted: true }))
            ?.id;
        if (id) await model.deleteById(id, { disableDeleted: true });
      }
      for (const fixture of reversed) {
        const model = app.scope('training-student').model.studentContent;
        if (fixture.contentId) {
          await model.deleteById(fixture.contentId, { disableDeleted: true });
        } else if (fixture.rootId) {
          await model.delete({ studentId: fixture.rootId }, { disableDeleted: true });
        }
      }
      for (const fixture of reversed) {
        // The current-instance foreign reference never owns its root.
        if (fixture.kind === 'foreign') continue;
        const model = app.scope('training-student').model.student;
        const id =
          fixture.rootId ??
          (await model.get({ name: `${marker}${fixture.kind}` }, { disableDeleted: true }))?.id;
        if (id) await model.deleteById(id, { disableDeleted: true });
      }
    };
    let foreignBefore: Awaited<ReturnType<typeof snapshot>> | undefined;
    try {
      await app.bean.executor.mockCtx(
        async () => {
          await createRoot(foreign);
          await createDescendants(foreign);
          foreignBefore = await snapshot(foreign);
          assert.ok(foreignBefore.root && !foreignBefore.root.deleted);
          assert.ok(foreignBefore.content && !foreignBefore.content.deleted);
          assert.ok(foreignBefore.record && !foreignBefore.record.deleted);
          assert.ok(foreignBefore.subject && !foreignBefore.subject.deleted);
        },
        { instanceName: 'shareTest' as any },
      );
      await app.bean.executor.mockCtx(async () => {
        const scope = app.scope('training-student');
        const [missing, deleted, foreignReference] = local;
        await createRoot(missing);
        await scope.model.student.deleteById(missing.rootId!, { disableDeleted: true });
        assert.equal(
          await scope.model.student.getById(missing.rootId!, { disableDeleted: true }),
          undefined,
          'the missing root is physically absent, not merely soft deleted',
        );
        await createRoot(deleted);
        await scope.model.student.deleteById(deleted.rootId!);
        const deletedRoot = await scope.model.student.getById(deleted.rootId!, {
          disableDeleted: true,
        });
        assert.ok(deletedRoot?.deleted);
        assert.ok(foreign.rootId);
        foreignReference.rootId = foreign.rootId;
        for (const fixture of local) {
          // These are active local descendants even though their root is not admitted.
          await createDescendants(fixture);
          assert.equal(await scope.model.student.getById(fixture.rootId!), undefined);
          const before = await snapshot(fixture);
          assert.deepEqual(before.root, fixture === deleted ? deletedRoot : undefined);
          assert.ok(before.content && !before.content.deleted);
          assert.ok(before.record && !before.record.deleted);
          assert.ok(before.subject && !before.subject.deleted);
          assert.equal(String(before.content.studentId), fixture.rootId);
          assert.equal(String(before.record.studentId), fixture.rootId);
          assert.equal(String(before.subject.recordId), fixture.recordId);

          await scope.service.student.delete(fixture.rootId!);

          assert.equal(await scope.model.student.getById(fixture.rootId!), undefined);
          assert.deepEqual(
            await snapshot(fixture),
            before,
            `${fixture.kind} root admission must leave all active local descendants unchanged`,
          );
        }
      });
      await app.bean.executor.mockCtx(
        async () => {
          assert.deepEqual(
            await snapshot(foreign),
            foreignBefore,
            'the foreign aggregate remains unchanged in its owning instance',
          );
        },
        { instanceName: 'shareTest' as any },
      );
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          await cleanup(local);
        });
      } finally {
        await app.bean.executor.mockCtx(
          async () => {
            await cleanup([foreign]);
          },
          { instanceName: 'shareTest' as any },
        );
      }
    }
  });

  it('action:student:rbacCatalog', async () => {
    await app.bean.executor.mockCtx(async () => {
      const catalog = app.bean.rbacCatalog.getCatalog();
      const controllerBeanFullName = 'training-student.controller.student';
      const expectedInherits = {
        create: undefined,
        select: undefined,
        lookup: `${controllerBeanFullName}#select`,
        group: `${controllerBeanFullName}#select`,
        aggregate: `${controllerBeanFullName}#select`,
        view: undefined,
        update: undefined,
        summary: `${controllerBeanFullName}#view`,
        delete: undefined,
        deleteBulk: `${controllerBeanFullName}#delete`,
        deleteForce: `${controllerBeanFullName}#delete`,
      } as const;
      for (const [action, actionInheritKey] of Object.entries(expectedInherits)) {
        const descriptor = catalog.get(`${controllerBeanFullName}#${action}`);
        assert.ok(descriptor, `${action} RBAC action is missing`);
        assert.equal(descriptor.actionInheritKey, actionInheritKey);
        assert.equal(descriptor.options.dataScope, undefined);
      }
    });
  });

  it('action:student:level invalid', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      await assert.rejects(async () => {
        await app.bean.executor.performAction('post', '/training/student', {
          body: {
            name: '__Tom__',
            content: { descriptionMarkdown: 'This is a test' },
            mobile: '13812345678',
            level: 4,
          },
        });
      });
      await app.bean.passport.signout();
    });
  });

  it('action:student:mobile required', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      await assert.rejects(async () => {
        await app.bean.executor.performAction('post', '/training/student', {
          body: {
            name: '__Tom__',
            content: { descriptionMarkdown: 'This is a test' },
            level: 1,
          },
        });
      });
      await app.bean.passport.signout();
    });
  });

  it('action:student:mobile too short', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      await assert.rejects(async () => {
        await app.bean.executor.performAction('post', '/training/student', {
          body: {
            name: '__Tom__',
            content: { descriptionMarkdown: 'This is a test' },
            mobile: '1381234567',
            level: 1,
          },
        });
      });
      await app.bean.passport.signout();
    });
  });
});
