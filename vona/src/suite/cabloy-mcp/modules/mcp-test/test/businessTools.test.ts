import type { JSONRPCMessage, JSONRPCRequest, Server } from '@modelcontextprotocol/server';
import type { IMcpToolOptions } from 'vona-module-a-openapiutils';
import type { IPassport } from 'vona-module-a-user';

import { fromJsonSchema, InMemoryTransport } from '@modelcontextprotocol/server';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { appMetadata, appResource, runWithZodQueryCoercion } from 'vona';
import { acquireTestLock, app } from 'vona-mock';
import { getKeyHash } from 'vona-module-a-cache';
import { $schema, Mcp, SymbolMcpOptions } from 'vona-module-a-openapiutils';
import { recordResourceNameToRoutePath } from 'vona-module-a-web';
import { createControllerToolServer, createSharedBusinessToolServer } from 'vona-module-cabloy-mcp';

import {
  closeMutationInputSchema,
  isPrimitiveSchema,
  normalizeDateTransport,
  serializeDateTransport,
  toolSchema,
} from '../../cabloy-mcp/src/lib/controllerToolSchema.ts';
import { ControllerCatalog } from '../src/controller/catalog.ts';
import { ControllerToolFixture, toolFixtureState } from '../src/controller/toolFixture.ts';
import { DtoCategoryPublic } from '../src/dto/categoryPublic.tsx';
import { DtoCategoryPublicSelectReq } from '../src/dto/categoryPublicSelectReq.tsx';
import { DtoCategoryPublicSelectRes } from '../src/dto/categoryPublicSelectRes.tsx';
import { DtoProductPublicDetail } from '../src/dto/productPublicDetail.tsx';
import { DtoProductPublicSelectRes } from '../src/dto/productPublicSelectRes.tsx';
import { createBusinessToolServer } from '../src/lib/businessTools.ts';
import { ServiceCatalog } from '../src/service/catalog.ts';

async function connect(server: Server) {
  const [client, transport] = InMemoryTransport.createLinkedPair();
  let id = 0;
  const pending = new Map<number, (message: any) => void>();
  client.onmessage = (message: JSONRPCMessage) => {
    if ('id' in message && typeof message.id === 'number') {
      const resolve = pending.get(message.id);
      pending.delete(message.id);
      resolve?.(message);
    }
  };
  await client.start();
  await server.connect(transport);
  const request = async (method: string, params?: Record<string, unknown>): Promise<any> => {
    const requestId = ++id;
    const response = new Promise(resolve => pending.set(requestId, resolve));
    await client.send({ jsonrpc: '2.0', id: requestId, method, params } as JSONRPCRequest);
    return await response;
  };
  await request('initialize', {
    protocolVersion: '2025-11-25',
    capabilities: {},
    clientInfo: { name: 'business-tool-test', version: '1.0.0' },
  });
  await client.send({ jsonrpc: '2.0', method: 'notifications/initialized' });
  return { request, close: () => server.close() };
}

const toolName = 'commerce_products_search';
const detailToolName = 'commerce_product_detail';
const categoryToolName = 'commerce_categories_list';
const statusToolName = 'mcp_test_action_status';
const effectToolName = 'mcp_test_action_effect';
const scalarToolName = 'mcp_test_action_scalar';
const arrayToolName = 'mcp_test_action_array';
const studentToolNames = [
  'training_student_aggregate',
  'training_student_create',
  'training_student_delete',
  'training_student_group',
  'training_student_select',
  'training_student_summary',
  'training_student_update',
  'training_student_view',
];

async function withStudentToolPermissions(fn: () => Promise<void>) {
  await app.bean.executor.mockCtx(async () => {
    const passportPrevious = app.bean.passport.current;
    const passport: IPassport = {
      user: {
        id: 'mcp-student-contract-user',
        name: 'MCP student contract fixture',
        activated: true,
        accountStatus: 'active',
      },
      auth: { id: 'mcp-student-contract-auth' },
      roles: [],
    };
    const context = app.ctx;
    const controller = 'training-student.controller.student';
    // A context-local policy grants the real guards, not the discovery checker.
    // Synthetic Passport state needs no persisted user, role membership or token.
    const off = app.scope('a-rbac').event.resolvePolicy.on((request, next) => {
      if (
        app.ctx !== context ||
        app.bean.passport.currentUser?.id !== passport.user!.id ||
        request.action.controllerBeanFullName !== controller ||
        !['select', 'group', 'aggregate', 'view', 'summary', 'create', 'update', 'delete'].includes(
          request.action.action,
        )
      ) {
        return next();
      }
      assert.equal(app.bean.passport.currentAuth?.id, passport.auth!.id);
      assert.deepEqual(app.bean.passport.currentRoles, []);
      const inherited = ['create', 'update', 'delete'].includes(request.action.action)
        ? request.action.action
        : ['view', 'summary'].includes(request.action.action)
          ? 'view'
          : 'select';
      assert.equal(request.policyActionKey, `${controller}#${inherited}`);
      return { allowed: true, actionKey: request.action.actionKey, action: request.action };
    });
    try {
      await app.bean.passport.setCurrent(passport);
      await fn();
    } finally {
      off();
      await app.bean.passport.setCurrent(passportPrevious);
    }
  });
}

describe('businessTools.test.ts', { concurrency: false, timeout: 60000 }, () => {
  it('closes cloned mutation shapes without changing maps, metadata or source contracts', async () => {
    const metadata = { type: 'object', properties: { label: { type: 'string' } } };
    const node = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        children: { type: 'array', items: { $ref: '#/components/schemas/Node' } },
      },
      rest: metadata,
      default: metadata,
      examples: [metadata],
    };
    const source = {
      type: 'object',
      properties: {
        nodes: {
          anyOf: [
            { type: 'array', items: { $ref: '#/components/schemas/Node' } },
            { type: 'null' },
          ],
        },
        open: { type: 'object', properties: {}, additionalProperties: true },
        map: { type: 'object', additionalProperties: { type: 'string' } },
        loose: { type: 'object' },
        split: {
          allOf: [
            { type: 'object', properties: { a: { type: 'string' } } },
            { type: 'object', properties: { b: { type: 'string' } } },
          ],
        },
      },
    };
    const snapshot = JSON.stringify({ source, node });
    const schema = toolSchema(source, { Node: node });
    closeMutationInputSchema(schema);
    const copied = (schema as any).components.schemas.Node;
    assert.equal(copied.additionalProperties, false);
    assert.deepEqual(copied.rest, metadata);
    assert.deepEqual(copied.default, metadata);
    assert.deepEqual(copied.examples, [metadata]);
    assert.equal(JSON.stringify({ source, node }), snapshot);
    const check = fromJsonSchema(schema as Parameters<typeof fromJsonSchema>[0])['~standard'];
    const valid = {
      nodes: [{ name: 'parent', children: [{ name: 'child' }] }],
      open: { any: 1 },
      map: { a: 'value' },
      loose: { any: true },
      split: { a: 'a', b: 'b' },
    };
    assert.equal((await check.validate(valid)).issues, undefined);
    assert.equal((await check.validate({ ...valid, nodes: null })).issues, undefined);
    assert.ok((await check.validate({ ...valid, nodes: [{ name: 'bad', unknown: true }] })).issues);
    assert.ok((await check.validate({ ...valid, map: { a: 1 } })).issues);
    assert.ok(isPrimitiveSchema({ anyOf: [{ type: 'number' }, { type: 'string' }] }, {}));
    assert.ok(isPrimitiveSchema({ enum: [null, 'value'] }, {}));
    assert.equal(isPrimitiveSchema({ anyOf: [{ type: 'string' }, { type: 'object' }] }, {}), false);
    assert.equal(isPrimitiveSchema({}, {}), false);
    assert.equal(
      isPrimitiveSchema(
        { $ref: '#/components/schemas/Loop' },
        { Loop: { anyOf: [{ $ref: '#/components/schemas/Loop' }] } },
      ),
      false,
    );
    const dateSchema = {
      type: 'object',
      properties: {
        trainingRecords: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/Record',
          },
        },
      },
    };
    const dateValue = '2026-05-12T08:00:00.000Z';
    const normalized = normalizeDateTransport(
      { trainingRecords: [{ trainingTime: dateValue, invalid: 'kept' }] },
      dateSchema,
      {
        Record: {
          type: 'object',
          properties: { trainingTime: { type: 'string', format: 'date-time' } },
          additionalProperties: true,
        },
      },
    ) as any;
    assert.ok(normalized.trainingRecords[0].trainingTime instanceof Date);
    assert.equal(normalized.trainingRecords[0].trainingTime.toISOString(), dateValue);
    assert.equal(normalized.trainingRecords[0].invalid, 'kept');
    const invalidDate = normalizeDateTransport(
      { trainingTime: 'not-a-date' },
      { type: 'object', properties: { trainingTime: { type: 'string', format: 'date-time' } } },
      {},
    ) as any;
    assert.equal(invalidDate.trainingTime, 'not-a-date');
    const dateSchemas = {
      Record: {
        type: 'object',
        properties: {
          trainingTime: { type: ['string', 'null'], format: 'date-time' },
          day: { type: 'string', format: 'date' },
        },
        additionalProperties: false,
      },
    };
    const transport = toolSchema(dateSchema, dateSchemas);
    const transportSnapshot = JSON.stringify(transport);
    const dateCheck = fromJsonSchema(transport as Parameters<typeof fromJsonSchema>[0])[
      '~standard'
    ];
    const native = new Date(dateValue);
    const nativeArgs = { trainingRecords: [{ trainingTime: native, day: native }] };
    const serialized = serializeDateTransport(nativeArgs, transport, dateSchemas);
    assert.deepEqual(serialized, {
      trainingRecords: [{ trainingTime: dateValue, day: '2026-05-12' }],
    });
    assert.equal(nativeArgs.trainingRecords[0].trainingTime, native);
    assert.equal((await dateCheck.validate(serialized)).issues, undefined);
    assert.equal(
      (await dateCheck.validate({ trainingRecords: [{ trainingTime: null }] })).issues,
      undefined,
    );
    assert.ok(
      (await dateCheck.validate({ trainingRecords: [{ trainingTime: 'not-a-date' }] })).issues,
    );
    assert.equal(JSON.stringify(transport), transportSnapshot);
  });
  let release: (() => void) | undefined;
  before(async () => {
    assert.ok(app.meta.modules['mcp-test'], 'fixture module is loaded');
    assert.ok(app.meta.modules['cabloy-mcp'], 'core module is loaded');
    if ((process.env.PROJECT_DISABLED_SUITES ?? '').split(',').includes('a-training')) {
      assert.equal(app.meta.modules['training-student'], undefined);
    }
    if ((process.env.PROJECT_DISABLED_SUITES ?? '').split(',').includes('a-commerce')) {
      assert.deepEqual(
        Object.keys(app.meta.modules).filter(
          name => name.startsWith('commerce-') || name === 'test-pay',
        ),
        [],
        'disabled Commerce modules are absent from the actual runtime composition',
      );
    }
    release = await acquireTestLock('mcp-test');
  });
  after(() => release?.());

  it('discovers another resource dynamically with its own current guards and scope ceiling', async t => {
    await app.bean.executor.mockCtx(async () => {
      const resource = recordResourceNameToRoutePath['test-rest:product'];
      assert.ok(resource, 'the second resource fixture is registered');
      const controller = resource.controller;
      const name = 'test-rest_product_create';
      const original = appMetadata.getMetadata;
      const metadata = t.mock.method(
        appMetadata,
        'getMetadata',
        function (...args: Parameters<typeof original>) {
          const [key, target, action] = args;
          if (key === SymbolMcpOptions && target === controller.prototype && action === 'create') {
            return {};
          }
          return original.apply(appMetadata, args);
        },
      );
      const passportPrevious = app.bean.passport.current;
      const passport: IPassport = {
        user: {
          id: 'mcp-resource-discovery-user',
          name: 'MCP resource discovery fixture',
          activated: true,
          accountStatus: 'active',
        },
        roles: [],
      };
      const business = t.mock.method(controller.prototype, 'create', async () => {
        assert.fail('discovery and denied calls must not enter the business Action');
      });
      const clients: Awaited<ReturnType<typeof connect>>[] = [];
      try {
        await app.bean.passport.setCurrent(passport);
        const all = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
        clients.push(all);
        const read = await connect(await createSharedBusinessToolServer(app, 'mcp:read'));
        clients.push(read);
        const names = async (client: typeof all) => {
          const listed = await client.request('tools/list');
          assert.equal(listed.error, undefined);
          return listed.result.tools.map((tool: any) => tool.name) as string[];
        };
        assert.equal((await names(all)).includes(name), false, 'the Action requires its own role');
        passport.roles = [
          { id: 'mcp-resource-admin', name: 'systemAdmin', title: 'Admin', siteIds: [] },
        ];
        await app.bean.passport.setCurrent(passport);
        assert.equal(
          (await names(all)).includes(name),
          true,
          'no business allowlist change is needed',
        );
        assert.equal((await names(read)).includes(name), false, 'read scope excludes mutations');
        const args = { name: 'Dynamic product', price: 1, quantity: 1, amount: 1 };
        const scoped = await read.request('tools/call', { name, arguments: args });
        assert.equal(scoped.error?.code, -32602);
        for (const excluded of ['test-rest_product_select', statusToolName, toolName]) {
          assert.equal((await names(all)).includes(excluded), false);
          const rejected = await all.request('tools/call', { name: excluded, arguments: {} });
          assert.equal(
            rejected.error?.code,
            -32602,
            'unannotated and non-resource Actions stay closed',
          );
        }
        passport.roles = [];
        await app.bean.passport.setCurrent(passport);
        assert.equal(
          (await names(all)).includes(name),
          false,
          'the same server checks fresh guards',
        );
        const denied = await all.request('tools/call', { name, arguments: args });
        assert.equal(denied.error, undefined, 'valid input reaches ordinary Action authorization');
        assert.equal(denied.result.isError, true);
        assert.equal(business.mock.callCount(), 0);
      } finally {
        for (const client of clients) await client.close();
        business.mock.restore();
        metadata.mock.restore();
        await app.bean.passport.setCurrent(passportPrevious);
      }
    });
  });

  it('keeps all eight student tools out of default/anonymous discovery and validates their authorized shared contracts', async t => {
    await app.bean.executor.mockCtx(async () => {
      assert.equal(app.bean.passport.isAuthenticated, false);
      const anonymous = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
      try {
        const listed = await anonymous.request('tools/list');
        assert.equal(listed.error, undefined);
        for (const name of studentToolNames) {
          assert.equal(
            listed.result.tools.some((tool: any) => tool.name === name),
            false,
            `anonymous discovery excludes ${name}`,
          );
        }
      } finally {
        await anonymous.close();
      }
    });
    await withStudentToolPermissions(async () => {
      const standalone = await connect(await createBusinessToolServer(app));
      try {
        const listed = await standalone.request('tools/list');
        assert.deepEqual(
          listed.result.tools.map((tool: any) => tool.name),
          [toolName, detailToolName, categoryToolName],
        );
        for (const name of studentToolNames) {
          const rejected = await standalone.request('tools/call', {
            name,
            arguments: [
              'training_student_summary',
              'training_student_view',
              'training_student_delete',
            ].includes(name)
              ? { id: '1' }
              : {},
          });
          assert.equal(rejected.error.code, -32602);
        }
      } finally {
        await standalone.close();
      }
      const server = await createSharedBusinessToolServer(app, 'mcp:all');
      const shared = await connect(server);
      const action = t.mock.method(app.bean.executor, 'performAction', async () => {
        assert.fail('discovery and invalid arguments must not dispatch business Actions');
      });
      try {
        const listed = await shared.request('tools/list');
        assert.equal(listed.error, undefined);
        assert.equal(action.mock.callCount(), 0, 'discovery runs guards without business Actions');
        assert.deepEqual(
          listed.result.tools.map((tool: any) => tool.name).sort(),
          (app.meta.modules['training-student'] ? [...studentToolNames] : []).sort(),
        );
        const select = listed.result.tools.find(
          (tool: any) => tool.name === 'training_student_select',
        );
        const student = listed.result.tools.find(
          (tool: any) => tool.name === 'training_student_summary',
        );
        const view = listed.result.tools.find((tool: any) => tool.name === 'training_student_view');
        const create = listed.result.tools.find(
          (tool: any) => tool.name === 'training_student_create',
        );
        const update = listed.result.tools.find(
          (tool: any) => tool.name === 'training_student_update',
        );
        if (!app.meta.modules['training-student']) {
          assert.equal(update, undefined);
          assert.equal(create, undefined);
          assert.equal(view, undefined);
          assert.equal(select, undefined);
          assert.equal(student, undefined);
          return;
        }
        assert.deepEqual(
          server.diagnostics.filter(
            diagnostic =>
              diagnostic.controller === 'training-student.controller.student' &&
              ['select', 'group', 'aggregate'].includes(diagnostic.action),
          ),
          [],
          'the existing filter-backed select and analysis contracts are representable without diagnostics',
        );
        for (const tool of listed.result.tools) {
          assert.ok(!tool.description.includes('Level values:'), tool.name);
        }
        assert.ok(select);
        assert.equal(select.annotations.readOnlyHint, true);
        assert.deepEqual(Object.keys(select.inputSchema.properties).sort(), [
          'columns',
          'createdAt',
          'level',
          'name',
          'orders',
          'pageNo',
          'pageSize',
          'where',
        ]);
        assert.equal(select.inputSchema.additionalProperties, false);
        assert.equal(select.inputSchema.properties.name.type, 'string');
        assert.equal(select.inputSchema.properties.name.maxLength, undefined);
        assert.ok(!select.inputSchema.required?.includes('level'));
        const selectCheck = fromJsonSchema(select.inputSchema)['~standard'];
        assert.equal((await selectCheck.validate({})).issues, undefined);
        for (const level of [1, 2, 3]) {
          assert.equal((await selectCheck.validate({ level })).issues, undefined);
        }
        const ormQuery = app.util.getModuleConfigRaw('a-orm')?.rest?.query;
        assert.equal(select.inputSchema.properties.pageNo.type, 'number');
        assert.equal(select.inputSchema.properties.pageNo.minimum, 1);
        assert.equal(select.inputSchema.properties.pageNo.default, 1);
        assert.equal(select.inputSchema.properties.pageSize.type, 'number');
        assert.equal(select.inputSchema.properties.pageSize.minimum, 1);
        assert.equal(
          select.inputSchema.properties.pageSize.default,
          ormQuery?.pageSize?.default ?? 20,
        );
        assert.equal(
          select.inputSchema.properties.pageSize.maximum,
          ormQuery?.pageSize?.max ?? 100,
        );
        assert.equal(
          select.inputSchema.properties.orders.default,
          ormQuery?.orders?.default ?? 'createdAt,desc',
        );
        assert.deepEqual(Object.keys(select.outputSchema.properties).sort(), [
          'list',
          'pageCount',
          'pageNo',
          'pageSize',
          'total',
        ]);
        assert.equal(select.outputSchema.properties.total.type, 'string');
        assert.equal(select.outputSchema.properties.list.type, 'array');
        const selectItemRef = select.outputSchema.properties.list.items.$ref;
        assert.equal(typeof selectItemRef, 'string');
        assert.ok(selectItemRef.startsWith('#/components/schemas/'));
        const selectItem =
          select.outputSchema.components.schemas[
            selectItemRef.slice('#/components/schemas/'.length)
          ];
        assert.ok(selectItem);
        for (const field of [
          'id',
          'createdAt',
          'updatedAt',
          'deleted',
          'iid',
          'name',
          'mobile',
          'imageId',
          'level',
          'image',
          '_operationsRow',
        ]) {
          assert.ok(selectItem.properties[field], `full select output retains ${field}`);
        }
        assert.equal(selectItem.properties.mobile.type, 'string');
        assert.ok(selectItem.properties.level.description);
        assert.equal(
          select.inputSchema.properties.level.description,
          selectItem.properties.level.description,
        );
        assert.equal(select.inputSchema.properties.level.title, selectItem.properties.level.title);
        assert.equal(
          select.inputSchema.properties.level.rest.form.render,
          'basic-select:formFieldSelect',
        );
        assert.ok(!selectItem.required.includes('imageId'));
        for (const args of [
          ...[null, '1', 1.5, 0, 4].map(level => ({ level })),
          { pageNo: 0 },
          { pageSize: '1' },
          { where: 'not-an-object' },
          { iid: 'injected' },
          { instanceName: 'shareTest' },
          { route: '/training/student' },
          { innerAccess: true },
          { headers: { authorization: 'injected' } },
          { userId: 'injected' },
        ]) {
          const rejected = await shared.request('tools/call', {
            name: select.name,
            arguments: args,
          });
          assert.deepEqual(
            rejected.error,
            { code: -32602, message: 'Invalid tool arguments' },
            JSON.stringify(args),
          );
        }
        assert.ok(view);
        assert.equal(view.annotations.readOnlyHint, true);
        assert.equal(view.annotations.destructiveHint, false);
        assert.deepEqual(Object.keys(view.inputSchema.properties), ['id']);
        assert.deepEqual(view.inputSchema.required, ['id']);
        assert.equal(view.inputSchema.additionalProperties, false);
        assert.deepEqual(
          server.diagnostics.filter(
            diagnostic =>
              diagnostic.controller === 'training-student.controller.student' &&
              diagnostic.action === 'view',
          ),
          [],
          'the complete existing detail contract is representable without diagnostics',
        );
        for (const field of ['id', 'mobile', 'content', 'trainingRecords', 'image']) {
          assert.ok(view.outputSchema.properties[field], `complete view schema retains ${field}`);
        }
        for (const field of ['descriptionMarkdown', 'trainingRecordSubjects', 'url', 'signed']) {
          assert.ok(
            JSON.stringify(view.outputSchema).includes(`"${field}"`),
            `reachable detail schemas retain ${field}`,
          );
        }
        for (const args of [
          {},
          { id: null },
          { id: true },
          { id: '' },
          { id: [] },
          { id: {} },
          ...['iid', 'route', 'method', 'headers', 'innerAccess', 'instanceName', 'userId'].map(
            key => ({ id: '123', [key]: 'injected' }),
          ),
        ]) {
          const rejected = await shared.request('tools/call', {
            name: view.name,
            arguments: args,
          });
          assert.deepEqual(rejected.error, { code: -32602, message: 'Invalid tool arguments' });
        }
        assert.ok(student);
        assert.deepEqual(Object.keys(student.inputSchema.properties), ['id']);
        assert.deepEqual(student.inputSchema.required, ['id']);
        assert.equal(student.inputSchema.additionalProperties, false);
        assert.deepEqual(Object.keys(student.outputSchema.properties).sort(), [
          'descriptionLength',
          'id',
          'level',
          'levelTitle',
          'name',
          'summaryText',
        ]);
        for (const field of ['mobile', 'descriptionMarkdown', 'descriptionHtml']) {
          assert.equal(JSON.stringify(student).includes(`\"${field}\"`), false);
        }
        assert.equal(student.annotations.readOnlyHint, true);
        for (const args of [
          {},
          { id: null },
          { id: true },
          { id: [] },
          { id: {} },
          { id: '' },
          ...['route', 'method', 'headers', 'innerAccess', 'instanceName', 'userId'].map(key => ({
            id: '1',
            [key]: 'injected',
          })),
        ]) {
          const rejected = await shared.request('tools/call', {
            name: student.name,
            arguments: args,
          });
          assert.equal(rejected.error?.code, -32602, JSON.stringify(args));
        }
        assert.ok(create);
        assert.equal(create.annotations.readOnlyHint, false);
        assert.deepEqual(
          server.diagnostics.filter(
            diagnostic =>
              diagnostic.controller === 'training-student.controller.student' &&
              diagnostic.action === 'create',
          ),
          [],
          'the existing aggregate create contract is representable without diagnostics',
        );
        assert.deepEqual(Object.keys(create.inputSchema.properties).sort(), [
          '_trainingRecords',
          'content',
          'imageId',
          'level',
          'mobile',
          'name',
          'trainingRecords',
        ]);
        assert.deepEqual(create.inputSchema.required.toSorted(), ['level', 'mobile', 'name']);
        assert.equal(create.inputSchema.additionalProperties, false);
        assert.equal(create.inputSchema.properties.body, undefined, 'one body binds flat');
        const resolveCreateSchema = (schema: any) =>
          schema.$ref
            ? create.inputSchema.components.schemas[
                schema.$ref.slice('#/components/schemas/'.length)
              ]
            : schema;
        const content = resolveCreateSchema(create.inputSchema.properties.content);
        const record = resolveCreateSchema(create.inputSchema.properties.trainingRecords.items);
        const subject = resolveCreateSchema(record.properties.trainingRecordSubjects.items);
        assert.ok(content.properties.descriptionMarkdown);
        assert.ok(record.properties.name);
        assert.ok(record.properties.trainingRecordSubjects);
        assert.ok(subject.properties.name);
        assert.ok(subject.properties.score);
        for (const [schema, foreignKey] of [
          [content, 'studentId'],
          [record, 'studentId'],
          [subject, 'recordId'],
        ] as const) {
          for (const field of ['id', 'deleted', foreignKey]) {
            assert.equal(schema.properties[field], undefined, `nested create excludes ${field}`);
          }
        }
        const { DtoStudentCreate, DtoStudentUpdate, DtoDetailRecordMutate } =
          await import('vona-module-training-student');
        const { DtoDetailRecordSubjectMutate } = await import('vona-module-training-record');
        const document = await app.bean.openapi.generateJsonOfClasses(
          [DtoStudentCreate, DtoStudentUpdate, DtoDetailRecordMutate, DtoDetailRecordSubjectMutate],
          'V31',
        );
        const schemas = document.components!.schemas! as Record<string, any>;
        const component = (Class: any) => schemas[appResource.getBeanFullName(Class)!];
        const resolve = (schema: any): any =>
          schema.$ref
            ? resolve(schemas[schema.$ref.slice('#/components/schemas/'.length)])
            : schema;
        const studentCreate = component(DtoStudentCreate);
        const recordCreate = resolve(studentCreate.properties.trainingRecords.items);
        const subjectCreate = resolve(recordCreate.properties.trainingRecordSubjects.items);
        for (const schema of [recordCreate, subjectCreate]) {
          assert.equal(schema.rest?.blocks?.[0]?.render, 'basic-details:blockForm');
        }
        const subjectsField = recordCreate.properties.trainingRecordSubjects;
        const subjectsOriginal = component(DtoDetailRecordMutate).properties.trainingRecordSubjects;
        assert.ok(subjectsField.title);
        assert.deepEqual(subjectsField.title, subjectsOriginal.title);
        assert.equal(subjectsField.rest?.form?.render, 'basic-details:formFieldDetails');
        assert.equal(subjectsField.rest?.order, 1008);
        assert.ok(subjectsField.rest?.onEffect);
        assert.deepEqual(subjectsField.rest.onEffect, subjectsOriginal.rest.onEffect);
        assert.equal(studentCreate.properties.trainingRecords.rest.order, 1006);
        assert.equal(studentCreate.properties._trainingRecords.rest.visible, false);
        assert.equal(recordCreate.properties._trainingRecordSubjects.rest.visible, false);
        const recordUpdate = resolve(component(DtoStudentUpdate).properties.trainingRecords.items);
        const subjectUpdate = resolve(recordUpdate.properties.trainingRecordSubjects.items);
        for (const schema of [
          component(DtoDetailRecordMutate),
          component(DtoDetailRecordSubjectMutate),
          recordUpdate,
          subjectUpdate,
        ]) {
          assert.ok(schema.properties.id, 'update/mutate retains child identity');
          assert.ok(schema.properties.deleted, 'update/mutate retains child deletion control');
        }
        assert.deepEqual(Object.keys(create.outputSchema.properties), ['result']);
        assert.deepEqual(create.outputSchema.required, ['result']);
        assert.equal(create.outputSchema.additionalProperties, false);
        assert.deepEqual(create.outputSchema.properties.result, {
          anyOf: [{ type: 'number' }, { type: 'string' }],
        });
        const validCreate = { name: '__MCP create__', mobile: '13812345678', level: 2 };
        for (const args of [
          {},
          { ...validCreate, name: 'x' },
          { ...validCreate, mobile: 'short' },
          { ...validCreate, level: '2' },
          { ...validCreate, level: 4 },
          { ...validCreate, content: 'not-an-object' },
          { ...validCreate, trainingRecords: 'not-an-array' },
          { ...validCreate, trainingRecords: [{ name: 'x' }] },
          ...[
            { id: '123' },
            { deleted: true },
            { recordId: '123' },
            { unexpected: true },
            { name: 'x' },
            { score: '95' },
          ].map(fields => ({
            ...validCreate,
            trainingRecords: [
              {
                name: '__MCP record__',
                trainingRecordSubjects: [{ name: '__Math__', score: 95, ...fields }],
              },
            ],
          })),
          { ...validCreate, content: { descriptionMarkdown: 'Owned', studentId: '123' } },
          ...[{ studentId: '123' }, { id: '123' }, { deleted: true }].map(fields => ({
            ...validCreate,
            trainingRecords: [{ name: '__MCP record__', ...fields }],
          })),
          { body: validCreate },
          ...[
            'id',
            'iid',
            'deleted',
            'route',
            'method',
            'headers',
            'innerAccess',
            'instanceName',
            'userId',
          ].map(key => ({ ...validCreate, [key]: 'injected' })),
        ]) {
          const rejected = await shared.request('tools/call', {
            name: create.name,
            arguments: args,
          });
          assert.deepEqual(
            rejected.error,
            { code: -32602, message: 'Invalid tool arguments' },
            JSON.stringify(args),
          );
        }
        assert.ok(update);
        assert.equal(update.annotations.readOnlyHint, false);
        assert.deepEqual(
          server.diagnostics.filter(
            diagnostic =>
              diagnostic.controller === 'training-student.controller.student' &&
              diagnostic.action === 'update',
          ),
          [],
          'the existing aggregate update contract is representable without diagnostics',
        );
        assert.deepEqual(Object.keys(update.inputSchema.properties).sort(), ['body', 'params']);
        assert.deepEqual(update.inputSchema.required.toSorted(), ['body', 'params']);
        assert.equal(update.inputSchema.additionalProperties, false);
        const resolveUpdateSchema = (schema: any) =>
          schema.$ref
            ? update.inputSchema.components.schemas[
                schema.$ref.slice('#/components/schemas/'.length)
              ]
            : schema;
        const updateParams = resolveUpdateSchema(update.inputSchema.properties.params);
        const updateBody = resolveUpdateSchema(update.inputSchema.properties.body);
        assert.deepEqual(Object.keys(updateParams.properties), ['id']);
        assert.deepEqual(updateParams.required, ['id']);
        assert.equal(updateParams.additionalProperties, false);
        assert.deepEqual(Object.keys(updateBody.properties).sort(), [
          '_trainingRecords',
          'content',
          'imageId',
          'level',
          'mobile',
          'name',
          'trainingRecords',
        ]);
        assert.deepEqual(updateBody.required.toSorted(), ['level', 'mobile', 'name']);
        assert.equal(updateBody.additionalProperties, false);
        const updateContent = resolveUpdateSchema(updateBody.properties.content);
        const updateRecord = resolveUpdateSchema(updateBody.properties.trainingRecords.items);
        const updateSubject = resolveUpdateSchema(
          updateRecord.properties.trainingRecordSubjects.items,
        );
        assert.ok(updateContent.properties.descriptionMarkdown);
        assert.equal(updateContent.properties.studentId, undefined);
        for (const [schema, foreignKey] of [
          [updateRecord, 'studentId'],
          [updateSubject, 'recordId'],
        ] as const) {
          assert.ok(schema.properties.id, 'nested update retains child identity');
          assert.ok(schema.properties.deleted, 'nested update retains child deletion control');
          assert.equal(schema.properties[foreignKey], undefined);
          assert.equal(schema.additionalProperties, false);
        }
        assert.equal(updateContent.additionalProperties, false);
        assert.deepEqual(Object.keys(update.outputSchema.properties), ['result']);
        assert.deepEqual(update.outputSchema.required, ['result']);
        assert.equal(update.outputSchema.additionalProperties, false);
        assert.deepEqual(update.outputSchema.properties.result, { type: 'null' });
        assert.equal(action.mock.callCount(), 0, 'invalid input never reaches business Actions');
      } finally {
        action.mock.restore();
        await shared.close();
      }
    });
  });

  it('normalizes declared JSON dates before native request binding without broad coercion', async t => {
    if (!app.meta.modules['training-student']) return;
    await withStudentToolPermissions(async () => {
      const server = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
      const action = t.mock.method(
        app.bean.executor,
        'performAction',
        async (...args: Parameters<typeof app.bean.executor.performAction>) => {
          assert.equal(args[0], 'post');
          const body = (args[2] as any).body;
          const record = body.trainingRecords[0];
          assert.ok(record.trainingTime instanceof Date);
          return 'date-normalized';
        },
      );
      const body = {
        name: '__MCP date transport__',
        mobile: '13812345678',
        level: 2,
        trainingRecords: [
          {
            name: '__MCP date record__',
            trainingTime: '2026-05-12T08:00:00.000Z',
          },
        ],
      };
      try {
        const valid = await server.request('tools/call', {
          name: 'training_student_create',
          arguments: body,
        });
        assert.equal(valid.error, undefined);
        assert.deepEqual(valid.result.structuredContent, { result: 'date-normalized' });
        assert.equal(action.mock.callCount(), 1);
        const invalid = await server.request('tools/call', {
          name: 'training_student_create',
          arguments: {
            ...body,
            trainingRecords: [{ ...body.trainingRecords[0], trainingTime: 'not-a-date' }],
          },
        });
        assert.deepEqual(invalid.error, { code: -32602, message: 'Invalid tool arguments' });
        assert.equal(action.mock.callCount(), 1, 'invalid date never reaches dispatch');
      } finally {
        action.mock.restore();
        await server.close();
      }
    });
  });

  it('binds create to the fixed POST body, wraps only its identity and blocks read scope before dispatch', async t => {
    if (!app.meta.modules['training-student']) return;
    await withStudentToolPermissions(async () => {
      const read = await connect(await createSharedBusinessToolServer(app, 'mcp:read'));
      const all = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
      const body = {
        name: '__MCP aggregate create__',
        _trainingRecords: [],
        mobile: '13812345678',
        level: 2,
        content: { descriptionMarkdown: '# Synthetic student\n\nCreated through MCP.' },
        trainingRecords: [
          {
            name: '__MCP record__',
            description: 'Synthetic record',
            _trainingRecordSubjects: [],
            trainingRecordSubjects: [
              { name: '__Math__', score: 95, description: 'Synthetic subject' },
            ],
          },
        ],
      };
      const identity =
        app.util.getModuleConfigRaw('a-orm')?.table?.identityType === 'number' ? 123 : '123';
      // Binding/output only; businessHttp owns the real persisted create and cleanup.
      const action = t.mock.method(
        app.bean.executor,
        'performAction',
        async (..._args: Parameters<typeof app.bean.executor.performAction>) => identity,
      );
      try {
        const listed = await read.request('tools/list');
        assert.equal(listed.error, undefined);
        assert.deepEqual(
          listed.result.tools.map((tool: any) => tool.name).sort(),
          studentToolNames
            .filter(
              name =>
                ![
                  'training_student_create',
                  'training_student_update',
                  'training_student_delete',
                ].includes(name),
            )
            .toSorted(),
        );
        assert.equal(action.mock.callCount(), 0, 'discovery never trial-creates');
        const denied = await read.request('tools/call', {
          name: 'training_student_create',
          arguments: body,
        });
        assert.deepEqual(denied.error, { code: -32602, message: 'Tool unavailable' });
        assert.equal(
          action.mock.callCount(),
          0,
          'read scope rejects the known name before dispatch',
        );
        const call = () =>
          all.request('tools/call', { name: 'training_student_create', arguments: body });
        const accepted = await call();
        assert.equal(accepted.error, undefined);
        assert.notEqual(accepted.result.isError, true);
        assert.deepEqual(action.mock.calls[0].arguments, [
          'post',
          '/training/student',
          { body, innerAccess: false },
        ]);
        assert.deepEqual(accepted.result.structuredContent, { result: identity });
        assert.deepEqual(JSON.parse(accepted.result.content[0].text), { result: identity });
        assert.equal(action.mock.callCount(), 1, 'one call dispatches one create');
        action.mock.mockImplementation(
          async () => ({ id: identity, private: 'not-an-identity' }) as any,
        );
        const invalid = await call();
        assert.equal(invalid.error, undefined);
        assert.equal(invalid.result.isError, true);
        assert.equal(invalid.result.structuredContent, undefined);
        assert.deepEqual(invalid.result.content, [{ type: 'text', text: 'Action failed' }]);
        assert.equal(action.mock.callCount(), 2, 'invalid output is not retried');
        action.mock.mockImplementation(async () => [identity] as any);
        const invalidArray = await call();
        assert.equal(invalidArray.result.isError, true);
        assert.equal(invalidArray.result.structuredContent, undefined);
        assert.deepEqual(invalidArray.result.content, [{ type: 'text', text: 'Action failed' }]);
        assert.equal(action.mock.callCount(), 3, 'array output is not coerced or retried');
        for (const raw of [123, '123']) {
          action.mock.mockImplementation(async () => raw);
          const valid = await call();
          assert.notEqual(valid.result.isError, true);
          assert.deepEqual(valid.result.structuredContent, { result: identity });
          assert.deepEqual(JSON.parse(valid.result.content[0].text), { result: identity });
        }
        assert.equal(action.mock.callCount(), 5);
      } finally {
        action.mock.restore();
        await read.close();
        await all.close();
      }
    });
  });

  it('binds update to fixed PATCH params/body, acknowledges null and never replays output failures', async t => {
    if (!app.meta.modules['training-student']) return;
    await withStudentToolPermissions(async () => {
      const read = await connect(await createSharedBusinessToolServer(app, 'mcp:read'));
      const all = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
      const params = { id: '123' };
      const body = {
        name: '__MCP aggregate update__',
        mobile: '13812345678',
        level: 2,
        content: { descriptionMarkdown: '# Synthetic student\n\nUpdated through MCP.' },
        trainingRecords: [
          {
            id: '456',
            deleted: false,
            name: '__MCP existing record__',
            trainingRecordSubjects: [
              { id: '789', deleted: true, name: '__Deleted subject__', score: 90 },
              { name: '__New subject__', score: 95 },
            ],
          },
          { id: '457', deleted: true, name: '__Deleted record__' },
          { name: '__New record__' },
        ],
      };
      const args = { params, body };
      // Binding/output only; businessHttp owns persisted update and real executor null proof.
      const action = t.mock.method(
        app.bean.executor,
        'performAction',
        async (..._args: Parameters<typeof app.bean.executor.performAction>) => null,
      );
      try {
        const listed = await read.request('tools/list');
        assert.equal(listed.error, undefined);
        assert.deepEqual(
          listed.result.tools.map((tool: any) => tool.name).sort(),
          studentToolNames
            .filter(
              name =>
                ![
                  'training_student_create',
                  'training_student_update',
                  'training_student_delete',
                ].includes(name),
            )
            .toSorted(),
        );
        assert.equal(action.mock.callCount(), 0, 'discovery never trial-updates');
        const denied = await read.request('tools/call', {
          name: 'training_student_update',
          arguments: args,
        });
        assert.deepEqual(denied.error, { code: -32602, message: 'Tool unavailable' });
        assert.equal(action.mock.callCount(), 0, 'read scope rejects known update before dispatch');
        const unknown = await all.request('tools/call', {
          name: 'training_student_update_unknown',
          arguments: args,
        });
        assert.deepEqual(unknown.error, { code: -32602, message: 'Tool unavailable' });
        const record = body.trainingRecords[0];
        const subject = record.trainingRecordSubjects![0];
        for (const invalidArgs of [
          undefined,
          {},
          body,
          { id: params.id, body },
          { ...args, id: 'injected' },
          { params, body: { ...body, id: 'injected' } },
          { params },
          { body },
          { params: null, body },
          { params: {}, body },
          ...[null, true, '', [], {}].map(id => ({ params: { id }, body })),
          { params, body: null },
          { params, body: [] },
          { params, body: { mobile: body.mobile, level: body.level } },
          { params, body: { name: body.name, level: body.level } },
          { params, body: { name: body.name, mobile: body.mobile } },
          { params, body: { ...body, name: 'x' } },
          { params, body: { ...body, mobile: 'short' } },
          { params, body: { ...body, level: '2' } },
          { params, body: { ...body, level: 4 } },
          { params, body: { ...body, content: 'not-an-object' } },
          { params, body: { ...body, trainingRecords: 'not-an-array' } },
          { params, body: { ...body, trainingRecords: [{ name: 'x' }] } },
          { params, body: { ...body, trainingRecords: [{ ...record, deleted: 'true' }] } },
          {
            params,
            body: {
              ...body,
              trainingRecords: [
                { ...record, trainingRecordSubjects: [{ ...subject, score: '90' }] },
              ],
            },
          },
          {
            params,
            body: { ...body, content: { ...body.content, studentId: 'injected' } },
          },
          ...[{ studentId: 'injected' }, { unknown: true }].map(fields => ({
            params,
            body: { ...body, trainingRecords: [{ ...record, ...fields }] },
          })),
          ...[{ recordId: 'injected' }, { unknown: true }].map(fields => ({
            params,
            body: {
              ...body,
              trainingRecords: [{ ...record, trainingRecordSubjects: [{ ...subject, ...fields }] }],
            },
          })),
          ...[
            'unknown',
            'deleted',
            'iid',
            'executor',
            'disableInstance',
            'route',
            'method',
            'headers',
            'innerAccess',
            'instanceName',
            'userId',
            'passport',
          ].flatMap(key => [
            { ...args, [key]: 'injected' },
            { params: { ...params, [key]: 'injected' }, body },
            { params, body: { ...body, [key]: 'injected' } },
          ]),
        ]) {
          const rejected = await all.request('tools/call', {
            name: 'training_student_update',
            arguments: invalidArgs,
          });
          assert.deepEqual(
            rejected.error,
            { code: -32602, message: 'Invalid tool arguments' },
            JSON.stringify(invalidArgs),
          );
        }
        assert.equal(action.mock.callCount(), 0, 'unknown and invalid input never dispatch');
        const call = () =>
          all.request('tools/call', { name: 'training_student_update', arguments: args });
        const accepted = await call();
        assert.equal(accepted.error, undefined);
        assert.notEqual(accepted.result.isError, true);
        assert.deepEqual(action.mock.calls[0].arguments, [
          'patch',
          '/training/student/:id',
          {
            params,
            body: {
              ...body,
              content: { deleted: false, ...body.content },
              trainingRecords: body.trainingRecords.map(record => ({
                deleted: false,
                ...record,
                ...(record.trainingRecordSubjects
                  ? {
                      trainingRecordSubjects: record.trainingRecordSubjects.map(subject => ({
                        deleted: false,
                        ...subject,
                      })),
                    }
                  : {}),
              })),
            },
            innerAccess: false,
          },
        ]);
        assert.deepEqual(accepted.result.structuredContent, { result: null });
        assert.deepEqual(JSON.parse(accepted.result.content[0].text), { result: null });
        assert.equal(action.mock.callCount(), 1, 'one call dispatches one update');
        action.mock.mockImplementation(async () => undefined);
        const missing = await call();
        assert.equal(missing.error, undefined);
        assert.deepEqual(missing.result, {
          isError: true,
          content: [{ type: 'text', text: 'Resource not found' }],
        });
        assert.equal(action.mock.callCount(), 2, 'undefined is not null success or retried');
        for (const raw of [{ result: null, private: 'not-a-completion' }, 'null', false]) {
          action.mock.mockImplementation(async () => raw as any);
          const count = action.mock.callCount();
          const invalid = await call();
          assert.equal(invalid.error, undefined);
          assert.equal(invalid.result.isError, true);
          assert.equal(invalid.result.structuredContent, undefined);
          assert.deepEqual(invalid.result.content, [{ type: 'text', text: 'Action failed' }]);
          assert.equal(action.mock.callCount(), count + 1, 'malformed output is not replayed');
        }
      } finally {
        action.mock.restore();
        await read.close();
        await all.close();
      }
    });
  });

  it('binds delete to fixed DELETE params, acknowledges null and never replays output failures', async t => {
    if (!app.meta.modules['training-student']) return;
    await withStudentToolPermissions(async () => {
      const read = await connect(await createSharedBusinessToolServer(app, 'mcp:read'));
      const all = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
      const params = { id: '123' };
      // Binding/output only; businessHttp owns persisted aggregate deletion and executor null proof.
      const action = t.mock.method(
        app.bean.executor,
        'performAction',
        async (..._args: Parameters<typeof app.bean.executor.performAction>) => null,
      );
      try {
        const listed = await all.request('tools/list');
        assert.equal(listed.error, undefined);
        const tool = listed.result.tools.find(
          (tool: any) => tool.name === 'training_student_delete',
        );
        assert.ok(tool);
        assert.equal(tool.annotations.readOnlyHint, false);
        assert.notEqual(tool.annotations.destructiveHint, false);
        assert.notEqual(tool.annotations.idempotentHint, true);
        assert.deepEqual(Object.keys(tool.inputSchema.properties), ['id']);
        assert.deepEqual(tool.inputSchema.required, ['id']);
        assert.equal(tool.inputSchema.additionalProperties, false);
        assert.deepEqual(Object.keys(tool.outputSchema.properties), ['result']);
        assert.deepEqual(tool.outputSchema.required, ['result']);
        assert.equal(tool.outputSchema.additionalProperties, false);
        assert.deepEqual(tool.outputSchema.properties.result, { type: 'null' });
        const readTools = await read.request('tools/list');
        assert.equal(readTools.error, undefined);
        assert.deepEqual(
          readTools.result.tools.map((tool: any) => tool.name).sort(),
          studentToolNames
            .filter(
              name =>
                ![
                  'training_student_create',
                  'training_student_update',
                  'training_student_delete',
                ].includes(name),
            )
            .toSorted(),
        );
        assert.equal(action.mock.callCount(), 0, 'discovery never trial-deletes');
        const denied = await read.request('tools/call', {
          name: tool.name,
          arguments: params,
        });
        assert.deepEqual(denied.error, { code: -32602, message: 'Tool unavailable' });
        assert.equal(action.mock.callCount(), 0, 'read scope rejects known delete before dispatch');
        for (const name of [
          'training_student_delete_unknown',
          'training_student_deleteForce',
          'training_student_deleteBulk',
        ]) {
          const rejected = await all.request('tools/call', { name, arguments: params });
          assert.deepEqual(rejected.error, { code: -32602, message: 'Tool unavailable' });
        }
        for (const invalidArgs of [
          undefined,
          {},
          { params },
          ...[null, true, '', [], {}].map(id => ({ id })),
          ...[
            'unknown',
            'body',
            'params',
            'deleted',
            'iid',
            'executor',
            'disableInstance',
            'route',
            'method',
            'headers',
            'innerAccess',
            'instanceName',
            'userId',
            'passport',
            'confirm',
          ].map(key => ({ ...params, [key]: 'injected' })),
        ]) {
          const rejected = await all.request('tools/call', {
            name: tool.name,
            arguments: invalidArgs,
          });
          assert.deepEqual(
            rejected.error,
            { code: -32602, message: 'Invalid tool arguments' },
            JSON.stringify(invalidArgs),
          );
        }
        assert.equal(action.mock.callCount(), 0, 'unknown and invalid input never dispatch');
        const call = () => all.request('tools/call', { name: tool.name, arguments: params });
        const accepted = await call();
        assert.equal(accepted.error, undefined);
        assert.notEqual(accepted.result.isError, true);
        assert.deepEqual(action.mock.calls[0].arguments, [
          'delete',
          '/training/student/:id',
          { params, innerAccess: false },
        ]);
        assert.deepEqual(accepted.result.structuredContent, { result: null });
        assert.deepEqual(JSON.parse(accepted.result.content[0].text), { result: null });
        assert.equal(action.mock.callCount(), 1, 'one call dispatches one delete');
        const numeric = await all.request('tools/call', {
          name: tool.name,
          arguments: { id: 123 },
        });
        assert.deepEqual(numeric.result.structuredContent, { result: null });
        assert.deepEqual(action.mock.calls[1].arguments, [
          'delete',
          '/training/student/:id',
          { params, innerAccess: false },
        ]);
        action.mock.mockImplementation(async () => undefined);
        const missing = await call();
        assert.equal(missing.error, undefined);
        assert.deepEqual(missing.result, {
          isError: true,
          content: [{ type: 'text', text: 'Resource not found' }],
        });
        assert.equal(action.mock.callCount(), 3, 'undefined is not null success or retried');
        for (const raw of [{ result: null, private: 'not-a-completion' }, 'null', false]) {
          action.mock.mockImplementation(async () => raw as any);
          const count = action.mock.callCount();
          const invalid = await call();
          assert.equal(invalid.error, undefined);
          assert.equal(invalid.result.isError, true);
          assert.equal(invalid.result.structuredContent, undefined);
          assert.deepEqual(invalid.result.content, [{ type: 'text', text: 'Action failed' }]);
          assert.equal(action.mock.callCount(), count + 1, 'malformed output is not replayed');
        }
      } finally {
        action.mock.restore();
        await read.close();
        await all.close();
      }
    });
  });

  it('binds the existing select defaults and filters and fails closed on invalid output', async t => {
    if (!app.meta.modules['training-student']) return;
    await withStudentToolPermissions(async () => {
      const client = await connect(await createSharedBusinessToolServer(app, 'mcp:read'));
      const ormQuery = app.util.getModuleConfigRaw('a-orm')?.rest?.query;
      const defaults = {
        orders: ormQuery?.orders?.default ?? 'createdAt,desc',
        pageNo: 1,
        pageSize: ormQuery?.pageSize?.default ?? 20,
      };
      const raw = {
        list: [],
        total: '0',
        pageNo: 1,
        pageSize: defaults.pageSize,
        pageCount: 0,
      };
      // Binding and output parsing only; businessHttp covers real persisted rows and mobile masking.
      const action = t.mock.method(
        app.bean.executor,
        'performAction',
        async (..._args: Parameters<typeof app.bean.executor.performAction>) => raw,
      );
      try {
        const call = (args?: Record<string, unknown>) =>
          client.request('tools/call', { name: 'training_student_select', arguments: args });
        const response = await call();
        assert.equal(response.error, undefined);
        assert.notEqual(response.result.isError, true);
        assert.deepEqual(action.mock.calls[0].arguments, [
          'get',
          '/training/student',
          { query: defaults, innerAccess: false },
        ]);
        assert.deepEqual(response.result.structuredContent, raw);
        assert.deepEqual(JSON.parse(response.result.content[0].text), raw);
        const filters = {
          name: '  Student  ',
          level: 2,
          columns: ['id', 'name', 'mobile', 'level'],
          where: { name: 'Student' },
          orders: [['name', 'asc']],
          pageNo: 2,
          pageSize: 1,
        };
        const filtered = await call(filters);
        assert.equal(filtered.error, undefined);
        assert.notEqual(filtered.result.isError, true);
        assert.deepEqual(action.mock.calls.at(-1)!.arguments, [
          'get',
          '/training/student',
          { query: filters, innerAccess: false },
        ]);
        action.mock.mockImplementation(async () => ({ ...raw, list: 'invalid' }));
        const invalid = await call();
        assert.equal(invalid.error, undefined);
        assert.equal(invalid.result.isError, true);
        assert.equal(invalid.result.structuredContent, undefined);
        assert.deepEqual(invalid.result.content, [{ type: 'text', text: 'Action failed' }]);
      } finally {
        action.mock.restore();
        await client.close();
      }
    });
  });

  it('discovers and binds student analysis defaults, filters and metrics through the existing Actions', async t => {
    if (!app.meta.modules['training-student']) return;
    await withStudentToolPermissions(async () => {
      const server = await createSharedBusinessToolServer(app, 'mcp:read');
      const client = await connect(server);
      const ormQuery = app.util.getModuleConfigRaw('a-orm')?.rest?.query;
      const defaults = {
        orders: ormQuery?.orders?.default ?? 'createdAt,desc',
        pageNo: 1,
        pageSize: ormQuery?.pageSize?.default ?? 20,
      };
      let raw: unknown;
      const action = t.mock.method(
        app.bean.executor,
        'performAction',
        async (..._args: Parameters<typeof app.bean.executor.performAction>) => raw,
      );
      try {
        const listed = await client.request('tools/list');
        assert.equal(listed.error, undefined);
        assert.deepEqual(
          server.diagnostics.filter(diagnostic =>
            ['group', 'aggregate'].includes(diagnostic.action),
          ),
          [],
        );
        for (const mode of ['group', 'aggregate'] as const) {
          const name = `training_student_${mode}`;
          const tool = listed.result.tools.find((item: any) => item.name === name);
          assert.ok(tool, `${name} is discoverable with read scope`);
          assert.equal(tool.annotations.readOnlyHint, true);
          assert.equal(tool.annotations.destructiveHint, false);
          assert.equal(tool.inputSchema.additionalProperties, false);
          assert.deepEqual(Object.keys(tool.inputSchema.properties).sort(), [
            'aggrs',
            'columns',
            'createdAt',
            ...(mode === 'group' ? ['groups'] : []),
            'level',
            'name',
            'orders',
            'pageNo',
            'pageSize',
            'where',
          ]);
          if (mode === 'group') {
            assert.deepEqual(tool.inputSchema.properties.groups.items.enum, ['level']);
            assert.equal(tool.outputSchema.properties.result.type, 'array');
          } else {
            assert.deepEqual(Object.keys(tool.outputSchema.properties).sort(), [
              'count_all',
              'count_imageId',
            ]);
            assert.equal(tool.outputSchema.properties.count_all.type, 'string');
          }
          assert.deepEqual(tool.inputSchema.properties.aggrs.properties.count.items.enum, [
            '*',
            'imageId',
          ]);
          const call = (args?: Record<string, unknown>) =>
            client.request('tools/call', { name, arguments: args });
          raw =
            mode === 'group'
              ? [{ level: 2, count_all: '3' }]
              : { count_all: '3', count_imageId: '1' };
          const response = await call();
          assert.equal(response.error, undefined);
          assert.notEqual(response.result.isError, true);
          assert.deepEqual(action.mock.calls.at(-1)!.arguments, [
            'get',
            `/training/student/${mode}`,
            {
              query: {
                ...defaults,
                ...(mode === 'group' ? { groups: ['level'] } : {}),
                aggrs: { count: mode === 'group' ? ['*'] : ['*', 'imageId'] },
              },
              innerAccess: false,
            },
          ]);
          const expected = mode === 'group' ? { result: raw } : raw;
          assert.deepEqual(response.result.structuredContent, expected);
          assert.deepEqual(JSON.parse(response.result.content[0].text), expected);
          const filters = {
            name: 'Student',
            level: 2,
            where: { level: { _gte_: 2 } },
            ...(mode === 'group' ? { groups: ['level'] } : {}),
            aggrs: { count: ['imageId'] },
          };
          raw = mode === 'group' ? [{ level: 2, count_imageId: '1' }] : { count_imageId: '1' };
          const filtered = await call(filters);
          assert.equal(filtered.error, undefined);
          assert.notEqual(filtered.result.isError, true);
          assert.deepEqual(action.mock.calls.at(-1)!.arguments, [
            'get',
            `/training/student/${mode}`,
            { query: { ...defaults, ...filters }, innerAccess: false },
          ]);
          assert.deepEqual(
            filtered.result.structuredContent,
            mode === 'group' ? { result: raw } : raw,
          );
          const calls = action.mock.callCount();
          for (const args of [
            { groups: ['mobile'] },
            ...(mode === 'aggregate' ? [{ groups: ['level'] }] : []),
            { aggrs: { count: ['mobile'] } },
            { aggrs: { sum: ['level'] } },
            { aggrs: {} },
            { aggrs: '{"count":["*"]}' },
            { level: 1.5 },
            { level: 4 },
            { iid: 'injected' },
            { innerAccess: true },
          ]) {
            const rejected = await call(args);
            assert.deepEqual(
              rejected.error,
              {
                code: -32602,
                message: 'Invalid tool arguments',
              },
              `${name}: ${JSON.stringify(args)}`,
            );
          }
          assert.equal(action.mock.callCount(), calls, 'invalid controls do not dispatch');
          raw =
            mode === 'group'
              ? [{ level: 2, count_all: { invalid: true } }]
              : { count_all: { invalid: true } };
          const invalid = await call();
          assert.equal(invalid.error, undefined);
          assert.equal(invalid.result.isError, true);
          assert.equal(invalid.result.structuredContent, undefined);
          assert.deepEqual(invalid.result.content, [{ type: 'text', text: 'Action failed' }]);
        }
      } finally {
        action.mock.restore();
        await client.close();
      }
    });
  });

  it('binds complete view details and preserves nested content and image metadata with safe output failure', async t => {
    if (!app.meta.modules['training-student']) return;
    await withStudentToolPermissions(async () => {
      const client = await connect(await createSharedBusinessToolServer(app, 'mcp:read'));
      const raw = {
        id: '123',
        createdAt: new Date('2026-03-10T08:00:00.000Z'),
        updatedAt: new Date('2026-03-10T08:00:00.000Z'),
        deleted: false,
        iid: 0,
        name: '__MCP complete view__',
        mobile: '138****5678',
        level: 2,
        imageId: '456',
        image: {
          id: '456',
          url: '/api/static/synthetic-student.jpg',
          filename: 'synthetic-student.jpg',
          width: 512,
          height: 512,
          public: true,
          signed: false,
        },
        content: { descriptionMarkdown: '# Synthetic student\n\nComplete Markdown content.' },
        trainingRecords: [
          {
            id: '789',
            deleted: false,
            name: '__MCP record__',
            subjectCount: 1,
            totalScore: 95,
            averageScore: 95,
            trainingTime: new Date('2026-03-10T08:00:00.000Z'),
            description: 'Synthetic record',
            trainingRecordSubjects: [
              {
                id: '790',
                deleted: false,
                name: '__Math__',
                score: 95,
                description: 'Synthetic subject',
              },
            ],
          },
        ],
      };
      // Parsing/binding only; businessHttp supplies the real guarded aggregate and serializer.
      const action = t.mock.method(
        app.bean.executor,
        'performAction',
        async (..._args: Parameters<typeof app.bean.executor.performAction>) => raw,
      );
      try {
        const call = () =>
          client.request('tools/call', {
            name: 'training_student_view',
            arguments: { id: '123' },
          });
        const response = await call();
        assert.equal(response.error, undefined);
        assert.notEqual(response.result.isError, true);
        assert.deepEqual(action.mock.calls[0].arguments, [
          'get',
          '/training/student/:id',
          { params: { id: '123' }, innerAccess: false },
        ]);
        assert.deepEqual(response.result.structuredContent, JSON.parse(JSON.stringify(raw)));
        assert.deepEqual(
          JSON.parse(response.result.content[0].text),
          response.result.structuredContent,
        );
        action.mock.mockImplementation(
          async () =>
            ({
              ...raw,
              trainingRecords: [{ ...raw.trainingRecords[0], trainingRecordSubjects: 'invalid' }],
            }) as any,
        );
        const invalid = await call();
        assert.equal(invalid.error, undefined);
        assert.equal(invalid.result.isError, true);
        assert.equal(invalid.result.structuredContent, undefined);
        assert.deepEqual(invalid.result.content, [{ type: 'text', text: 'Action failed' }]);
      } finally {
        action.mock.restore();
        await client.close();
      }
    });
  });

  it('rejects the retired student lookup tool without dispatching an Action', async t => {
    await withStudentToolPermissions(async () => {
      const clients: Awaited<ReturnType<typeof connect>>[] = [];
      const action = t.mock.method(app.bean.executor, 'performAction', async () => {
        assert.fail('retired tool calls must not dispatch business Actions');
      });
      try {
        clients.push(await connect(await createBusinessToolServer(app)));
        for (const scope of ['mcp:read', 'mcp:all'] as const) {
          clients.push(await connect(await createSharedBusinessToolServer(app, scope)));
        }
        for (const client of clients) {
          const listed = await client.request('tools/list');
          assert.equal(listed.error, undefined);
          assert.equal(
            listed.result.tools.some((tool: any) => tool.name === 'training_student_lookup'),
            false,
          );
          for (const args of [undefined, {}, { name: 'Student' }]) {
            const rejected = await client.request('tools/call', {
              name: 'training_student_lookup',
              arguments: args,
            });
            assert.deepEqual(rejected.error, {
              code: -32602,
              message: client === clients[0] ? 'Unknown tool' : 'Tool unavailable',
            });
          }
        }
        assert.equal(action.mock.callCount(), 0, 'retired names never reach performAction');
      } finally {
        action.mock.restore();
        for (const client of clients) await client.close();
      }
    });
  });

  it('requires an explicit authorization scope and blocks write tools before ordinary Action dispatch', async () => {
    await app.bean.executor.mockCtx(async () => {
      await assert.rejects(
        () => createControllerToolServer(app),
        /MCP authorization scope required/,
      );
      const initial = toolFixtureState.count;
      const read = await connect(await createControllerToolServer(app, 'mcp:read'));
      const all = await connect(await createControllerToolServer(app, 'mcp:all'));
      try {
        const readTools = (await read.request('tools/list')).result.tools;
        const allTools = (await all.request('tools/list')).result.tools;
        assert.equal(
          readTools.some((tool: any) => tool.name === effectToolName),
          false,
        );
        assert.equal(
          allTools.some((tool: any) => tool.name === effectToolName),
          true,
        );
        const status = readTools.find((tool: any) => tool.name === statusToolName);
        assert.ok(status);
        assert.equal(status.annotations.readOnlyHint, true);
        assert.deepEqual(status.inputSchema.properties, {});
        const effect = allTools.find((tool: any) => tool.name === effectToolName);
        assert.equal(effect.annotations.readOnlyHint, false);
        assert.deepEqual(Object.keys(effect.inputSchema.properties).sort(), ['body', 'params']);
        assert.deepEqual(effect.inputSchema.required.toSorted(), ['body', 'params']);
        assert.equal(effect.inputSchema.additionalProperties, false);
        const body = effect.inputSchema.properties.body;
        assert.equal(body.properties.priority.type, 'integer');
        assert.deepEqual(body.properties.note.type, ['string', 'null']);
        assert.ok(!body.required.includes('priority'));
        assert.ok(!body.required.includes('note'));
        assert.equal(effect.outputSchema.properties.priority.type, 'integer');
        assert.deepEqual(effect.outputSchema.properties.note.type, ['string', 'null']);
        const inputCheck = fromJsonSchema(effect.inputSchema)['~standard'];
        const outputCheck = fromJsonSchema(effect.outputSchema)['~standard'];
        const args = { params: { label: 'scope-proof' }, body: { amount: 2 } };
        assert.equal((await inputCheck.validate(args)).issues, undefined);
        assert.ok(
          (await inputCheck.validate({ ...args, body: { amount: 2, priority: null } })).issues,
        );
        const denied = await read.request('tools/call', { name: effectToolName, arguments: args });
        assert.equal(denied.error?.code, -32602);
        assert.equal(toolFixtureState.count, initial, 'denied calls do not reach the controller');
        const closed = await all.request('tools/call', {
          name: 'mcp-test_toolFixture_closed',
          arguments: {},
        });
        assert.equal(closed.error?.code, -32602, 'unannotated sibling Actions remain closed');
        for (const arguments_ of [
          { label: 'scope-proof', amount: 2 },
          { params: { label: 'scope-proof', innerAccess: true }, body: { amount: 2 } },
          { params: { label: 'scope-proof' }, body: { amount: 4 } },
          { params: { label: 'scope-proof' }, body: { amount: 2, priority: null } },
          { ...args, innerAccess: true },
        ]) {
          const rejected = await all.request('tools/call', {
            name: effectToolName,
            arguments: arguments_,
          });
          assert.equal(rejected.error?.code, -32602);
          assert.equal(toolFixtureState.count, initial);
        }
        // The fixture is public, not an RBAC proof; businessHttp retains real student-role checks.
        const accepted = await all.request('tools/call', { name: effectToolName, arguments: args });
        assert.equal(accepted.error, undefined);
        assert.notEqual(accepted.result.isError, true);
        assert.deepEqual(accepted.result.structuredContent, {
          count: initial + 2,
          label: 'scope-proof',
        });
        assert.equal(
          (await outputCheck.validate(accepted.result.structuredContent)).issues,
          undefined,
        );
        const nullableArgs = { ...args, body: { amount: 1, priority: 3, note: null } };
        assert.equal((await inputCheck.validate(nullableArgs)).issues, undefined);
        const nullable = await all.request('tools/call', {
          name: effectToolName,
          arguments: nullableArgs,
        });
        assert.equal(nullable.error, undefined);
        assert.notEqual(nullable.result.isError, true);
        assert.deepEqual(nullable.result.structuredContent, {
          count: initial + 3,
          label: 'scope-proof',
          priority: 3,
          note: null,
        });
        assert.equal(
          (await outputCheck.validate(nullable.result.structuredContent)).issues,
          undefined,
        );
        assert.ok(
          (await outputCheck.validate({ ...nullable.result.structuredContent, priority: null }))
            .issues,
        );
        const current = await read.request('tools/call', { name: statusToolName });
        assert.deepEqual(current.result.structuredContent, { count: initial + 3 });
      } finally {
        toolFixtureState.count = initial;
        await read.close();
        await all.close();
      }
    });
  });

  it('inherits class opt-in defaults, retains local names and rejects invalid exposure configuration', async t => {
    await app.bean.executor.mockCtx(async () => {
      const original = appMetadata.getMetadata;
      let configuration:
        | 'defaults'
        | 'override'
        | 'pick-replacement'
        | 'invalid-name'
        | 'duplicate'
        | 'invalid-pick' = 'defaults';
      const metadata = t.mock.method(
        appMetadata,
        'getMetadata',
        function (...args: Parameters<typeof original>) {
          const [key, target, action] = args;
          const value = original.apply(appMetadata, args) as IMcpToolOptions | undefined;
          if (key !== SymbolMcpOptions) return value;
          if (target === ControllerToolFixture && action === undefined) {
            if (configuration === 'defaults' || configuration === 'override') {
              return { description: 'Fixture class default', readOnly: false };
            }
            if (configuration === 'pick-replacement') return { output: { pick: ['count'] } };
          }
          if (target === ControllerToolFixture.prototype && configuration === 'pick-replacement') {
            if (action === 'effect') return { ...value, output: { pick: ['label'] } };
            if (action === 'scalar' || action === 'array') return { ...value, output: undefined };
          }
          if (target === ControllerToolFixture.prototype && action === 'status') {
            if (configuration === 'defaults') return { ...value, readOnly: true };
            if (configuration === 'override') {
              return {
                ...value,
                name: 'mcp_test_overridden_status',
                description: 'Local description',
                readOnly: true,
              };
            }
            if (configuration === 'invalid-name') return { ...value, name: 'invalid tool name' };
            if (configuration === 'duplicate') return { ...value, name: categoryToolName };
            if (configuration === 'invalid-pick')
              return { ...value, output: { pick: ['missing'] } };
          }
          return value;
        },
      );
      try {
        assert.deepEqual(appMetadata.getMetadata(SymbolMcpOptions, ControllerCatalog), {});
        const client = await connect(await createControllerToolServer(app, 'mcp:all'));
        try {
          const tools = (await client.request('tools/list')).result.tools;
          const status = tools.find((tool: any) => tool.name === statusToolName);
          assert.equal(status.description, 'Fixture class default');
          assert.equal(
            status.annotations.readOnlyHint,
            true,
            'local options override class defaults',
          );
          const closed = tools.find((tool: any) => tool.name === 'mcp-test_toolFixture_closed');
          assert.ok(closed, 'class opt-in exposes representable sibling Actions');
          assert.equal(closed.description, 'Fixture class default');
          assert.equal(closed.annotations.readOnlyHint, false);
        } finally {
          await client.close();
        }
        configuration = 'override';
        const overridden = await connect(await createControllerToolServer(app, 'mcp:read'));
        try {
          const tools = (await overridden.request('tools/list')).result.tools;
          assert.equal(
            tools.some((tool: any) => tool.name === statusToolName),
            false,
          );
          const status = tools.find((tool: any) => tool.name === 'mcp_test_overridden_status');
          assert.ok(status);
          assert.equal(status.description, 'Local description');
          assert.equal(status.annotations.readOnlyHint, true);
        } finally {
          await overridden.close();
        }
        configuration = 'pick-replacement';
        const projected = await connect(await createControllerToolServer(app, 'mcp:all'));
        const initial = toolFixtureState.count;
        try {
          const tool = (await projected.request('tools/list')).result.tools.find(
            (tool: any) => tool.name === effectToolName,
          );
          assert.deepEqual(Object.keys(tool.outputSchema.properties), ['label']);
          const response = await projected.request('tools/call', {
            name: effectToolName,
            arguments: { params: { label: 'pick-replacement' }, body: { amount: 1 } },
          });
          assert.deepEqual(response.result.structuredContent, { label: 'pick-replacement' });
          assert.deepEqual(JSON.parse(response.result.content[0].text), {
            label: 'pick-replacement',
          });
        } finally {
          toolFixtureState.count = initial;
          await projected.close();
        }
        for (const [mode, expected] of [
          ['invalid-name', /Invalid or duplicate MCP tool name/],
          ['duplicate', /Invalid or duplicate MCP tool name/],
          ['invalid-pick', /Invalid MCP output.pick/],
        ] as const) {
          configuration = mode;
          await assert.rejects(() => createControllerToolServer(app, 'mcp:all'), expected);
        }
        assert.throws(
          () => (Mcp.tool as any)({ name: 'class-name-is-not-valid' })(class {}),
          /name is only valid on a controller action/,
        );
      } finally {
        metadata.mock.restore();
      }
    });
  });

  it('excludes identities before duplicate names and malformed contracts, without admitting sibling Actions', async t => {
    await app.bean.executor.mockCtx(async () => {
      const original = appMetadata.getMetadata;
      let invalid: 'duplicate' | 'malformed' = 'duplicate';
      const metadata = t.mock.method(
        appMetadata,
        'getMetadata',
        function (...args: Parameters<typeof original>) {
          const [key, target, action] = args;
          const value = original.apply(appMetadata, args) as IMcpToolOptions | undefined;
          if (
            key === SymbolMcpOptions &&
            target === ControllerToolFixture.prototype &&
            action === 'status'
          ) {
            return invalid === 'duplicate'
              ? { ...value, name: categoryToolName }
              : { ...value, output: { pick: ['missing'] } };
          }
          return value;
        },
      );
      const openapi = app.scope('a-openapi').service.openapi;
      const contractOriginal = openapi.getControllerActionContract;
      const contracts = t.mock.method(
        openapi,
        'getControllerActionContract',
        function (...args: Parameters<typeof contractOriginal>) {
          assert.equal(args[0], ControllerCatalog, 'excluded identities never extract contracts');
          assert.equal(args[1], 'categories', 'an annotated sibling is not admitted by prefix');
          return contractOriginal.apply(openapi, args);
        },
      );
      try {
        for (const mode of ['duplicate', 'malformed'] as const) {
          invalid = mode;
          const server = await createControllerToolServer(app, 'mcp:all', {
            includeTool: identity =>
              identity.controller === 'mcp-test.controller.catalog' &&
              identity.action === 'categories',
          });
          const client = await connect(server);
          try {
            assert.deepEqual(
              server.diagnostics,
              [],
              'excluded unsupported contracts do not produce diagnostics',
            );
            const listed = await client.request('tools/list');
            assert.deepEqual(
              listed.result.tools.map((tool: any) => tool.name),
              [categoryToolName],
            );
            for (const name of [toolName, detailToolName, statusToolName, effectToolName]) {
              const rejected = await client.request('tools/call', { name, arguments: {} });
              assert.equal(rejected.error?.code, -32602);
            }
          } finally {
            await client.close();
          }
        }
        assert.equal(contracts.mock.callCount(), 2);
      } finally {
        contracts.mock.restore();
        metadata.mock.restore();
      }
    });
  });

  it('isolates HTTP and MCP schema targets in either cache warm-up order', async t => {
    await app.bean.executor.mockCtx(() =>
      runWithZodQueryCoercion(true, async () => {
        const openapi = app.bean.openapi;
        const cache = app.bean.summer.cache('a-openapi.summerCache.json');
        const targets = ['http', 'mcp'] as const;
        const keys = targets.map(schemaTarget =>
          getKeyHash(
            (openapi as any).generateJsonOfControllerActionCacheKey({
              prop: 'generateJsonOfControllerAction',
              args: [ControllerToolFixture, 'effect', 'V31', { schemaTarget }],
            }),
          ),
        );
        const collect = t.mock.method(app.scope('a-openapi').service.openapi, 'collectController');
        try {
          for (const order of [targets, targets.toReversed()]) {
            await cache.mdel(keys);
            collect.mock.resetCalls();
            for (const schemaTarget of [...order, ...order]) {
              const document = await openapi.generateJsonOfControllerAction(
                ControllerToolFixture,
                'effect',
                'V31',
                { schemaTarget },
              );
              const schemas = document.components?.schemas ?? {};
              const resolve = (schema: any): any =>
                schema.$ref
                  ? resolve(schemas[schema.$ref.slice('#/components/schemas/'.length)])
                  : schema;
              const operation = Object.values(document.paths ?? {})
                .map(path => (path as any).post)
                .find(Boolean);
              assert.ok(operation);
              const body = resolve(operation.requestBody!.content['application/json'].schema);
              const envelope = resolve(
                operation.responses['200'].content['application/json'].schema,
              );
              const output = resolve(envelope.properties.data);
              for (const schema of [body, output]) {
                assert.deepEqual(
                  schema.properties.priority.type,
                  schemaTarget === 'mcp' ? 'integer' : ['integer', 'null'],
                );
                assert.deepEqual(schema.properties.note.type, ['string', 'null']);
                assert.ok(!schema.required.includes('priority'));
                assert.ok(!schema.required.includes('note'));
              }
            }
            assert.equal(
              collect.mock.callCount(),
              2,
              'each target generates once, then hits cache',
            );
            const implicit = await openapi.generateJsonOfControllerAction(
              ControllerToolFixture,
              'effect',
              'V31',
            );
            const explicit = await openapi.generateJsonOfControllerAction(
              ControllerToolFixture,
              'effect',
              'V31',
              { schemaTarget: 'http' },
            );
            assert.deepEqual(implicit, explicit);
            assert.equal(collect.mock.callCount(), 2, 'omitted target shares the HTTP cache');
          }
        } finally {
          collect.mock.restore();
          await cache.mdel(keys);
        }
      }),
    );
  });

  it('keeps excluded Action contracts out of public caches, wraps scalar/array output and diagnoses unsupported Actions', async () => {
    await app.bean.executor.mockCtx(async () => {
      const publicBefore = await app.bean.openapi.generateJsonOfControllerAction(
        ControllerToolFixture,
        'scalar',
        'V31',
      );
      assert.deepEqual(Object.keys(publicBefore.paths ?? {}), []);
      const contract = await app.bean.openapi.generateJsonOfControllerAction(
        ControllerToolFixture,
        'scalar',
        'V31',
        { includeExcluded: true },
      );
      assert.equal(Object.keys(contract.paths ?? {}).length, 1);
      const server = await createControllerToolServer(app, 'mcp:read');
      const client = await connect(server);
      try {
        assert.ok(
          server.diagnostics.some(
            item =>
              item.controller === 'mcp-test.controller.toolFixture' &&
              item.action === 'unsupported' &&
              item.reason.includes('Only JSON/200 Actions'),
          ),
        );
        const tools = (await client.request('tools/list')).result.tools;
        assert.equal(
          tools.some((tool: any) => tool.name === 'mcp_test_action_unsupported'),
          false,
        );
        for (const [name, expected] of [
          [scalarToolName, 7],
          [arrayToolName, ['safe', 'array']],
        ] as const) {
          const tool = tools.find((tool: any) => tool.name === name);
          assert.deepEqual(Object.keys(tool.outputSchema.properties), ['result']);
          const response = await client.request('tools/call', { name });
          assert.equal(response.error, undefined);
          assert.notEqual(response.result.isError, true);
          assert.deepEqual(response.result.structuredContent, { result: expected });
          assert.deepEqual(JSON.parse(response.result.content[0].text), { result: expected });
        }
        const rejected = await client.request('tools/call', {
          name: 'mcp_test_action_unsupported',
        });
        assert.equal(rejected.error?.code, -32602);
      } finally {
        await client.close();
      }
      const publicAfter = await app.bean.openapi.generateJsonOfControllerAction(
        ControllerToolFixture,
        'scalar',
        'V31',
      );
      assert.deepEqual(
        publicAfter,
        publicBefore,
        'includeExcluded does not poison the public cache',
      );
    });
  });

  it('projects authorized student output and fails closed on invalid retained fields', async t => {
    if (!app.meta.modules['training-student']) return;
    await withStudentToolPermissions(async () => {
      const client = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
      const executor = app.bean.executor;
      const raw = {
        id: '123',
        name: '__MCP projection__',
        level: 2,
        levelTitle: '2',
        descriptionLength: 7,
        summaryText: 'A safe summary',
        mobile: 'private-mobile',
        descriptionMarkdown: 'private-notes',
        descriptionHtml: '<p>private-notes</p>',
        extra: 'private-extra',
      };
      // Isolate output parsing only; guarded real controller behavior is covered by businessHttp.
      const action = t.mock.method(executor, 'performAction', async () => raw);
      try {
        const call = () =>
          client.request('tools/call', {
            name: 'training_student_summary',
            arguments: { id: '123' },
          });
        const response = await call();
        assert.equal(response.error, undefined);
        assert.notEqual(response.result.isError, true);
        assert.deepEqual(response.result.structuredContent, {
          id: raw.id,
          name: raw.name,
          level: raw.level,
          levelTitle: raw.levelTitle,
          descriptionLength: raw.descriptionLength,
          summaryText: raw.summaryText,
        });
        assert.deepEqual(
          JSON.parse(response.result.content[0].text),
          response.result.structuredContent,
        );
        action.mock.mockImplementation(async () => ({ ...raw, summaryText: undefined }));
        const invalid = await call();
        assert.equal(invalid.result.isError, true);
        assert.equal(invalid.result.structuredContent, undefined);
        assert.deepEqual(invalid.result.content, [{ type: 'text', text: 'Action failed' }]);
      } finally {
        action.mock.restore();
        await client.close();
      }
    });
  });

  it('restores business query semantics beneath native protocol parsing for all three DTO-backed tools', async () => {
    await app.bean.executor.mockCtx(() =>
      runWithZodQueryCoercion(false, async () => {
        const client = await connect(await createBusinessToolServer(app));
        try {
          const listed = await client.request('tools/list');
          assert.deepEqual(
            listed.result.tools.map((tool: any) => tool.name),
            [toolName, detailToolName, categoryToolName],
          );
          const categoryTool = listed.result.tools[2];
          const document = await runWithZodQueryCoercion(true, () =>
            app.bean.openapi.generateJsonOfClasses(
              [DtoCategoryPublicSelectReq, DtoCategoryPublicSelectRes, DtoCategoryPublic],
              'V31',
            ),
          );
          const schemas = document.components!.schemas!;
          assert.deepEqual(categoryTool.inputSchema, {
            ...schemas[appResource.getBeanFullName(DtoCategoryPublicSelectReq)!],
            additionalProperties: false,
          });
          const responseSchema = schemas[appResource.getBeanFullName(DtoCategoryPublicSelectRes)!];
          assert.ok('properties' in responseSchema);
          assert.deepEqual(categoryTool.outputSchema.properties, responseSchema.properties);
          assert.deepEqual(
            categoryTool.outputSchema.components.schemas[
              appResource.getBeanFullName(DtoCategoryPublic)!
            ],
            schemas[appResource.getBeanFullName(DtoCategoryPublic)!],
          );
          assert.deepEqual(Object.keys(categoryTool.inputSchema.properties).sort(), [
            'pageNo',
            'pageSize',
          ]);
          assert.equal(categoryTool.inputSchema.properties.pageNo.type, 'integer');
          assert.equal(categoryTool.inputSchema.properties.pageNo.minimum, 1);
          assert.equal(categoryTool.inputSchema.properties.pageNo.default, 1);
          assert.equal(categoryTool.inputSchema.properties.pageSize.type, 'integer');
          assert.equal(categoryTool.inputSchema.properties.pageSize.minimum, 1);
          assert.equal(categoryTool.inputSchema.properties.pageSize.default, 20);
          assert.equal(categoryTool.inputSchema.properties.pageSize.maximum, 100);
          assert.equal(categoryTool.annotations.readOnlyHint, true);
          const tool = listed.result.tools[0];
          assert.equal(tool.annotations.readOnlyHint, true);
          assert.equal(tool.inputSchema.properties.pageSize.maximum, 100);
          assert.equal(tool.inputSchema.additionalProperties, false);
          assert.equal(tool.outputSchema.properties.total.type, 'string');
          assert.ok(tool.outputSchema.components.schemas);
          const args = { title: 'Wireless Headphones', pageNo: 1, pageSize: 1 };
          const response = await client.request('tools/call', { name: toolName, arguments: args });
          assert.equal(response.error, undefined);
          assert.notEqual(response.result.isError, true);
          const output = response.result.structuredContent;
          const direct = await runWithZodQueryCoercion(true, () =>
            app.bean.executor.performAction('get', '/mcp/test/catalog/products', {
              query: args,
              innerAccess: false,
            }),
          );
          assert.deepEqual(
            output,
            await runWithZodQueryCoercion(true, () =>
              $schema(DtoProductPublicSelectRes).parseAsync(direct),
            ),
          );
          assert.equal(output.list.length, 1);
          assert.equal(output.list[0].title, 'Wireless Headphones');
          assert.equal(typeof output.total, 'string');
          assert.deepEqual(Object.keys(output).sort(), [
            'list',
            'pageCount',
            'pageNo',
            'pageSize',
            'total',
          ]);
          assert.deepEqual(Object.keys(output.list[0]).sort(), [
            'available',
            'categoryId',
            'categoryName',
            'description',
            'id',
            'priceCents',
            'skuAvailables',
            'title',
          ]);
          assert.deepEqual(Object.keys(output.list[0].skuAvailables[0]).sort(), [
            'available',
            'code',
            'id',
            'priceCents',
          ]);
          assert.deepEqual(JSON.parse(response.result.content[0].text), output);
          // The existing optional DTO normalizes an empty title to an omitted filter.
          const emptyTitle = await client.request('tools/call', {
            name: toolName,
            arguments: { title: '', pageSize: 1 },
          });
          const omittedTitle = await client.request('tools/call', {
            name: toolName,
            arguments: { pageSize: 1 },
          });
          assert.equal(emptyTitle.error, undefined);
          assert.notEqual(emptyTitle.result.isError, true);
          assert.deepEqual(
            emptyTitle.result.structuredContent,
            omittedTitle.result.structuredContent,
          );
        } finally {
          await client.close();
        }
      }),
    );
  });

  it('lists public categories then searches and reads a product using returned identities', async () => {
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const response = await client.request('tools/call', { name: categoryToolName });
        assert.equal(response.error, undefined);
        assert.notEqual(response.result.isError, true);
        const output = response.result.structuredContent;
        const direct = await app.bean.executor.performAction(
          'get',
          '/mcp/test/catalog/categories',
          { query: { pageNo: 1, pageSize: 20 }, innerAccess: false },
        );
        assert.deepEqual(output, await $schema(DtoCategoryPublicSelectRes).parseAsync(direct));
        assert.equal(output.pageNo, 1);
        assert.equal(output.pageSize, 20);
        assert.equal(typeof output.total, 'string');
        assert.deepEqual(Object.keys(output).sort(), [
          'list',
          'pageCount',
          'pageNo',
          'pageSize',
          'total',
        ]);
        for (const category of output.list) {
          assert.deepEqual(category, await $schema(DtoCategoryPublic).parseAsync(category));
          assert.deepEqual(
            Object.keys(JSON.parse(JSON.stringify(category))).sort(),
            category.description === undefined ? ['id', 'name'] : ['description', 'id', 'name'],
          );
        }
        // In-memory results retain undefined optional fields; text uses JSON wire semantics.
        assert.deepEqual(
          JSON.parse(response.result.content[0].text),
          JSON.parse(JSON.stringify(output)),
        );
        const explicitDefaults = await client.request('tools/call', {
          name: categoryToolName,
          arguments: { pageNo: 1, pageSize: 20 },
        });
        assert.equal(explicitDefaults.error, undefined);
        assert.notEqual(explicitDefaults.result.isError, true);
        assert.deepEqual(explicitDefaults.result.structuredContent, output);
        assert.ok(output.list.some((category: any) => category.name === 'Empty'));
        const electronics = output.list.find((category: any) => category.name === 'Electronics');
        assert.ok(electronics, 'read-only static fixture provides the stocked category');
        const search = await client.request('tools/call', {
          name: toolName,
          arguments: { categoryId: electronics.id, pageSize: 1 },
        });
        assert.equal(search.error, undefined);
        assert.notEqual(search.result.isError, true);
        assert.equal(search.result.structuredContent.list.length, 1);
        const product = search.result.structuredContent.list[0];
        assert.equal(product.categoryId, electronics.id);
        const detail = await client.request('tools/call', {
          name: detailToolName,
          arguments: { id: product.id },
        });
        assert.equal(detail.error, undefined);
        assert.notEqual(detail.result.isError, true);
        assert.equal(detail.result.structuredContent.id, product.id);
        assert.equal(detail.result.structuredContent.categoryId, electronics.id);
        for (const args of [
          { pageNo: 0 },
          { pageSize: 0 },
          { pageNo: 1.5 },
          { pageSize: 1.5 },
          { pageSize: 101 },
          { pageNo: '1' },
          { pageSize: true },
          { unknown: true },
          { title: 'Electronics' },
          { iid: 1 },
          { instanceName: 'shareTest' },
          { route: '/mcp/test/catalog/categories' },
          { innerAccess: true },
          { headers: { authorization: 'synthetic-forbidden' } },
        ]) {
          const rejected = await client.request('tools/call', {
            name: categoryToolName,
            arguments: args,
          });
          assert.deepEqual(
            rejected.error,
            { code: -32602, message: 'Invalid tool arguments' },
            JSON.stringify(args),
          );
        }
      } finally {
        await client.close();
      }
    });
  });

  it('reads public detail from a searched product identity with DTO-projected output', async () => {
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const listed = await client.request('tools/list');
        const tool = listed.result.tools.find((tool: any) => tool.name === detailToolName);
        assert.equal(tool.annotations.readOnlyHint, true);
        assert.deepEqual(Object.keys(tool.inputSchema.properties), ['id']);
        assert.deepEqual(tool.inputSchema.required, ['id']);
        assert.equal(tool.inputSchema.additionalProperties, false);
        assert.ok(tool.outputSchema.properties.descriptionHtml);
        assert.ok(tool.outputSchema.components.schemas);
        const search = await client.request('tools/call', {
          name: toolName,
          arguments: { title: 'Wireless Headphones', pageSize: 1 },
        });
        const id = search.result.structuredContent.list[0].id;
        const response = await client.request('tools/call', {
          name: detailToolName,
          arguments: { id },
        });
        assert.equal(response.error, undefined);
        assert.notEqual(response.result.isError, true);
        const output = response.result.structuredContent;
        const direct = await app.bean.executor.performAction(
          'get',
          '/mcp/test/catalog/products/:id',
          { params: { id }, innerAccess: false },
        );
        assert.deepEqual(output, await $schema(DtoProductPublicDetail).parseAsync(direct));
        assert.equal(output.id, id);
        assert.equal(output.title, 'Wireless Headphones');
        assert.equal(output.descriptionHtml, '<p>Synthetic wireless audio</p>');
        assert.deepEqual(Object.keys(output).sort(), [
          'available',
          'categoryId',
          'categoryName',
          'description',
          'descriptionHtml',
          'id',
          'priceCents',
          'skuAvailables',
          'title',
        ]);
        assert.ok(output.skuAvailables.length > 0);
        for (const sku of output.skuAvailables) {
          assert.deepEqual(Object.keys(sku).sort(), ['available', 'code', 'id', 'priceCents']);
        }
        // The in-memory transport retains undefined; JSON wire output omits optional fields.
        assert.deepEqual(
          JSON.parse(response.result.content[0].text),
          JSON.parse(JSON.stringify(output)),
        );
      } finally {
        await client.close();
      }
    });
  });

  it('rejects missing or malformed detail identities and execution-control arguments', async () => {
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const search = await client.request('tools/call', {
          name: toolName,
          arguments: { title: 'Wireless Headphones', pageSize: 1 },
        });
        const id = search.result.structuredContent.list[0].id;
        for (const args of [
          undefined,
          {},
          { id: null },
          { id: true },
          { id: {} },
          { id: [] },
          { id, iid: 1 },
          { id, instanceName: 'shareTest' },
          { id, route: '/mcp/test/catalog/products' },
          { id, innerAccess: true },
          { id, headers: { authorization: 'synthetic-forbidden' } },
        ]) {
          const response = await client.request('tools/call', {
            name: detailToolName,
            arguments: args,
          });
          assert.deepEqual(
            response.error,
            { code: -32602, message: 'Invalid tool arguments' },
            JSON.stringify(args),
          );
        }
      } finally {
        await client.close();
      }
    });
  });

  it('returns the same not-found result for absent and foreign-instance products and requires context', async () => {
    let id: unknown;
    const notFound = {
      isError: true,
      content: [{ type: 'text', text: 'Product not found' }],
    };
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const search = await client.request('tools/call', {
          name: toolName,
          arguments: { title: 'Wireless Headphones', pageSize: 1 },
        });
        id = search.result.structuredContent.list[0].id;
        const absentId = String(Number.MAX_SAFE_INTEGER);
        assert.equal(await app.bean._getBean(ServiceCatalog).findPublicById(absentId), undefined);
        const response = await client.request('tools/call', {
          name: detailToolName,
          arguments: { id: absentId },
        });
        assert.equal(response.error, undefined);
        assert.deepEqual(response.result, notFound);
      } finally {
        await client.close();
      }
    });
    let client!: Awaited<ReturnType<typeof connect>>;
    await app.bean.executor.mockCtx(
      async () => {
        client = await connect(await createBusinessToolServer(app));
        try {
          const response = await client.request('tools/call', {
            name: detailToolName,
            arguments: { id },
          });
          assert.equal(response.error, undefined);
          assert.deepEqual(response.result, notFound);
        } catch (error) {
          await client.close();
          throw error;
        }
      },
      { instanceName: 'shareTest' as any },
    );
    try {
      const response = await client.request('tools/call', {
        name: detailToolName,
        arguments: { id },
      });
      assert.deepEqual(response.error, { code: -32603, message: 'Request context required' });
    } finally {
      await client.close();
    }
  });

  it('rejects unknown tools, DTO violations and client-controlled execution options', async () => {
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const unknown = await client.request('tools/call', { name: 'commerce_products_delete' });
        assert.equal(unknown.error.code, -32602);
        for (const args of [
          { pageSize: 101 },
          { title: 'x'.repeat(201) },
          { pageNo: 0 },
          { iid: 1 },
          { instanceName: 'shareTest' },
          { route: '/mcp/test/catalog/products' },
          { innerAccess: true },
          { headers: { authorization: 'synthetic-forbidden' } },
        ]) {
          const response = await client.request('tools/call', { name: toolName, arguments: args });
          assert.deepEqual(
            response.error,
            { code: -32602, message: 'Invalid tool arguments' },
            JSON.stringify(args),
          );
        }
      } finally {
        await client.close();
      }
    });
  });

  it('retains the current instance scope and requires a caller-owned request context', async () => {
    let categoryId: unknown;
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const response = await client.request('tools/call', {
          name: toolName,
          arguments: { title: 'Wireless Headphones' },
        });
        categoryId = response.result.structuredContent.list[0].categoryId;
      } finally {
        await client.close();
      }
    });
    let client!: Awaited<ReturnType<typeof connect>>;
    await app.bean.executor.mockCtx(
      async () => {
        client = await connect(await createBusinessToolServer(app));
        try {
          const response = await client.request('tools/call', {
            name: toolName,
            arguments: { categoryId },
          });
          assert.equal(response.error, undefined);
          assert.deepEqual(response.result.structuredContent.list, []);
          assert.equal(response.result.structuredContent.total, '0');
        } catch (error) {
          await client.close();
          throw error;
        }
      },
      { instanceName: 'shareTest' as any },
    );
    try {
      const response = await client.request('tools/call', { name: toolName });
      assert.deepEqual(response.error, { code: -32603, message: 'Request context required' });
    } finally {
      await client.close();
    }
  });
});
