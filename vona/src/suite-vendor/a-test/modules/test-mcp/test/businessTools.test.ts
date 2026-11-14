import type { JSONRPCMessage, JSONRPCRequest, Server } from '@modelcontextprotocol/server';
import type { TestContext } from 'node:test';
import type { BeanExecutor } from 'vona-module-a-executor';
import type { IMcpToolOptions } from 'vona-module-a-openapiutils';
import type { IAnalysisPolicy, IQueryPolicy } from 'vona-module-a-orm';
import type { IPassport } from 'vona-module-a-user';
import type { ToolSchema } from 'vona-module-cabloy-mcp';

import { OpenApiGeneratorV31, OpenAPIRegistry } from '@cabloy/zod-to-openapi';
import { fromJsonSchema, InMemoryTransport } from '@modelcontextprotocol/server';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import {
  appMetadata,
  appResource,
  createRequestBoundary,
  runWithRequestBoundary,
  runWithZodQueryCoercion,
} from 'vona';
import { acquireTestLock, app } from 'vona-mock';
import { getKeyHash } from 'vona-module-a-cache';
import { $schema, Mcp, SymbolMcpOptions } from 'vona-module-a-openapiutils';
import * as orm from 'vona-module-a-orm';
import { recordResourceNameToRoutePath } from 'vona-module-a-web';
import {
  beginToolCall,
  closeMutationInputSchema,
  compactToolSchema,
  controllerToolQuery,
  createControllerToolServer,
  createSharedBusinessToolServer,
  isPrimitiveSchema,
  normalizeDateTransport,
  queryRepairHint,
  recordToolCall,
  resolveSchema,
  serializeDateTransport,
  summarizeToolQueries,
  toolSchema,
} from 'vona-module-cabloy-mcp';
import { getMcpIssuer } from 'vona-module-mcp-auth';
import z from 'zod';

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
  const initialized = await request('initialize', {
    protocolVersion: '2025-11-25',
    capabilities: {},
    clientInfo: { name: 'business-tool-test', version: '1.0.0' },
  });
  await client.send({ jsonrpc: '2.0', method: 'notifications/initialized' });
  return { request, serverInfo: initialized.result.serverInfo, close: () => server.close() };
}

const toolContractToolName = 'cabloy_tool_contract';
const retiredQueryCapabilitiesToolName = 'cabloy_query_capabilities';
const toolName = 'commerce_products_search';
const detailToolName = 'commerce_product_detail';
const categoryToolName = 'commerce_categories_list';
const statusToolName = 'mcp_test_action_status';
const effectToolName = 'mcp_test_action_effect';
const scalarToolName = 'mcp_test_action_scalar';
const arrayToolName = 'mcp_test_action_array';
const studentToolNames = [
  'training-student_student_aggregate',
  'training-student_student_create',
  'training-student_student_delete',
  'training-student_student_group',
  'training-student_student_select',
  'training-student_student_summary',
  'training-student_student_update',
  'training-student_student_view',
];

function studentTools(tools: any[]) {
  return tools.filter(tool => tool.name.startsWith('training-student_student_'));
}

async function nativeStudentQuery() {
  // The native module, not the MCP schema under test, selects the query contract.
  // Legacy Student modules do not export studentQuery.
  const student = (await import('vona-module-training-student')) as Record<string, any>;
  return student.studentQuery;
}

async function nativeStudentInput(action = 'select'): Promise<Record<string, any>> {
  const controller = recordResourceNameToRoutePath['training-student:student'].controller;
  const document = await app.bean.openapi.generateJsonOfControllerAction(
    controller,
    action,
    'V31',
    {
      includeExcluded: true,
      schemaTarget: 'mcp',
    },
  );
  const operation = Object.values(document.paths ?? {})
    .map(path => (path as any).get)
    .find(Boolean);
  assert.ok(operation, `native Student ${action} operation exists`);
  return toolSchema(
    {
      type: 'object',
      properties: Object.fromEntries(
        operation.parameters.map((parameter: any) => [parameter.name, parameter.schema]),
      ),
      required: operation.parameters
        .filter((parameter: any) => parameter.required)
        .map((parameter: any) => parameter.name),
      additionalProperties: false,
    },
    document.components?.schemas ?? {},
  );
}

function studentActionIsScoped(action: string) {
  const descriptor = app.bean.rbacCatalog
    .getCatalog()
    .get(`training-student.controller.student#${action}`);
  assert.ok(descriptor, `Student ${action} is registered in the RBAC catalog`);
  return Boolean(descriptor.options.dataScope);
}

function mockOwnedPerformAction(
  t: TestContext,
  implementation: (
    this: BeanExecutor,
    ...args: Parameters<BeanExecutor['performAction']>
  ) => Promise<any>,
) {
  const context = app.ctx;
  assert.ok(context, 'performAction mocks require an owned mockCtx');
  const executor = app.bean.executor;
  const original = executor.performAction;
  const owned = t.mock.fn(implementation);
  // The executor is application-owned; intercept the exact context, never a Passport identity.
  const installed = t.mock.method(
    executor,
    'performAction',
    async function (this: BeanExecutor, ...args: Parameters<BeanExecutor['performAction']>) {
      if (app.ctx !== context) return await original.apply(this, args);
      return await owned.apply(this, args);
    },
  );
  return {
    mock: {
      get calls() {
        return owned.mock.calls;
      },
      callCount: () => owned.mock.callCount(),
      mockImplementation: (next: typeof implementation) => owned.mock.mockImplementation(next),
      restore: () => installed.mock.restore(),
    },
  };
}

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
      return {
        allowed: true,
        actionKey: request.action.actionKey,
        action: request.action,
        ...(request.action.options.dataScope
          ? { terms: [{ dataScope: 'mine' as const, ownerId: String(passport.user!.id) }] }
          : {}),
      };
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
  it('reports application identity with trimmed values and independent defaults during initialization', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const [env, expected] of [
        [
          { APP_NAME: '  school-prod  ', APP_VERSION: '  2.3.0  ' },
          { name: 'school-prod', version: '2.3.0' },
        ],
        [
          { APP_NAME: undefined, APP_VERSION: undefined },
          { name: 'cabloy-mcp-actions', version: '0.1.0' },
        ],
        [
          { APP_NAME: '', APP_VERSION: ' \t ' },
          { name: 'cabloy-mcp-actions', version: '0.1.0' },
        ],
        [
          { APP_NAME: ' \t ', APP_VERSION: '  2.3.0  ' },
          { name: 'cabloy-mcp-actions', version: '2.3.0' },
        ],
        [
          { APP_NAME: '  school-prod  ', APP_VERSION: '' },
          { name: 'school-prod', version: '0.1.0' },
        ],
      ] as const) {
        const meta = Object.create(app.meta);
        Object.defineProperty(meta, 'env', { value: { ...app.meta.env, ...env } });
        const application: typeof app = Object.create(app);
        Object.defineProperty(application, 'meta', { value: meta });
        const client = await connect(
          await createControllerToolServer(application, 'mcp:read', {
            ssrSiteId: 'web',
            includeTool: () => false,
          }),
        );
        try {
          assert.deepEqual(client.serverInfo, expected);
        } finally {
          await client.close();
        }
      }
    });
  });

  it('compacts only native query bindings and extracts exact finite generated operands without mutation', async () => {
    class QueryModel {}
    const query = {
      name: 'McpCompactOperandFixture',
      modelClass: QueryModel,
      modelLike: QueryModel,
      fields: {
        title: {
          type: 'string',
          schema: z.string(),
          nullable: true,
          operators: ['eq', 'in', 'isNull', 'isNotNull'],
        },
        level: {
          type: 'enum',
          schema: z.union([z.literal(1), z.literal(2), z.literal(3)]),
          nullable: false,
          operators: ['eq', 'in'],
        },
        id: {
          type: 'identity',
          schema: z.string().regex(/^\d+$/),
          nullable: false,
          operators: ['eq', 'in'],
        },
        createdAt: {
          type: 'timestamp',
          schema: z.iso.datetime({ offset: true }),
          nullable: false,
          operators: ['gte'],
        },
        day: { type: 'date', schema: z.iso.date(), nullable: false, operators: ['eq'] },
      },
      pagination: true,
      orderable: ['title'],
      projection: { mode: 'fixed' },
      defaults: { pageNo: 1, pageSize: 20, orders: [{ field: 'title', direction: 'asc' }] },
      limits: { ...orm.queryDefaultLimits, maxStringLength: 12, maxListItems: 3 },
      bindings: {},
      conveniences: {},
    } as unknown as IQueryPolicy;
    const analysis = {
      modelClass: QueryModel,
      modelLike: QueryModel,
      groups: ['level'],
      aggrs: { count: ['*', 'id'] },
      defaults: {
        group: { groups: ['level'], aggrs: { count: ['*'] } },
        aggregate: { aggrs: { count: ['*', 'id'] } },
      },
      limits: { maxGroups: 1, maxMetrics: 2, maxGroupRows: 10 },
    } as unknown as IAnalysisPolicy;
    const registry = new OpenAPIRegistry();
    registry.register(
      'CompactQuery',
      z.strictObject({
        ...orm.queryControlSchemas(query),
        title: z.string().optional().openapi({ description: 'Named UI filter' }),
      }),
    );
    const generated = new OpenApiGeneratorV31(registry.definitions).generateDocument({
      openapi: '3.1.0',
      info: { title: 'MCP query extraction fixture', version: '1' },
    });
    const schemas = generated.components!.schemas! as Record<string, any>;
    const ref = { $ref: '#/components/schemas/CompactQuery' };
    const native = resolveSchema(ref, schemas);
    const predicate = resolveSchema(native.properties.where, schemas);
    const leaves = predicate.anyOf
      .map((branch: any) => resolveSchema(branch, schemas))
      .filter((branch: any) => branch.properties?.field);
    assert.equal(leaves.length, 9);
    const snapshot = JSON.stringify(schemas);
    for (const { flat, field, mode } of [
      { flat: true, mode: 'select' },
      { flat: false, mode: 'select' },
      { flat: true, field: 'criteria', mode: 'group' },
      { flat: false, field: 'criteria', mode: 'aggregate' },
    ] as const) {
      const group: Record<string, any> = field
        ? {
            type: 'object',
            properties: { [field]: ref, untouched: { type: 'string' } },
            additionalProperties: false,
          }
        : ref;
      const input: Record<string, any> = flat
        ? group
        : {
            type: 'object',
            properties: {
              query: group,
              params: { type: 'object', properties: { id: { type: 'string' } } },
            },
            required: ['query', 'params'],
            additionalProperties: false,
          };
      const inputSnapshot = JSON.stringify(input);
      const projected = controllerToolQuery(
        input,
        schemas,
        [
          {
            type: 'query',
            ...(field ? { field } : {}),
            query,
            ...(mode === 'select' ? {} : { analysis, analysisMode: mode }),
          },
        ],
        flat,
      );
      const [binding] = projected.bindings;
      const argumentPath = [...(flat ? [] : ['query']), ...(field ? [field] : [])];
      assert.deepEqual(binding.argumentPath, argumentPath);
      assert.equal(binding.mode, mode);
      assert.deepEqual(binding.capabilities.query, orm.queryCapabilities(query));
      assert.deepEqual(
        binding.capabilities.analysis,
        mode === 'select' ? undefined : orm.analysisCapabilities(analysis, mode),
      );
      const compact = argumentPath.reduce((schema, key) => schema.properties[key], projected.input);
      assert.deepEqual(Object.keys(compact.properties.where).sort(), [
        'additionalProperties',
        'description',
        'type',
      ]);
      assert.equal(compact.properties.where.type, 'object');
      assert.match(compact.properties.where.description, /cabloy_tool_contract/);
      const expectedControls = structuredClone(native);
      delete expectedControls.properties.where;
      delete expectedControls.properties.orders.filter;
      assert.deepEqual(binding.querySchema, toolSchema(expectedControls, schemas));
      assert.deepEqual(binding.predicates, toolSchema({ anyOf: leaves }, schemas));
      const published = toolSchema(projected.input, schemas);
      assert.doesNotMatch(JSON.stringify(published), /QueryPredicate|"capabilities":/);
      assert.equal(published.$defs, undefined, 'unused predicate definitions disappear');
      assert.deepEqual(compact.properties.title, native.properties.title);
      assert.deepEqual(compact.properties.pageSize, native.properties.pageSize);
      if (field) {
        const projectedGroup = flat ? projected.input : projected.input.properties.query;
        assert.deepEqual(projectedGroup.properties.untouched, group.properties!.untouched);
      }
      if (!flat) assert.deepEqual(projected.input.properties.params, input.properties!.params);
      assert.equal(JSON.stringify(input), inputSnapshot);
      assert.equal(JSON.stringify(schemas), snapshot);
      const check = fromJsonSchema(binding.predicates as Parameters<typeof fromJsonSchema>[0])[
        '~standard'
      ];
      for (const value of [
        { field: 'title', op: 'eq', value: 'a' },
        { field: 'title', op: 'in', value: ['a', 'b'] },
        { field: 'title', op: 'isNull' },
        { field: 'title', op: 'isNotNull' },
        { field: 'level', op: 'eq', value: 2 },
        { field: 'level', op: 'in', value: [1, 3] },
        { field: 'id', op: 'eq', value: '12' },
        { field: 'id', op: 'in', value: ['12', '13'] },
        { field: 'createdAt', op: 'gte', value: '2026-01-01T00:00:00.000Z' },
        { field: 'day', op: 'eq', value: '2026-01-01' },
      ])
        assert.equal((await check.validate(value)).issues, undefined, JSON.stringify(value));
      for (const value of [
        { field: 'title', op: 'eq', value: 'x'.repeat(13) },
        { field: 'title', op: 'eq', value: null },
        { field: 'title', op: 'in', value: [] },
        { field: 'title', op: 'in', value: ['a', 'b', 'c', 'd'] },
        { field: 'title', op: 'isNull', value: null },
        { field: 'level', op: 'eq', value: 4 },
        { field: 'level', op: 'eq', value: '2' },
        { field: 'id', op: 'eq', value: 12 },
        { field: 'id', op: 'in', value: ['invalid'] },
        { field: 'createdAt', op: 'gte', value: 'not-a-date' },
        { field: 'day', op: 'eq', value: '2026-01-01T00:00:00.000Z' },
        { field: 'title', op: 'eq', value: 'a', injected: true },
        { or: [{ field: 'title', op: 'eq', value: 'a' }] },
      ])
        assert.ok((await check.validate(value)).issues, JSON.stringify(value));
    }
    assert.deepEqual(
      controllerToolQuery(native, schemas, [], true),
      { input: native, bindings: [] },
      'a property named where does not create a policy binding',
    );
    const cyclicSchemas = {
      ...schemas,
      Loop: { type: 'object', properties: { next: { $ref: '#/components/schemas/Loop' } } },
    };
    const cyclicControl = structuredClone(native);
    cyclicControl.properties.extra = { $ref: '#/components/schemas/Loop' };
    assert.throws(
      () => controllerToolQuery(cyclicControl, cyclicSchemas, [{ type: 'query', query }], true),
      /Recursive query capability/,
    );
    const cyclicOperand = structuredClone(predicate);
    cyclicOperand.anyOf[0].properties.value = { $ref: '#/components/schemas/Loop' };
    assert.throws(
      () =>
        controllerToolQuery(
          {
            ...native,
            properties: { ...native.properties, where: cyclicOperand },
          },
          cyclicSchemas,
          [{ type: 'query', query }],
          true,
        ),
      /Recursive query capability/,
    );
    assert.throws(
      () =>
        controllerToolQuery(
          { type: 'object', properties: { where: { type: 'object' } } },
          {},
          [{ type: 'query', query }],
          true,
        ),
      /Unsupported query predicate/,
    );
    assert.throws(
      () =>
        controllerToolQuery(native, schemas, [{ type: 'query', field: 'missing', query }], true),
      /Query binding unavailable/,
    );
    assert.equal(JSON.stringify(schemas), snapshot);
  });

  it('compacts explicit object and array paths on cloned schemas without retaining hidden definitions', async () => {
    const schemas = {
      Body: {
        type: ['object', 'null'],
        properties: {
          amount: { type: 'integer', minimum: 1 },
          privateGraph: { $ref: '#/components/schemas/Private' },
        },
        required: ['amount'],
        additionalProperties: false,
      },
      Private: {
        type: 'object',
        properties: {
          secret: { type: 'string' },
          children: { type: 'array', items: { $ref: '#/components/schemas/Private' } },
        },
      },
      Item: {
        type: 'object',
        properties: { name: { type: 'string' } },
        required: ['name'],
        additionalProperties: false,
      },
    };
    const source = {
      type: 'object',
      properties: {
        body: { $ref: '#/components/schemas/Body' },
        list: { type: ['array', 'null'], items: { $ref: '#/components/schemas/Item' } },
        items: { type: 'object', properties: { keep: { type: 'boolean' } } },
        total: { type: 'integer', minimum: 0 },
      },
      required: ['body', 'list', 'total'],
      additionalProperties: false,
    };
    const paths = [['body'], ['list', 'items']];
    const snapshot = JSON.stringify({ source, schemas, paths });
    const full = toolSchema(source, schemas);
    assert.ok(full.$defs!.Private, 'full contract retains reachable recursive definitions');
    assert.equal(full.$defs!.Private.properties.children.items.$ref, '#/$defs/Private');
    for (const direction of ['input', 'output'] as const) {
      const compact = toolSchema(compactToolSchema(source, schemas, paths, direction), schemas);
      assert.deepEqual(compact.required, source.required);
      assert.equal(compact.additionalProperties, false);
      assert.deepEqual(compact.properties!.total, source.properties.total);
      assert.deepEqual(
        compact.properties!.items,
        source.properties.items,
        'items is an ordinary property on objects',
      );
      const body = resolveSchema(compact.properties!.body as ToolSchema, compact.$defs ?? {});
      assert.deepEqual(body.type, ['object', 'null']);
      assert.equal(body.additionalProperties, true);
      assert.equal(body.properties, undefined);
      assert.equal(body.required, undefined);
      assert.match(body.description, /cabloy_tool_contract/);
      const list = compact.properties!.list as ToolSchema;
      assert.deepEqual(list.type, ['array', 'null']);
      assert.equal(list.items.type, 'object');
      assert.equal(list.items.additionalProperties, true);
      assert.equal(list.items.properties, undefined);
      assert.equal(
        compact.$defs,
        undefined,
        'definitions reachable only through compact nodes disappear',
      );
      const check = fromJsonSchema(compact as Parameters<typeof fromJsonSchema>[0])['~standard'];
      assert.equal(
        (await check.validate({ body: { any: true }, list: [{ any: true }], total: 0 })).issues,
        undefined,
      );
      assert.equal((await check.validate({ body: null, list: null, total: 0 })).issues, undefined);
      assert.ok((await check.validate({ body: 1, list: [], total: 0 })).issues);
      assert.ok((await check.validate({ body: {}, list: [1], total: 0 })).issues);
      compact.properties!.total.minimum = 99;
      assert.equal(JSON.stringify({ source, schemas, paths }), snapshot);
    }
    const array = compactToolSchema(source, schemas, [['list']], 'output');
    assert.deepEqual(array.properties!.list.type, ['array', 'null']);
    assert.deepEqual(array.properties!.list.items, {});
    const objectItems = compactToolSchema(source, schemas, [['items']], 'input');
    assert.equal(objectItems.properties!.items.additionalProperties, true);
    assert.equal(objectItems.properties!.items.properties, undefined);
    const unprojected = compactToolSchema(source, schemas, [], 'input');
    assert.deepEqual(unprojected, source);
    assert.notEqual(unprojected, source);
    assert.equal(JSON.stringify({ source, schemas, paths }), snapshot);
  });

  it('rejects invalid discovery paths rather than silently broadening schema projection', () => {
    const source = {
      type: 'object',
      properties: {
        body: { type: 'object', properties: { nested: { type: 'object' } } },
        primitive: { type: 'string' },
        list: {
          type: 'array',
          items: { type: 'object', properties: { nested: { type: 'object' } } },
        },
        union: { anyOf: [{ type: 'object' }, { type: 'null' }] },
        one: { oneOf: [{ type: 'object' }] },
        all: { type: 'object', allOf: [{ type: 'object' }] },
        mixed: { type: ['object', 'string'] },
      },
    };
    const snapshot = JSON.stringify(source);
    for (const paths of [
      [[]],
      [['missing']],
      [['primitive']],
      [['primitive', 'nested']],
      [['list', 'nested']],
      [['list', 'items', 'nested']],
      [['body'], ['body']],
      [['body'], ['body', 'nested']],
      [['body', 'nested'], ['body']],
      [['list'], ['list', 'items']],
      [['union']],
      [['one']],
      [['all']],
      [['mixed']],
    ]) {
      for (const direction of ['input', 'output'] as const) {
        assert.throws(
          () => compactToolSchema(source, {}, paths, direction),
          { name: 'Error', message: new RegExp(`Invalid MCP discovery\\.${direction} path:`) },
          JSON.stringify(paths),
        );
      }
    }
    assert.equal(JSON.stringify(source), snapshot);
  });

  it('publishes reachable recursive definitions as $defs without mutating OpenAPI', async () => {
    const ref = '#/components/schemas/Node~1With~0Escape';
    const source = {
      type: 'object',
      properties: { node: { $ref: ref, description: 'Root node' } },
      required: ['node'],
    };
    const schemas = {
      'Node/With~Escape': {
        type: 'object',
        properties: {
          label: { type: 'string' },
          children: { type: 'array', items: { $ref: ref } },
        },
        required: ['label'],
        additionalProperties: false,
      },
      'Private': { type: 'object', properties: { secret: { type: 'string' } } },
    };
    const snapshot = JSON.stringify({ source, schemas });
    const published = toolSchema(source, schemas);
    assert.equal(published.components, undefined);
    assert.deepEqual(Object.keys(published.$defs!), ['Node/With~Escape']);
    assert.deepEqual(published.properties!.node, {
      $ref: '#/$defs/Node~1With~0Escape',
      description: 'Root node',
    });
    const node = resolveSchema(published.properties!.node, published.$defs!);
    assert.equal(node.description, 'Root node');
    assert.equal(node.properties.children.items.$ref, '#/$defs/Node~1With~0Escape');
    const check = fromJsonSchema(published as Parameters<typeof fromJsonSchema>[0])['~standard'];
    assert.equal(
      (await check.validate({ node: { label: 'parent', children: [{ label: 'child' }] } })).issues,
      undefined,
    );
    assert.ok(
      (await check.validate({ node: { label: 'parent', children: [{ label: 1 }] } })).issues,
    );
    assert.equal(JSON.stringify({ source, schemas }), snapshot);
    assert.equal(toolSchema({ type: 'object' }, schemas).$defs, undefined);
    assert.throws(() => toolSchema(source, {}), /Unresolved action schema reference/);
    assert.throws(
      () =>
        toolSchema(
          { type: 'object', properties: { node: { $ref: 'https://example.com/node' } } },
          {},
        ),
      /Unsupported schema reference/,
    );
  });

  it('removes MCP presentation metadata only at schema positions without changing business data', async () => {
    const data = {
      rest: { render: 'business data' },
      errorMessage: 'business message',
      $ref: 'https://example.com/literal-data',
      properties: { rest: 'literal property' },
    };
    const field = {
      type: 'string',
      title: 'Business field',
      description: 'At least two characters',
      minLength: 2,
      rest: { render: 'UI component', $ref: '#/components/schemas/UnusedUI' },
      errorMessage: { minLength: 'UI validation message' },
    };
    const source: ToolSchema = {
      type: 'object',
      properties: {
        rest: field,
        errorMessage: field,
        node: { $ref: '#/components/schemas/Node', ...field, type: 'object' },
      },
      required: ['rest', 'errorMessage'],
      additionalProperties: false,
      rest: { form: { visible: true } },
      errorMessage: { required: 'UI required message' },
      default: data,
      examples: [data],
      const: data,
      enum: [data],
      filter: { capabilities: data },
    };
    const schemas = {
      Node: {
        type: 'object',
        properties: { children: { type: 'array', items: { $ref: '#/components/schemas/Node' } } },
        rest: { render: 'Tree' },
        errorMessage: { type: 'UI type message' },
      },
    };
    const snapshot = JSON.stringify({ source, schemas });
    const published = toolSchema(source, schemas);
    const { rest: _rest, errorMessage: _errorMessage, ...semanticField } = field;
    assert.equal(Object.hasOwn(published, 'rest'), false);
    assert.equal(Object.hasOwn(published, 'errorMessage'), false);
    assert.deepEqual(published.properties!.rest, semanticField);
    assert.deepEqual(published.properties!.errorMessage, semanticField);
    assert.deepEqual(published.required, ['rest', 'errorMessage']);
    assert.equal(published.additionalProperties, false);
    for (const key of ['default', 'examples', 'const', 'enum', 'filter']) {
      assert.deepEqual(published[key], source[key], `${key} retains literal business data`);
    }
    assert.deepEqual(Object.keys(published.$defs!), ['Node']);
    const node = published.$defs!.Node;
    assert.equal(Object.hasOwn(node, 'rest'), false);
    assert.equal(Object.hasOwn(node, 'errorMessage'), false);
    assert.equal(node.properties.children.items.$ref, '#/$defs/Node');
    const nodeRef = published.properties!.node;
    assert.ok(nodeRef && typeof nodeRef === 'object' && !Array.isArray(nodeRef));
    assert.equal(nodeRef.$ref, '#/$defs/Node');
    assert.equal(nodeRef.description, field.description);
    assert.equal(Object.hasOwn(nodeRef, 'rest'), false);
    assert.equal(Object.hasOwn(nodeRef, 'errorMessage'), false);
    assert.equal(JSON.stringify({ source, schemas }), snapshot);

    const schemaPositions: ToolSchema = {
      properties: { rest: field, errorMessage: field },
      patternProperties: { '^value': field },
      $defs: { local: field },
      definitions: { legacy: field },
      dependentSchemas: { rest: field },
      dependencies: { rest: field, errorMessage: ['rest'] },
    };
    for (const key of [
      'items',
      'additionalItems',
      'additionalProperties',
      'unevaluatedItems',
      'unevaluatedProperties',
      'propertyNames',
      'contains',
      'not',
      'if',
      'then',
      'else',
      'contentSchema',
    ]) {
      schemaPositions[key] = field;
    }
    for (const key of ['allOf', 'anyOf', 'oneOf', 'prefixItems']) {
      schemaPositions[key] = [field];
    }
    const expected = JSON.stringify(schemaPositions, (_key, value) =>
      value === field ? semanticField : value,
    );
    assert.deepEqual(toolSchema(schemaPositions, {}), JSON.parse(expected));
    assert.deepEqual(toolSchema({ items: [field] }, {}), { items: [semanticField] });
  });

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
    const copied = (schema as any).$defs.Node;
    assert.equal(copied.additionalProperties, false);
    assert.equal(Object.hasOwn(copied, 'rest'), false);
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
    // Only public-query contracts carry policy-validated JSON predicate operands.
    if (app.meta.modules['training-student'] && (await nativeStudentQuery())) {
      const predicate = {
        filter: { capabilities: { query: { fields: { id: {}, createdAt: {} } } } },
        anyOf: [
          { type: 'object', properties: { field: { const: 'id' }, value: { type: 'string' } } },
          {
            type: 'object',
            properties: {
              field: { const: 'createdAt' },
              value: { type: 'string', format: 'date-time' },
            },
          },
        ],
      };
      for (const where of [
        { field: 'id', op: 'eq', value: '12' },
        { field: 'createdAt', op: 'gte', value: dateValue },
      ]) {
        assert.deepEqual(
          normalizeDateTransport(
            { where, trainingTime: dateValue },
            {
              type: 'object',
              properties: {
                where: { $ref: '#/components/schemas/Predicate' },
                trainingTime: { type: 'string', format: 'date-time' },
              },
            },
            { Predicate: predicate },
          ),
          { where, trainingTime: new Date(dateValue) },
        );
      }
    }
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
    const serialized = serializeDateTransport(nativeArgs, transport, transport.$defs ?? {});
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
    assert.ok(app.meta.modules['test-mcp'], 'fixture module is loaded');
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
    release = await acquireTestLock('test-mcp');
  });
  after(() => release?.());

  it('keeps performAction mocks local while an independent context executes the real Action', async t => {
    await app.bean.executor.mockCtx(
      async () => {
        const context = app.ctx;
        const action = mockOwnedPerformAction(t, async () => 'owned-action');
        const call = () =>
          app.bean.executor.performAction('get', '/mcp/test/catalog/products', {
            query: { title: 'Wireless Headphones', pageNo: 1, pageSize: 1 },
            innerAccess: false,
          });
        try {
          assert.equal(await call(), 'owned-action');
          assert.equal(action.mock.callCount(), 1);
          await app.bean.executor.mockCtx(
            async () => {
              assert.notEqual(app.ctx, context);
              const result = await call();
              assert.equal(result.list.length, 1);
              assert.equal(result.list[0].title, 'Wireless Headphones');
              assert.equal(action.mock.callCount(), 1, 'unrelated dispatch is not recorded');
            },
            { instanceName: '' },
          );
          action.mock.mockImplementation(async () => 'updated-owned-action');
          assert.equal(await call(), 'updated-owned-action');
          assert.equal(action.mock.callCount(), 2);
        } finally {
          action.mock.restore();
        }
      },
      { instanceName: '' },
    );
  });

  it('discovers another resource dynamically with its own current guards and scope ceiling', async t => {
    if (!app.meta.modules['test-rest']) {
      t.skip('test-rest is not active');
      return;
    }
    await app.bean.executor.mockCtx(async () => {
      const resource = recordResourceNameToRoutePath['test-rest:product'];
      assert.ok(resource, 'the second resource fixture is registered');
      const controller = resource.controller;
      const name = 'test-rest_product_create';
      const original = appMetadata.getOwnMetadata;
      const metadata = t.mock.method(
        appMetadata,
        'getOwnMetadata',
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
        const all = await connect(
          await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/web`, 'mcp:all'),
        );
        clients.push(all);
        const read = await connect(
          await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/web`, 'mcp:read'),
        );
        clients.push(read);
        const names = async (client: typeof all) => {
          const listed = await client.request('tools/list');
          assert.equal(listed.error, undefined);
          return listed.result.tools.map((tool: any) => tool.name) as string[];
        };
        assert.equal((await names(all)).includes(name), false, 'the Action requires its own role');
        passport.roles = [
          {
            id: 'mcp-resource-admin',
            name: 'systemAdmin',
            title: 'Admin',
            siteIds: [],
            mcpAccess: true,
          },
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
        assert.equal(
          (await names(all)).includes('test-rest_product_select'),
          false,
          'unannotated Actions stay closed',
        );
        assert.equal(
          (await names(all)).includes(statusToolName),
          true,
          'explicitly opted-in non-Resource Actions are shared tools',
        );
        assert.equal(
          (await names(all)).includes(toolName),
          true,
          'explicitly opted-in synthetic catalog Actions are shared tools',
        );
        for (const excluded of ['test-rest_product_select']) {
          const rejected = await all.request('tools/call', { name: excluded, arguments: {} });
          assert.equal(rejected.error?.code, -32602);
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
      const anonymous = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:all'),
      );
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
              'training-student_student_summary',
              'training-student_student_view',
              'training-student_student_delete',
            ].includes(name)
              ? { id: '1' }
              : {},
          });
          assert.equal(rejected.error.code, -32602);
        }
      } finally {
        await standalone.close();
      }
      const server = await createSharedBusinessToolServer(
        app,
        `${getMcpIssuer(app)}/admin`,
        'mcp:all',
      );
      const shared = await connect(server);
      const action = mockOwnedPerformAction(t, async () => {
        assert.fail('discovery and invalid arguments must not dispatch business Actions');
      });
      try {
        const listed = JSON.parse(JSON.stringify(await shared.request('tools/list')));
        assert.equal(listed.error, undefined);
        assert.equal(action.mock.callCount(), 0, 'discovery runs guards without business Actions');
        const listedNames = listed.result.tools.map((tool: any) => tool.name);
        const studentNames = listedNames.filter((name: string) =>
          name.startsWith('training-student_student_'),
        );
        assert.deepEqual(
          studentNames.sort(),
          (app.meta.modules['training-student'] ? [...studentToolNames] : []).sort(),
        );
        assert.ok(listedNames.includes(toolName), 'synthetic catalog tools remain discoverable');
        assert.ok(
          listedNames.includes(statusToolName),
          'test Controller tools remain discoverable',
        );
        for (const name of studentToolNames) {
          const rejected = await shared.request('tools/call', {
            name: name.replace('training-student_student_', 'training_student_'),
            arguments: {},
          });
          assert.deepEqual(rejected.error, { code: -32602, message: 'Tool unavailable' });
        }
        assert.equal(action.mock.callCount(), 0, 'old explicit names do not dispatch Actions');
        const select = listed.result.tools.find(
          (tool: any) => tool.name === 'training-student_student_select',
        );
        const student = listed.result.tools.find(
          (tool: any) => tool.name === 'training-student_student_summary',
        );
        const view = listed.result.tools.find(
          (tool: any) => tool.name === 'training-student_student_view',
        );
        const create = listed.result.tools.find(
          (tool: any) => tool.name === 'training-student_student_create',
        );
        const update = listed.result.tools.find(
          (tool: any) => tool.name === 'training-student_student_update',
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
        const controller = recordResourceNameToRoutePath['training-student:student'].controller;
        const query = await nativeStudentQuery();
        const methods: Record<string, string> = {
          create: 'post',
          update: 'patch',
          delete: 'delete',
        };
        for (const tool of studentTools(listed.result.tools)) {
          assert.ok(!tool.description.includes('Level values:'), tool.name);
          const actionName = tool.name.slice('training-student_student_'.length);
          const metadata = appMetadata.getMetadata<IMcpToolOptions>(
            SymbolMcpOptions,
            controller.prototype,
            actionName,
          );
          assert.ok(metadata, `${actionName} retains explicit MCP opt-in`);
          assert.ok(metadata.description, `${actionName} declares its MCP description`);
          const businessDescription = app.meta.text(metadata.description);
          if (query && ['select', 'group', 'aggregate'].includes(actionName)) {
            assert.ok(tool.description.startsWith(`${businessDescription}\n\n`), tool.name);
            assert.match(tool.description, /prefer a single call using where\.or/);
            assert.match(tool.description, /named filters are additional AND constraints/);
            const where = resolveSchema(
              tool.inputSchema.properties.where,
              tool.inputSchema.$defs ?? {},
            );
            assert.deepEqual(Object.keys(where).sort(), [
              'additionalProperties',
              'description',
              'type',
            ]);
            assert.equal(where.type, 'object');
            assert.match(where.description, /explicit \{field,op,value\} leaves/);
            assert.match(where.description, /no field-value shorthand/);
            assert.match(where.description, /cabloy_tool_contract/);
            assert.doesNotMatch(JSON.stringify(tool.inputSchema), /QueryPredicate|"capabilities":/);
            const capabilityResponse = await shared.request('tools/call', {
              name: toolContractToolName,
              arguments: { tool: tool.name, section: 'query' },
            });
            assert.equal(capabilityResponse.error, undefined);
            const [binding] = capabilityResponse.result.structuredContent.bindings;
            assert.deepEqual(binding.argumentPath, []);
            assert.equal(binding.mode, actionName);
            assert.deepEqual(binding.capabilities.query.fields.level.operators, ['eq', 'gte']);
            assert.equal(binding.querySchema.properties.where, undefined);
            const nativeInput = await nativeStudentInput(actionName);
            const fullInput = await shared.request('tools/call', {
              name: toolContractToolName,
              arguments: { tool: tool.name, section: 'input' },
            });
            assert.equal(fullInput.error, undefined);
            assert.deepEqual(fullInput.result.structuredContent, {
              contractVersion: 1,
              tool: tool.name,
              section: 'input',
              schema: nativeInput,
            });
            const nativePredicate = resolveSchema(
              nativeInput.properties.where,
              nativeInput.$defs ?? {},
            );
            assert.deepEqual(
              binding.predicates,
              {
                anyOf: nativePredicate.anyOf.filter((branch: any) => branch.properties?.field),
              },
              'capability operands retain exact native generated leaf schemas',
            );
            const validator = fromJsonSchema(tool.inputSchema)['~standard'];
            const controls = actionName === 'select' ? {} : { aggrs: { count: ['*'] } };
            assert.equal(
              (
                await validator.validate({
                  ...controls,
                  where: {
                    or: [
                      { field: 'level', op: 'eq', value: 1 },
                      { field: 'level', op: 'eq', value: 2 },
                    ],
                  },
                })
              ).issues,
              undefined,
            );
            for (const where of [
              { or: [{ level: 1 }, { level: 2 }] },
              { field: 'level', op: 'in', value: [1, 2] },
            ]) {
              assert.equal(
                (await validator.validate({ ...controls, where })).issues,
                undefined,
                'compact SDK schema admits objects, not their native query semantics',
              );
              const rejected = await shared.request('tools/call', {
                name: tool.name,
                arguments: { ...controls, where },
              });
              assert.equal(rejected.error?.code, -32602);
              assert.equal(
                action.mock.callCount(),
                0,
                'invalid query semantics still precede dispatch',
              );
            }
          } else {
            assert.equal(tool.description, businessDescription, tool.name);
          }
          const document = JSON.parse(
            JSON.stringify(
              await app.bean.openapi.generateJsonOfControllerAction(controller, actionName, 'V31'),
            ),
          );
          const method = methods[actionName] ?? 'get';
          const operation = Object.values(document.paths ?? {})
            .map(path => (path as any)[method])
            .find(Boolean);
          assert.ok(operation?.summary, `${actionName} retains its HTTP OpenAPI summary`);
          assert.equal(
            operation.description,
            undefined,
            `${actionName} keeps its description MCP-only`,
          );
        }
        const { DtoStudentSelectReq, DtoStudentSelectResItem } =
          await import('vona-module-training-student');
        const nativeDocument = JSON.parse(
          JSON.stringify(
            await runWithZodQueryCoercion(false, () =>
              app.bean.openapi.generateJsonOfClasses(
                [DtoStudentSelectReq, DtoStudentSelectResItem],
                'V31',
              ),
            ),
          ),
        );
        const nativeSelect =
          nativeDocument.components.schemas[appResource.getBeanFullName(DtoStudentSelectReq)!];
        const nativeSelectItem =
          nativeDocument.components.schemas[appResource.getBeanFullName(DtoStudentSelectResItem)!];
        assert.ok(select);
        if (query) {
          const where = resolveSchema(
            select.inputSchema.properties.where,
            select.inputSchema.$defs ?? {},
          );
          const nativeWhere = resolveSchema(
            nativeSelect.properties.where,
            nativeDocument.components.schemas,
          );
          assert.notEqual(where.description, nativeWhere.description);
          assert.match(nativeWhere.description, /Recursive Boolean predicate/);
          assert.match(where.description, /cabloy_tool_contract/);
          const orders = resolveSchema(
            select.inputSchema.properties.orders,
            select.inputSchema.$defs ?? {},
          );
          assert.ok(!orders.description?.includes('Recursive Boolean predicate'));
        }
        assert.equal(select.annotations.readOnlyHint, true);
        assert.deepEqual(Object.keys(select.inputSchema.properties).sort(), [
          ...(!query ? ['columns'] : []),
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
        for (const level of query ? [1, 2, 3] : [0, 1, 1.5, 2, 3, 4]) {
          assert.equal((await selectCheck.validate({ level })).issues, undefined);
        }
        if (query) {
          const capabilityResponse = await shared.request('tools/call', {
            name: toolContractToolName,
            arguments: { tool: select.name, section: 'query' },
          });
          assert.equal(capabilityResponse.error, undefined);
          const capabilities =
            capabilityResponse.result.structuredContent.bindings[0].capabilities.query;
          assert.deepEqual(capabilities.defaults.orders, [
            { field: 'createdAt', direction: 'desc' },
          ]);
          assert.deepEqual(capabilities.projection, { mode: 'fixed' });
          assert.deepEqual(capabilities.fields.name.operators, ['eq', 'containsI', 'startsWith']);
          assert.deepEqual(capabilities.fields.id.operators, ['eq', 'in']);
          assert.equal(
            select.inputSchema.properties.id,
            undefined,
            'id stays outside named UI conveniences',
          );
          const idSchema = query.fields.id.schema;
          const publicId = idSchema.parse(idSchema.type === 'number' ? 123 : '123');
          for (const where of [
            { field: 'id', op: 'eq', value: publicId },
            { field: 'id', op: 'in', value: [publicId] },
          ]) {
            assert.equal((await selectCheck.validate({ where })).issues, undefined);
          }
          assert.ok((await selectCheck.validate({ id: publicId })).issues);
          assert.equal(select.inputSchema.properties.pageNo.minimum, 1);
          assert.equal(select.inputSchema.properties.pageSize.minimum, 1);
          assert.equal(
            select.inputSchema.properties.pageSize.maximum,
            capabilities.limits.maxPageSize,
          );
          assert.equal(select.inputSchema.properties.orders.type, 'array');
          const recursive = {
            where: {
              and: [
                { field: 'name', op: 'containsI', value: 'Student' },
                {
                  or: [
                    { field: 'level', op: 'eq', value: 2 },
                    { not: { field: 'level', op: 'gte', value: 3 } },
                  ],
                },
              ],
            },
            orders: [{ field: 'name', direction: 'asc' }],
          };
          assert.equal(
            select.inputSchema.$defs,
            undefined,
            'compact discovery drops unused recursive definitions',
          );
          assert.equal(JSON.stringify(select.inputSchema).includes('QueryPredicate'), false);
          assert.equal((await selectCheck.validate(recursive)).issues, undefined);
          const nativeInput = await nativeStudentInput();
          assert.ok(nativeInput.$defs, 'native runtime query remains fully recursive');
          const nativeCheck = fromJsonSchema(nativeInput)['~standard'];
          assert.equal((await nativeCheck.validate(recursive)).issues, undefined);
          for (const where of [
            { name: 'Student' },
            { field: 'mobile', op: 'eq', value: 'private' },
            { field: 'name', op: 'raw', value: 'select 1' },
            { field: 'level', op: 'eq', value: '2' },
            { and: [] },
            { field: 'level', op: 'eq', value: 2, injected: true },
          ]) {
            assert.equal(
              (await selectCheck.validate({ where })).issues,
              undefined,
              JSON.stringify(where),
            );
            assert.ok((await nativeCheck.validate({ where })).issues, JSON.stringify(where));
            const rejected = await shared.request('tools/call', {
              name: select.name,
              arguments: { where },
            });
            assert.equal(rejected.error?.code, -32602, JSON.stringify(where));
            assert.equal(
              action.mock.callCount(),
              0,
              'compact discovery never weakens runtime semantics',
            );
          }
        } else {
          // Legacy queryPage retains ORM controls/defaults and an unrestricted numeric level filter.
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
        }
        assert.deepEqual(Object.keys(select.outputSchema.properties).sort(), [
          'list',
          'pageCount',
          'pageNo',
          'pageSize',
          'total',
        ]);
        assert.equal(select.outputSchema.properties.total.type, 'string');
        assert.equal(select.outputSchema.properties.list.type, 'array');
        const compactItem = select.outputSchema.properties.list.items;
        assert.equal(compactItem.type, 'object');
        assert.equal(compactItem.additionalProperties, true);
        assert.equal(compactItem.properties, undefined);
        assert.equal(compactItem.$ref, undefined);
        assert.match(compactItem.description, /cabloy_tool_contract/);
        const selectOverview = await shared.request('tools/call', {
          name: toolContractToolName,
          arguments: { tool: select.name },
        });
        assert.equal(selectOverview.error, undefined);
        assert.deepEqual(selectOverview.result.structuredContent.output, {
          type: 'object',
          compactPaths: [['list', 'items']],
        });
        const selectOutput = await shared.request('tools/call', {
          name: toolContractToolName,
          arguments: { tool: select.name, section: 'output' },
        });
        assert.equal(selectOutput.error, undefined);
        const fullSelectOutput = selectOutput.result.structuredContent.schema;
        assert.deepEqual(selectOutput.result.structuredContent, {
          contractVersion: 1,
          tool: select.name,
          section: 'output',
          schema: fullSelectOutput,
        });
        assert.deepEqual(
          JSON.parse(selectOutput.result.content[0].text),
          selectOutput.result.structuredContent,
        );
        const selectItemRef = fullSelectOutput.properties.list.items.$ref;
        assert.equal(typeof selectItemRef, 'string');
        assert.ok(selectItemRef.startsWith('#/$defs/'));
        const selectItem = resolveSchema(
          fullSelectOutput.properties.list.items,
          fullSelectOutput.$defs,
        );
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
        assert.ok(selectItem.properties.level.title);
        assert.deepEqual(
          selectItem.properties.level,
          toolSchema(nativeSelectItem.properties.level, nativeDocument.components.schemas),
        );
        assert.deepEqual(
          select.inputSchema.properties.level,
          toolSchema(nativeSelect.properties.level, nativeDocument.components.schemas),
        );
        if (query) assert.ok(selectItem.properties.level.description);
        assert.equal(
          select.inputSchema.properties.level.description,
          selectItem.properties.level.description,
        );
        assert.equal(select.inputSchema.properties.level.title, selectItem.properties.level.title);
        assert.ok(nativeSelect.properties.level.rest.form.render);
        assert.equal(Object.hasOwn(select.inputSchema.properties.level, 'rest'), false);
        assert.equal(Object.hasOwn(selectItem.properties.level, 'rest'), false);
        assert.ok(!selectItem.required.includes('imageId'));
        for (const args of [
          ...(query ? [null, '1', 1.5, 0, 4] : [null, '1']).map(level => ({ level })),
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
            { code: rejected.error?.code, message: rejected.error?.message },
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
          resolveSchema(schema, create.inputSchema.$defs ?? {});
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
        for (const [schema, original] of [
          [recordCreate, component(DtoDetailRecordMutate)],
          [subjectCreate, component(DtoDetailRecordSubjectMutate)],
        ]) {
          assert.ok(original.rest?.blocks?.[0]?.render);
          assert.deepEqual(schema.rest?.blocks, original.rest.blocks);
        }
        const subjectsField = recordCreate.properties.trainingRecordSubjects;
        const subjectsOriginal = component(DtoDetailRecordMutate).properties.trainingRecordSubjects;
        assert.ok(subjectsField.title);
        assert.deepEqual(subjectsField.title, subjectsOriginal.title);
        assert.ok(subjectsOriginal.rest?.form?.render);
        assert.deepEqual(subjectsField.rest?.form, subjectsOriginal.rest.form);
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
          resolveSchema(schema, update.inputSchema.$defs ?? {});
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

  it('localizes all eight Student MCP descriptions independently of HTTP OpenAPI summaries', async () => {
    if (!app.meta.modules['training-student']) return;
    const { default: enUS } =
      await import('../../../../../suite/a-training/modules/training-student/src/config/locale/en-us.ts');
    const { default: zhCN } =
      await import('../../../../../suite/a-training/modules/training-student/src/config/locale/zh-cn.ts');
    const dictionaries = { 'en-us': enUS, 'zh-cn': zhCN };
    const query = await nativeStudentQuery();
    const descriptions = {
      create: { key: 'StudentCreateDescription', summary: 'StudentCreate', method: 'post' },
      select: { key: 'StudentSelectDescription', summary: 'StudentSelect', method: 'get' },
      group: { key: 'StudentGroupDescription', summary: 'StudentGroup', method: 'get' },
      aggregate: { key: 'StudentAggregateDescription', summary: 'StudentAggregate', method: 'get' },
      view: { key: 'StudentViewDescription', summary: 'StudentView', method: 'get' },
      update: { key: 'StudentUpdateDescription', summary: 'StudentUpdate', method: 'patch' },
      summary: { key: 'StudentSummaryDescription', summary: 'StudentSummary', method: 'get' },
      delete: { key: 'StudentDeleteDescription', summary: 'StudentDelete', method: 'delete' },
    } as const;
    await withStudentToolPermissions(async () => {
      const previousLocale = app.meta.locale.current;
      const controller = recordResourceNameToRoutePath['training-student:student'].controller;
      const snapshots: string[][] = [];
      try {
        for (const locale of ['en-us', 'zh-cn', 'en-us'] as const) {
          app.meta.locale.current = locale;
          const client = await connect(
            await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:all'),
          );
          try {
            const listed = JSON.parse(JSON.stringify(await client.request('tools/list')));
            assert.equal(listed.error, undefined);
            assert.deepEqual(
              studentTools(listed.result.tools)
                .map((tool: any) => tool.name)
                .sort(),
              studentToolNames.toSorted(),
            );
            const snapshot: string[] = [];
            for (const [actionName, { key, summary, method }] of Object.entries(descriptions)) {
              const name = `training-student_student_${actionName}`;
              const tool = listed.result.tools.find((tool: any) => tool.name === name);
              const document = JSON.parse(
                JSON.stringify(
                  await app.bean.openapi.generateJsonOfControllerAction(
                    controller,
                    actionName,
                    'V31',
                  ),
                ),
              );
              const operation = Object.values(document.paths ?? {})
                .map(path => (path as any)[method])
                .find(Boolean);
              if (query && ['select', 'group', 'aggregate'].includes(actionName)) {
                assert.ok(tool.description.startsWith(`${dictionaries[locale][key]}\n\n`));
                assert.match(tool.description, /prefer a single call using where\.or/);
              } else {
                assert.equal(tool.description, dictionaries[locale][key], `${locale}: ${name}`);
              }
              assert.ok(operation, `${locale}: ${name} retains its HTTP operation`);
              assert.equal(operation.summary, dictionaries[locale][summary], `${locale}: ${name}`);
              assert.equal(operation.description, undefined, `${locale}: ${name}`);
              assert.notEqual(enUS[key], zhCN[key], `${key} has a Chinese translation`);
              snapshot.push(tool.description);
            }
            snapshots.push(snapshot);
          } finally {
            await client.close();
          }
        }
        assert.notDeepEqual(snapshots[0], snapshots[1]);
        assert.deepEqual(
          snapshots[2],
          snapshots[0],
          'returning to English reuses the correct locale',
        );
      } finally {
        app.meta.locale.current = previousLocale;
      }
    });
  });

  it('normalizes declared JSON dates before native request binding without broad coercion', async t => {
    if (!app.meta.modules['training-student']) return;
    await withStudentToolPermissions(async () => {
      const server = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:all'),
      );
      const action = mockOwnedPerformAction(
        t,
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
          name: 'training-student_student_create',
          arguments: body,
        });
        assert.equal(valid.error, undefined);
        assert.deepEqual(valid.result.structuredContent, { result: 'date-normalized' });
        assert.equal(action.mock.callCount(), 1);
        const invalid = await server.request('tools/call', {
          name: 'training-student_student_create',
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
      const read = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:read'),
      );
      const all = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:all'),
      );
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
      const action = mockOwnedPerformAction(
        t,
        async (..._args: Parameters<typeof app.bean.executor.performAction>) => identity,
      );
      try {
        const listed = await read.request('tools/list');
        assert.equal(listed.error, undefined);
        assert.deepEqual(
          studentTools(listed.result.tools)
            .map((tool: any) => tool.name)
            .sort(),
          studentToolNames
            .filter(
              name =>
                ![
                  'training-student_student_create',
                  'training-student_student_update',
                  'training-student_student_delete',
                ].includes(name),
            )
            .toSorted(),
        );
        assert.equal(action.mock.callCount(), 0, 'discovery never trial-creates');
        const denied = await read.request('tools/call', {
          name: 'training-student_student_create',
          arguments: body,
        });
        assert.deepEqual(denied.error, { code: -32602, message: 'Tool unavailable' });
        assert.equal(
          action.mock.callCount(),
          0,
          'read scope rejects the known name before dispatch',
        );
        const call = () =>
          all.request('tools/call', { name: 'training-student_student_create', arguments: body });
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
      const read = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:read'),
      );
      const all = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:all'),
      );
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
      const action = mockOwnedPerformAction(
        t,
        async (..._args: Parameters<typeof app.bean.executor.performAction>) => null,
      );
      try {
        const listed = await read.request('tools/list');
        assert.equal(listed.error, undefined);
        assert.deepEqual(
          studentTools(listed.result.tools)
            .map((tool: any) => tool.name)
            .sort(),
          studentToolNames
            .filter(
              name =>
                ![
                  'training-student_student_create',
                  'training-student_student_update',
                  'training-student_student_delete',
                ].includes(name),
            )
            .toSorted(),
        );
        assert.equal(action.mock.callCount(), 0, 'discovery never trial-updates');
        const denied = await read.request('tools/call', {
          name: 'training-student_student_update',
          arguments: args,
        });
        assert.deepEqual(denied.error, { code: -32602, message: 'Tool unavailable' });
        assert.equal(action.mock.callCount(), 0, 'read scope rejects known update before dispatch');
        const unknown = await all.request('tools/call', {
          name: 'training-student_student_update_unknown',
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
            name: 'training-student_student_update',
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
          all.request('tools/call', { name: 'training-student_student_update', arguments: args });
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
      const read = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:read'),
      );
      const all = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:all'),
      );
      const params = { id: '123' };
      // Binding/output only; businessHttp owns persisted aggregate deletion and executor null proof.
      const action = mockOwnedPerformAction(
        t,
        async (..._args: Parameters<typeof app.bean.executor.performAction>) => null,
      );
      try {
        const listed = await all.request('tools/list');
        assert.equal(listed.error, undefined);
        const tool = listed.result.tools.find(
          (tool: any) => tool.name === 'training-student_student_delete',
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
          studentTools(readTools.result.tools)
            .map((tool: any) => tool.name)
            .sort(),
          studentToolNames
            .filter(
              name =>
                ![
                  'training-student_student_create',
                  'training-student_student_update',
                  'training-student_student_delete',
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
          'training-student_student_delete_unknown',
          'training-student_student_deleteForce',
          'training-student_student_deleteBulk',
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

  it('scopes tool contract sections to exact currently authorized Actions without catalog entries or dispatch', async t => {
    if (!app.meta.modules['training-student'] || !(await nativeStudentQuery())) return;
    await withStudentToolPermissions(async () => {
      const sharedServer = await createSharedBusinessToolServer(
        app,
        `${getMcpIssuer(app)}/admin`,
        'mcp:read',
      );
      const clients: Awaited<ReturnType<typeof connect>>[] = [];
      const action = mockOwnedPerformAction(t, async () => {
        assert.fail('query capability discovery must never dispatch an Action');
      });
      const passport = app.bean.passport.current;
      try {
        const shared = await connect(sharedServer);
        clients.push(shared);
        const listed = await shared.request('tools/list');
        assert.equal(listed.error, undefined);
        const builtin = listed.result.tools.filter(
          (tool: any) => tool.name === toolContractToolName,
        );
        assert.equal(builtin.length, 1);
        assert.deepEqual(Object.keys(builtin[0].inputSchema.properties), ['tool', 'section']);
        assert.deepEqual(builtin[0].inputSchema.properties.section.enum, [
          'overview',
          'input',
          'output',
          'query',
        ]);
        assert.ok(
          !builtin[0].inputSchema.required.includes('section'),
          'section is optional and defaults at dispatch',
        );
        assert.deepEqual(builtin[0].inputSchema.required, ['tool']);
        assert.equal(builtin[0].inputSchema.additionalProperties, false);
        assert.equal(builtin[0].annotations.readOnlyHint, true);
        const catalog = await sharedServer.catalog();
        assert.equal(
          catalog.some(item => item.name === toolContractToolName),
          false,
          'the built-in is not an Action and cannot enter the consent catalog',
        );
        const select = catalog.find(item => item.name === 'training-student_student_select');
        assert.ok(select);
        const scope = 'mcp:custom:Query_capabilities_fixture' as const;
        const exact = await connect(
          await createControllerToolServer(app, scope, {
            ssrSiteId: 'admin',
            toolAccess: [select],
          }),
        );
        const rebound = await connect(
          await createControllerToolServer(app, scope, {
            ssrSiteId: 'admin',
            toolAccess: [{ ...select, action: 'summary' }],
          }),
        );
        const noQuery = await connect(
          await createControllerToolServer(app, scope, {
            ssrSiteId: 'admin',
            toolAccess: catalog.filter(item => item.name === statusToolName),
          }),
        );
        clients.push(exact, rebound, noQuery);
        assert.deepEqual(
          (await exact.request('tools/list')).result.tools.map((tool: any) => tool.name),
          [select.name, toolContractToolName],
        );
        assert.deepEqual((await rebound.request('tools/list')).result.tools, []);
        assert.deepEqual(
          (await noQuery.request('tools/list')).result.tools.map((tool: any) => tool.name),
          [statusToolName, toolContractToolName],
        );
        const lookup = (client: typeof shared, tool: string, section = 'query') =>
          client.request('tools/call', {
            name: toolContractToolName,
            arguments: { tool, section },
          });
        const overview = await lookup(exact, select.name, 'overview');
        assert.equal(overview.error, undefined);
        assert.deepEqual(overview.result.structuredContent, {
          contractVersion: 1,
          tool: select.name,
          readOnly: true,
          sections: ['overview', 'input', 'output', 'query'],
          input: { type: 'object', compactPaths: [['where']] },
          output: { type: 'object', compactPaths: [['list', 'items']] },
        });
        assert.doesNotMatch(
          JSON.stringify(overview.result.structuredContent),
          /"(?:schema|properties|\$defs)":/,
        );
        const accepted = await lookup(exact, select.name);
        assert.equal(accepted.error, undefined);
        const content = accepted.result.structuredContent;
        assert.deepEqual(Object.keys(content).sort(), ['bindings', 'grammarVersion', 'tool']);
        assert.equal(content.grammarVersion, 1);
        assert.equal(content.tool, select.name);
        assert.equal(content.bindings.length, 1);
        assert.deepEqual(content.bindings[0].argumentPath, []);
        assert.equal(content.bindings[0].mode, 'select');
        assert.deepEqual(JSON.parse(accepted.result.content[0].text), content);
        for (const section of ['overview', 'input', 'output', 'query']) {
          for (const [client, target] of [
            [rebound, select.name],
            [noQuery, select.name],
            [exact, 'training-student_student_group'],
          ] as const) {
            assert.deepEqual((await lookup(client, target, section)).error, {
              code: -32602,
              message: 'Tool unavailable',
            });
          }
        }
        const nonqueryOverview = await lookup(noQuery, statusToolName, 'overview');
        assert.equal(nonqueryOverview.error, undefined);
        assert.deepEqual(nonqueryOverview.result.structuredContent.sections, [
          'overview',
          'input',
          'output',
        ]);
        for (const [client, target] of [
          [rebound, select.name],
          [noQuery, select.name],
          [exact, 'training-student_student_group'],
          [shared, toolContractToolName],
          [shared, statusToolName],
          [shared, `client_${select.name}`],
          [shared, 'unknown_query_tool'],
        ] as const) {
          assert.deepEqual(
            (await lookup(client, target)).error,
            { code: -32602, message: 'Tool unavailable' },
            target,
          );
        }
        for (const args of [
          undefined,
          {},
          { tool: 1 },
          { tool: '' },
          { tool: `namespace.${select.name}` },
          { tool: select.name, extra: true },
          { tool: select.name, where: {} },
          ...[null, '', 'full', 'QUERY', 1, [], {}].map(section => ({
            tool: select.name,
            section,
          })),
          { tool: select.name, section: 'output', extra: true },
        ]) {
          const invalid = await shared.request('tools/call', {
            name: toolContractToolName,
            arguments: args,
          });
          assert.deepEqual(invalid.error, { code: -32602, message: 'Invalid tool arguments' });
        }
        await app.bean.passport.setCurrent(undefined);
        for (const client of [shared, exact]) {
          const after = await client.request('tools/list');
          assert.equal(after.error, undefined);
          assert.equal(
            after.result.tools.some((tool: any) => tool.name === select.name),
            false,
          );
          if (client === exact) assert.deepEqual(after.result.tools, []);
          for (const section of ['overview', 'input', 'output', 'query']) {
            assert.deepEqual(
              (await lookup(client, select.name, section)).error,
              { code: -32602, message: 'Tool unavailable' },
              'the same server rechecks fresh target guards for every contract section',
            );
          }
        }
        assert.equal(action.mock.callCount(), 0);
      } finally {
        await app.bean.passport.setCurrent(passport);
        action.mock.restore();
        for (const client of clients) await client.close();
      }
    });
  });

  it('bounds native query semantics before recursive SDK validation and exposes only safe query diagnostics', async t => {
    if (!app.meta.modules['training-student']) return;
    const query = await nativeStudentQuery();
    if (!query) {
      t.skip('the native Student DTO uses legacy filters, not the public query AST');
      return;
    }
    const { PublicQueryError } = orm as Record<string, any>;
    assert.equal(typeof PublicQueryError, 'function');
    await withStudentToolPermissions(async () => {
      const client = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:read'),
      );
      const action = mockOwnedPerformAction(t, async () => {
        assert.fail('invalid public query must not dispatch an Action');
      });
      try {
        const listed = await client.request('tools/list');
        const tool = listed.result.tools.find(
          (item: any) => item.name === 'training-student_student_select',
        );
        const limits = query.limits;
        const call = (arguments_: Record<string, unknown>) =>
          client.request('tools/call', {
            name: tool.name,
            arguments: arguments_,
          });
        let deep: unknown = { field: 'level', op: 'eq', value: 2 };
        for (let i = 0; i < 1000; i++) deep = { not: deep };
        const excessive = await call({ where: deep });
        assert.equal(excessive.error?.code, -32602);
        assert.equal(excessive.error?.data?.queryCode, 'query_complexity');
        assert.equal(typeof excessive.error?.data?.path, 'string');
        const long = await call({
          where: { field: 'name', op: 'eq', value: 'x'.repeat(limits.maxStringLength + 1) },
        });
        assert.deepEqual(long.error, {
          code: -32602,
          message: 'Invalid tool arguments',
          data: { queryCode: 'query_string_length', path: 'where.value', hint: queryRepairHint },
        });
        const invalid = await call({ where: { field: 'name', op: 'raw', value: 'private SQL' } });
        assert.equal(invalid.error?.code, -32602);
        assert.equal(invalid.error?.data?.queryCode, 'query_invalid');
        assert.equal(JSON.stringify(invalid).includes('private SQL'), false);
        const duplicate = await call({
          orders: [
            { field: 'name', direction: 'asc' },
            { field: 'name', direction: 'desc' },
          ],
        });
        assert.deepEqual(duplicate.error, {
          code: -32602,
          message: 'Invalid tool arguments',
          data: { queryCode: 'query_duplicate_order', path: 'orders', hint: queryRepairHint },
        });
        assert.equal(action.mock.callCount(), 0, 'budget and semantic failures precede dispatch');
        action.mock.mockImplementation(async () => {
          throw new PublicQueryError('query_invalid', 'where');
        });
        const native = await call({});
        assert.deepEqual(native.error, {
          code: -32602,
          message: 'Invalid tool arguments',
          data: { queryCode: 'query_invalid', path: 'where', hint: queryRepairHint },
        });
        for (const error of [
          new Error('private DB schema and statement'),
          Object.assign(new Error('private action details'), {
            status: 422,
            code: 422,
            queryCode: 'forged',
            path: 'private',
            hint: 'private repair instructions',
          }),
        ]) {
          action.mock.mockImplementation(async () => {
            throw error;
          });
          const opaque = await call({});
          assert.equal(opaque.error, undefined);
          assert.deepEqual(opaque.result, {
            isError: true,
            content: [{ type: 'text', text: 'Action failed' }],
          });
        }
      } finally {
        action.mock.restore();
        await client.close();
      }
    });
  });

  it('traces separate calls and OR structure without operands, results or errors', async t => {
    if (!app.meta.modules['training-student']) return;
    const query = await nativeStudentQuery();
    if (!query) return;
    await withStudentToolPermissions(async () => {
      const client = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:all'),
      );
      const context = app.ctx;
      const logger = app.bean.logger.default;
      const originalDebug = logger.debug;
      const events: { event: string; data: any }[] = [];
      const logging = t.mock.fn(function (...args: any[]) {
        if (app.ctx === context && String(args[0]).startsWith('mcp.tool.call ')) {
          events.push({ event: args[0], data: args[1] });
          return logger;
        }
        return originalDebug.apply(logger, args as any);
      });
      // Logger facades have no method descriptors. Intercept default-client lookup
      // only in this owned context; BeanLogger still owns protected suppression.
      const children: string[] = [];
      const observedLogger = new Proxy(logger, {
        get(target, key) {
          if (key === 'debug') return logging;
          if (key === 'child') {
            return (metadata: { name: string }) => {
              if (metadata.name !== 'mcp') return target.child(metadata);
              children.push(metadata.name);
              return observedLogger;
            };
          }
          return Reflect.get(target, key, target);
        },
      });
      const originalGet = app.meta.logger.get;
      const lookup = t.mock.method(app.meta.logger, 'get', function (clientName) {
        if (app.ctx === context && (!clientName || clientName === 'default')) {
          return observedLogger;
        }
        return originalGet.call(app.meta.logger, clientName);
      });
      const raw = { list: [], total: '0', pageNo: 1, pageSize: 20, pageCount: 0 };
      const secret = 'mcp-diagnostic-private-canary';
      const action = mockOwnedPerformAction(t, async () => raw);
      const call = (args: Record<string, unknown>, name = 'training-student_student_select') =>
        client.request('tools/call', { name, arguments: args });
      try {
        for (const level of [1, 2]) {
          const response = await call({ level });
          assert.deepEqual(response.result.structuredContent, raw);
        }
        const args = {
          name: secret,
          where: {
            or: [
              { field: 'level', op: 'eq', value: 1 },
              { field: 'level', op: 'eq', value: 2 },
            ],
          },
        };
        const response = await call(args);
        assert.deepEqual(response.result.structuredContent, raw);
        assert.equal(action.mock.callCount(), 3);
        assert.deepEqual(action.mock.calls.at(-1)!.arguments, [
          'get',
          '/training/student',
          { query: args, innerAccess: false },
        ]);
        const dispatches = events.filter(item => item.event === 'mcp.tool.call dispatch');
        assert.deepEqual(
          dispatches.map(item => item.data.queries),
          [
            [{ namedFilters: ['level'] }],
            [{ namedFilters: ['level'] }],
            [
              {
                namedFilters: ['name'],
                where: {
                  or: [
                    { field: 'level', op: 'eq' },
                    { field: 'level', op: 'eq' },
                  ],
                },
              },
            ],
          ],
        );
        assert.deepEqual(children, Array.from({ length: events.length }).fill('mcp'));
        const received = events.filter(item => item.event === 'mcp.tool.call received');
        assert.equal(new Set(received.map(item => item.data.callId)).size, 3);
        for (const { data } of received) {
          assert.match(data.callId, /^[0-9a-f-]{36}$/);
          const lifecycle = events.filter(item => item.data.callId === data.callId);
          assert.deepEqual(
            lifecycle.map(item => item.event),
            ['mcp.tool.call received', 'mcp.tool.call dispatch', 'mcp.tool.call settled'],
          );
          assert.equal(lifecycle[2].data.outcome, 'success');
          assert.ok(Number.isFinite(lifecycle[2].data.durationMs));
          assert.ok(lifecycle[2].data.durationMs >= 0);
        }
        const invalid = await call({ where: { field: 'level', op: 'in', value: [1, 2] } });
        assert.equal(invalid.error.code, -32602);
        assert.equal(events.at(-1)!.data.outcome, 'invalid_arguments');
        const unknown = await call({}, secret);
        assert.equal(unknown.error.code, -32602);
        assert.equal(events.at(-1)!.data.outcome, 'unavailable');
        assert.equal(events.at(-1)!.data.tool, 'unavailable');
        const extra = await call({ [secret]: secret });
        assert.equal(extra.error.code, -32602);
        assert.equal(action.mock.callCount(), 3);
        action.mock.mockImplementation(async () => {
          throw new Error(secret);
        });
        const failed = await call({ name: secret });
        assert.equal(failed.result.isError, true);
        assert.equal(events.at(-1)!.data.outcome, 'action_failed');
        action.mock.mockImplementation(async () => undefined);
        const missing = await call({ id: '123' }, 'training-student_student_view');
        assert.equal(missing.result.isError, true);
        assert.equal(events.at(-1)!.data.outcome, 'resource_not_found');
        action.mock.mockImplementation(async () => ({ ...raw, list: secret }));
        const badOutput = await call({});
        assert.equal(badOutput.result.isError, true);
        assert.equal(events.at(-1)!.data.outcome, 'action_failed');
        assert.equal(JSON.stringify(events).includes(secret), false);
        assert.equal(JSON.stringify(events).includes('value'), false);
        assert.equal(JSON.stringify(events).includes('total'), false);
        assert.equal(JSON.stringify(events).includes('structuredContent'), false);

        const bounded = summarizeToolQueries([
          {
            policy: query,
            namedFilters: ['name'],
            value: {
              name: secret,
              where: {
                or: Array.from({ length: 80 }).fill({
                  field: 'name',
                  op: 'eq',
                  value: secret,
                }),
              },
            },
          },
        ]);
        assert.equal(bounded.truncated, true);
        assert.ok(JSON.stringify(bounded).length <= 4096);
        assert.equal(JSON.stringify(bounded).includes(secret), false);

        const before = events.length;
        runWithRequestBoundary(createRequestBoundary(), () => {
          recordToolCall(app, beginToolCall('training-student_student_select'), 'received');
        });
        assert.equal(events.length, before);
        action.mock.mockImplementation(async () => raw);
        logging.mock.mockImplementation(function (...args: any[]) {
          if (app.ctx === context && String(args[0]).startsWith('mcp.tool.call ')) {
            throw new Error(secret);
          }
          return originalDebug.apply(logger, args as any);
        });
        const observedFailure = await call({ level: 1 });
        assert.deepEqual(observedFailure.result.structuredContent, raw);
      } finally {
        action.mock.restore();
        lookup.mock.restore();
        await client.close();
      }
    });
  });

  it('binds the native select query and leaves public AST policy defaults to the native filter', async t => {
    if (!app.meta.modules['training-student']) return;
    const query = await nativeStudentQuery();
    await withStudentToolPermissions(async () => {
      const client = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:read'),
      );
      const ormQuery = app.util.getModuleConfigRaw('a-orm')?.rest?.query;
      const defaults = query
        ? {}
        : {
            orders: ormQuery?.orders?.default ?? 'createdAt,desc',
            pageNo: 1,
            pageSize: ormQuery?.pageSize?.default ?? 20,
          };
      const raw = {
        list: [],
        total: '0',
        pageNo: 1,
        pageSize: query ? 20 : (ormQuery?.pageSize?.default ?? 20),
        pageCount: 0,
      };
      // Binding and output parsing only; businessHttp covers real persisted rows and mobile masking.
      const action = mockOwnedPerformAction(
        t,
        async (..._args: Parameters<typeof app.bean.executor.performAction>) => raw,
      );
      try {
        const call = (args?: Record<string, unknown>) =>
          client.request('tools/call', {
            name: 'training-student_student_select',
            arguments: args,
          });
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
        const idSchema = query?.fields.id.schema;
        const publicId = idSchema?.parse(idSchema.type === 'number' ? 123 : '123');
        const filters = query
          ? {
              name: '  Student  ',
              level: 2,
              where: {
                and: [
                  { field: 'name', op: 'containsI', value: 'Student' },
                  { field: 'id', op: 'in', value: [publicId] },
                  {
                    or: [
                      { field: 'level', op: 'eq', value: 2 },
                      { field: 'level', op: 'gte', value: 3 },
                    ],
                  },
                ],
              },
              orders: [{ field: 'name', direction: 'asc' }],
              pageNo: 2,
              pageSize: 1,
            }
          : {
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
          { query: { ...defaults, ...filters }, innerAccess: false },
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
      const query = await nativeStudentQuery();
      const server = await createSharedBusinessToolServer(
        app,
        `${getMcpIssuer(app)}/admin`,
        'mcp:read',
      );
      const client = await connect(server);
      const ormQuery = app.util.getModuleConfigRaw('a-orm')?.rest?.query;
      const defaults = query
        ? {}
        : {
            orders: ormQuery?.orders?.default ?? 'createdAt,desc',
            pageNo: 1,
            pageSize: ormQuery?.pageSize?.default ?? 20,
          };
      let raw: unknown;
      const action = mockOwnedPerformAction(
        t,
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
          const name = `training-student_student_${mode}`;
          const tool = listed.result.tools.find((item: any) => item.name === name);
          assert.ok(tool, `${name} is discoverable with read scope`);
          assert.equal(tool.annotations.readOnlyHint, true);
          assert.equal(tool.annotations.destructiveHint, false);
          assert.equal(tool.inputSchema.additionalProperties, false);
          assert.deepEqual(Object.keys(tool.inputSchema.properties).sort(), [
            'aggrs',
            ...(!query ? ['columns'] : []),
            'createdAt',
            ...(mode === 'group' ? ['groups'] : []),
            'level',
            'name',
            ...(!query ? ['orders', 'pageNo', 'pageSize'] : []),
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
            where: query ? { field: 'level', op: 'gte', value: 2 } : { level: { _gte_: 2 } },
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
          // Legacy filters deliberately accept numeric values outside the stored level enum.
          if (!query) {
            for (const level of [1.5, 4]) {
              const numericFilter = await call({ ...filters, level });
              assert.equal(numericFilter.error, undefined);
              assert.notEqual(numericFilter.result.isError, true);
              assert.deepEqual(action.mock.calls.at(-1)!.arguments, [
                'get',
                `/training/student/${mode}`,
                { query: { ...defaults, ...filters, level }, innerAccess: false },
              ]);
            }
          }
          const calls = action.mock.callCount();
          for (const args of [
            { groups: ['mobile'] },
            ...(mode === 'aggregate' ? [{ groups: ['level'] }] : []),
            { aggrs: { count: ['mobile'] } },
            { aggrs: { sum: ['level'] } },
            { aggrs: {} },
            { aggrs: '{"count":["*"]}' },
            ...(query ? [{ level: 1.5 }, { level: 4 }] : [{ level: null }, { level: '2' }]),
            { iid: 'injected' },
            { innerAccess: true },
          ]) {
            const rejected = await call(args);
            assert.deepEqual(
              { code: rejected.error?.code, message: rejected.error?.message },
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
      const client = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:read'),
      );
      const raw = {
        id: '123',
        createdAt: new Date('2026-03-10T08:00:00.000Z'),
        updatedAt: new Date('2026-03-10T08:00:00.000Z'),
        deleted: false,
        iid: 0,
        ...(studentActionIsScoped('view')
          ? {
              departmentId: null,
              userIdOwner: String(app.bean.passport.currentUser!.id),
            }
          : {}),
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
      const action = mockOwnedPerformAction(
        t,
        async (..._args: Parameters<typeof app.bean.executor.performAction>) => raw,
      );
      try {
        const call = () =>
          client.request('tools/call', {
            name: 'training-student_student_view',
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
      const action = mockOwnedPerformAction(t, async () => {
        assert.fail('retired tool calls must not dispatch business Actions');
      });
      try {
        clients.push(await connect(await createBusinessToolServer(app)));
        for (const scope of ['mcp:read', 'mcp:all'] as const) {
          clients.push(
            await connect(
              await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, scope),
            ),
          );
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

  it('discovers nonquery contracts through native guards and retrieves full grouped mutation input without dispatch', async t => {
    await app.bean.executor.mockCtx(async () => {
      const permission = app.ctx.bean.permission;
      const original = permission.checkPermissionControllerActionGuards;
      let denied = false;
      const guards = t.mock.method(
        permission,
        'checkPermissionControllerActionGuards',
        async function (this: typeof permission, ...args: Parameters<typeof original>) {
          assert.equal(args[0], ControllerToolFixture);
          assert.equal(args[1], 'effect');
          return !denied && (await original.apply(this, args));
        },
      );
      const action = mockOwnedPerformAction(t, async () => {
        assert.fail('contract listing and lookup must not dispatch Actions');
      });
      const includeTool = (identity: { controller: string; action: string }) =>
        identity.controller === 'test-mcp.controller.toolFixture' && identity.action === 'effect';
      const server = await createControllerToolServer(app, 'mcp:all', {
        ssrSiteId: 'web',
        includeTool,
      });
      const all = await connect(server);
      const read = await connect(
        await createControllerToolServer(app, 'mcp:read', { ssrSiteId: 'web', includeTool }),
      );
      const lookup = (section?: string, tool = effectToolName) =>
        all.request('tools/call', {
          name: toolContractToolName,
          arguments: { tool, ...(section === undefined ? {} : { section }) },
        });
      try {
        const listed = await all.request('tools/list');
        assert.equal(listed.error, undefined);
        assert.deepEqual(
          listed.result.tools.map((tool: any) => tool.name),
          [effectToolName, toolContractToolName],
        );
        assert.ok(guards.mock.callCount() > 0, 'nonquery discovery falls back to the native guard');
        assert.deepEqual(
          (await read.request('tools/list')).result.tools,
          [],
          'scope-hidden Actions do not expose the helper',
        );
        const effect = listed.result.tools[0];
        const snapshot = JSON.stringify(effect);
        assert.equal(effect.inputSchema.properties.body.type, 'object');
        assert.equal(effect.inputSchema.properties.body.additionalProperties, true);
        assert.equal(effect.inputSchema.properties.body.properties, undefined);
        const overview = await lookup();
        assert.equal(overview.error, undefined);
        assert.deepEqual(overview.result.structuredContent, {
          contractVersion: 1,
          tool: effectToolName,
          readOnly: false,
          sections: ['overview', 'input', 'output'],
          input: { type: 'object', compactPaths: [['body']] },
          output: { type: 'object', compactPaths: [] },
        });
        assert.deepEqual(
          JSON.parse(overview.result.content[0].text),
          overview.result.structuredContent,
        );
        assert.deepEqual(
          (await lookup('overview')).result,
          overview.result,
          'overview is the default section',
        );
        assert.doesNotMatch(
          JSON.stringify(overview.result.structuredContent),
          /"(?:schema|properties|\$defs)":/,
        );
        const input = await lookup('input');
        assert.equal(input.error, undefined);
        const schema = input.result.structuredContent.schema;
        assert.deepEqual(input.result.structuredContent, {
          contractVersion: 1,
          tool: effectToolName,
          section: 'input',
          schema,
        });
        assert.deepEqual(Object.keys(schema.properties).sort(), ['body', 'params']);
        assert.deepEqual(schema.required.toSorted(), ['body', 'params']);
        assert.equal(schema.additionalProperties, false);
        const body = resolveSchema(schema.properties.body, schema.$defs ?? {});
        assert.equal(body.additionalProperties, false);
        assert.equal(body.properties.amount.type, 'integer');
        assert.equal(body.properties.amount.minimum, 1);
        assert.equal(body.properties.amount.maximum, 3);
        assert.equal(body.properties.priority.type, 'integer');
        assert.deepEqual(body.properties.note.type, ['string', 'null']);
        assert.ok(!body.required.includes('priority'));
        assert.ok(!body.required.includes('note'));
        const args = { params: { label: 'contract-only' }, body: { amount: 2 } };
        const fullCheck = fromJsonSchema(schema)['~standard'];
        const compactCheck = fromJsonSchema(effect.inputSchema)['~standard'];
        assert.equal((await fullCheck.validate(args)).issues, undefined);
        for (const body of [
          { amount: 4 },
          { amount: 2, priority: null },
          { amount: 2, private: true },
        ]) {
          const invalid = { ...args, body };
          assert.equal(
            (await compactCheck.validate(invalid)).issues,
            undefined,
            'compact discovery intentionally leaves the body open',
          );
          assert.ok(
            (await fullCheck.validate(invalid)).issues,
            'full contract retains mutation constraints',
          );
          const rejected = await all.request('tools/call', {
            name: effectToolName,
            arguments: invalid,
          });
          assert.deepEqual(rejected.error, { code: -32602, message: 'Invalid tool arguments' });
        }
        const output = await lookup('output');
        assert.equal(output.error, undefined);
        assert.deepEqual(output.result.structuredContent, {
          contractVersion: 1,
          tool: effectToolName,
          section: 'output',
          schema: effect.outputSchema,
        });
        assert.deepEqual(
          (await lookup('query')).error,
          { code: -32602, message: 'Tool unavailable' },
          'nonquery Actions have no query section',
        );
        const catalog = await server.catalog();
        assert.deepEqual(
          catalog.map(item => item.name),
          [effectToolName],
          'helper never enters Action consent catalog',
        );
        const guardsBeforeLookup = guards.mock.callCount();
        await lookup('input');
        assert.ok(
          guards.mock.callCount() > guardsBeforeLookup,
          'each lookup rechecks the native target guard',
        );
        for (const arguments_ of [
          undefined,
          {},
          { tool: effectToolName, section: null },
          { tool: effectToolName, section: 'all' },
          { tool: effectToolName, section: 1 },
          { tool: effectToolName, section: 'input', extra: true },
        ]) {
          const invalid = await all.request('tools/call', {
            name: toolContractToolName,
            arguments: arguments_,
          });
          assert.deepEqual(invalid.error, { code: -32602, message: 'Invalid tool arguments' });
        }
        for (const arguments_ of [
          { tool: effectToolName },
          { tool: effectToolName, section: 'query' },
        ]) {
          const retired = await all.request('tools/call', {
            name: retiredQueryCapabilitiesToolName,
            arguments: arguments_,
          });
          assert.deepEqual(
            retired.error,
            { code: -32602, message: 'Tool unavailable' },
            'old helper is not an alias',
          );
        }
        assert.equal(
          JSON.stringify(effect),
          snapshot,
          'full lookups do not mutate compact discovery',
        );
        denied = true;
        assert.deepEqual(
          (await all.request('tools/list')).result.tools,
          [],
          'helper disappears with the last guarded Action',
        );
        assert.deepEqual(await server.catalog(), []);
        for (const section of ['overview', 'input', 'output', 'query']) {
          assert.deepEqual(
            (await lookup(section)).error,
            { code: -32602, message: 'Tool unavailable' },
            section,
          );
        }
        assert.equal(action.mock.callCount(), 0);
      } finally {
        action.mock.restore();
        guards.mock.restore();
        await read.close();
        await all.close();
      }
    });
  });

  it('requires an explicit authorization scope and blocks write tools before ordinary Action dispatch', async () => {
    await app.bean.executor.mockCtx(async () => {
      await assert.rejects(
        () => createControllerToolServer(app, undefined, { ssrSiteId: 'web' }),
        /MCP authorization scope required/,
      );
      const initial = toolFixtureState.count;
      const read = await connect(
        await createControllerToolServer(app, 'mcp:read', { ssrSiteId: 'web' }),
      );
      const all = await connect(
        await createControllerToolServer(app, 'mcp:all', { ssrSiteId: 'web' }),
      );
      try {
        const readTools = (await read.request('tools/list')).result.tools;
        const allTools = (await all.request('tools/list')).result.tools;
        for (const [client, tools] of [
          [read, readTools],
          [all, allTools],
        ] as const) {
          assert.equal(
            tools.some((tool: any) => tool.name === 'cabloy_logout'),
            false,
            'a scope alone does not supply authenticated logout',
          );
          const logout = await client.request('tools/call', { name: 'cabloy_logout' });
          assert.deepEqual(logout.error, { code: -32602, message: 'Tool unavailable' });
        }
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
        assert.equal(effect.inputSchema.properties.body.type, 'object');
        assert.equal(effect.inputSchema.properties.body.additionalProperties, true);
        assert.equal(effect.inputSchema.properties.body.properties, undefined);
        const fullInput = await all.request('tools/call', {
          name: toolContractToolName,
          arguments: { tool: effectToolName, section: 'input' },
        });
        assert.equal(fullInput.error, undefined);
        const fullSchema = fullInput.result.structuredContent.schema;
        const body = resolveSchema(fullSchema.properties.body, fullSchema.$defs ?? {});
        assert.equal(body.properties.priority.type, 'integer');
        assert.deepEqual(body.properties.note.type, ['string', 'null']);
        assert.ok(!body.required.includes('priority'));
        assert.ok(!body.required.includes('note'));
        assert.equal(effect.outputSchema.properties.priority.type, 'integer');
        assert.deepEqual(effect.outputSchema.properties.note.type, ['string', 'null']);
        const inputCheck = fromJsonSchema(fullSchema)['~standard'];
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
          name: 'test-mcp_toolFixture_closed',
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

  it('matches custom scope tools by exact compiled name and Action identity for discovery and calls', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = 'mcp:custom:Exact_action-status' as const;
      await assert.rejects(
        () => createControllerToolServer(app, scope, { ssrSiteId: 'web' }),
        /MCP authorization scope required/,
      );
      const catalogServer = await createControllerToolServer(app, 'mcp:all', { ssrSiteId: 'web' });
      let catalog;
      try {
        catalog = await catalogServer.catalog();
      } finally {
        await catalogServer.close();
      }
      const status = catalog.find(item => item.name === statusToolName);
      assert.ok(status);
      assert.equal(status.readOnly, true);
      assert.ok(status.description);
      const exact = await connect(
        await createControllerToolServer(app, scope, { ssrSiteId: 'web', toolAccess: [status] }),
      );
      const rebound = await connect(
        await createControllerToolServer(app, scope, {
          ssrSiteId: 'web',
          toolAccess: [{ ...status, action: `${status.action}Other` }],
        }),
      );
      const effect = catalog.find(item => item.name === effectToolName);
      assert.ok(effect);
      assert.equal(effect.readOnly, false);
      const readBound = await connect(
        await createControllerToolServer(app, scope, {
          ssrSiteId: 'web',
          toolAccess: [status, effect],
          toolAccessReadOnly: true,
        }),
      );
      const initial = toolFixtureState.count;
      try {
        assert.deepEqual(
          (await readBound.request('tools/list')).result.tools.map((item: any) => item.name),
          [statusToolName, toolContractToolName],
        );
        assert.equal(
          (await readBound.request('tools/call', { name: effectToolName })).error?.code,
          -32602,
          'a read-bound custom grant never gains a now-write Action',
        );
        assert.deepEqual(
          (await exact.request('tools/list')).result.tools.map((item: any) => item.name),
          [statusToolName, toolContractToolName],
        );
        assert.deepEqual((await rebound.request('tools/list')).result.tools, []);
        const allowed = await exact.request('tools/call', { name: statusToolName });
        assert.deepEqual(allowed.result.structuredContent, { count: initial });
        for (const name of [effectToolName, scalarToolName, arrayToolName]) {
          const denied = await exact.request('tools/call', { name, arguments: {} });
          assert.equal(denied.error?.code, -32602, 'custom is not an alias for all read tools');
        }
        assert.equal(
          (await rebound.request('tools/call', { name: statusToolName })).error?.code,
          -32602,
          'a name reused by a different Action never inherits an old grant',
        );
        assert.equal(toolFixtureState.count, initial);
      } finally {
        await readBound.close();
        await exact.close();
        await rebound.close();
      }
    });
  });

  it('uses only Action metadata and keeps undecorated Actions closed', async t => {
    await app.bean.executor.mockCtx(async () => {
      const openapi = app.scope('a-openapi').service.openapi;
      const original = openapi.getControllerActionContract;
      const contracts = t.mock.method(openapi, 'getControllerActionContract', function (...args) {
        assert.ok(!['closed', 'excluded'].includes(args[1]));
        return original.apply(openapi, args as any);
      });
      try {
        assert.equal(appMetadata.getOwnMetadata(SymbolMcpOptions, ControllerCatalog), undefined);
        const server = await createControllerToolServer(app, 'mcp:all', { ssrSiteId: 'web' });
        assert.equal(
          server.diagnostics.some(item => ['closed', 'excluded'].includes(item.action)),
          false,
          'undecorated Actions do not produce diagnostics',
        );
        assert.ok(server.diagnostics.some(item => item.action === 'unsupported'));
        const client = await connect(server);
        try {
          const tools = (await client.request('tools/list')).result.tools;
          assert.ok(tools.some((tool: any) => tool.name === statusToolName));
          for (const action of ['closed', 'excluded']) {
            const name = `test-mcp_toolFixture_${action}`;
            assert.equal(
              tools.some((tool: any) => tool.name === name),
              false,
            );
            const closed = await client.request('tools/call', { name, arguments: {} });
            assert.equal(closed.error?.code, -32602);
          }
        } finally {
          await client.close();
        }
        assert.equal(
          contracts.mock.calls.some(call => call.arguments[1] === 'closed'),
          false,
        );
      } finally {
        contracts.mock.restore();
      }
    });
  });

  it('records empty Action opt-in without inherited options and rejects Controller decoration', () => {
    class Parent {
      action() {}
    }
    class Child extends Parent {
      override action() {}
    }
    Mcp.tool({ name: 'parent_tool', readOnly: false })(
      Parent.prototype,
      'action',
      Object.getOwnPropertyDescriptor(Parent.prototype, 'action')!,
    );
    assert.equal(
      appMetadata.getOwnMetadata(SymbolMcpOptions, Child.prototype, 'action'),
      undefined,
    );
    Mcp.tool()(
      Child.prototype,
      'action',
      Object.getOwnPropertyDescriptor(Child.prototype, 'action')!,
    );
    assert.deepEqual(appMetadata.getOwnMetadata(SymbolMcpOptions, Child.prototype, 'action'), {});
    for (const options of [{}, { name: 'class-name-is-not-valid' }]) {
      assert.throws(
        () => (Mcp.tool as any)(options)(class {}),
        /only valid on a controller action/,
      );
    }
  });

  it('validates MCP Site onion-name declarations without accepting legacy Site IDs', async t => {
    const invalid = [
      [],
      ['web'],
      [''],
      ['basic-siteweb:'],
      ['basic-siteweb:web', 'basic-siteweb:web'],
      [7],
      'basic-siteweb:web',
    ];
    for (const ssrSites of invalid) {
      assert.throws(() => Mcp.tool({ ssrSites } as any), /Invalid MCP tool ssrSites/);
    }
    assert.doesNotThrow(() => Mcp.tool({ ssrSites: ['basic-siteweb:web'] }));
    await app.bean.executor.mockCtx(async () => {
      const original = appMetadata.getOwnMetadata;
      for (const ssrSites of [...invalid, ['missing-site:missing']]) {
        const metadata = t.mock.method(
          appMetadata,
          'getOwnMetadata',
          function (...args: Parameters<typeof original>) {
            const value = original.apply(appMetadata, args) as IMcpToolOptions | undefined;
            return args[0] === SymbolMcpOptions &&
              args[1] === ControllerToolFixture.prototype &&
              args[2] === 'status'
              ? { ...value, ssrSites }
              : value;
          },
        );
        try {
          await assert.rejects(
            () =>
              createControllerToolServer(app, 'mcp:all', {
                ssrSiteId: 'web',
                includeTool: () => false,
              }),
            /Invalid MCP tool ssrSites/,
          );
        } finally {
          metadata.mock.restore();
        }
      }
    });
  });

  it('maps external Site IDs to onion names before tool names, contracts and calls', async t => {
    await app.bean.executor.mockCtx(async () => {
      const ssr = app.scope('a-ssr').service.ssr;
      const web = ssr.getSitesEnabled().find(site => site.name === 'basic-siteweb:web')!;
      assert.ok(web);
      const sites = t.mock.method(ssr, 'getSitesEnabled', () => [
        {
          ...web,
          beanOptions: {
            ...web.beanOptions,
            options: { ...web.beanOptions.options, siteId: 'renamed-web' },
          },
        },
      ]);
      const original = appMetadata.getOwnMetadata;
      const metadata = t.mock.method(
        appMetadata,
        'getOwnMetadata',
        function (...args: Parameters<typeof original>) {
          const value = original.apply(appMetadata, args) as IMcpToolOptions | undefined;
          if (
            args[0] === SymbolMcpOptions &&
            args[1] === ControllerToolFixture.prototype &&
            ['status', 'unsupported'].includes(args[2] as string)
          ) {
            return {
              ...value,
              ssrSites: ['basic-siteadmin:admin'],
              name: 'invalid name for another Site',
            };
          }
          return value;
        },
      );
      const openapi = app.scope('a-openapi').service.openapi;
      const originalContract = openapi.getControllerActionContract;
      const contracts = t.mock.method(
        openapi,
        'getControllerActionContract',
        function (...args: Parameters<typeof originalContract>) {
          assert.ok(
            args[0] !== ControllerToolFixture || !['status', 'unsupported'].includes(args[1]),
          );
          return originalContract.apply(openapi, args);
        },
      );
      try {
        for (const ssrSiteId of [undefined, 'web', 'admin', 'missing']) {
          await assert.rejects(
            () => createControllerToolServer(app, 'mcp:all', { ssrSiteId }),
            /Enabled MCP SSR Site required/,
          );
        }
        const server = await createControllerToolServer(app, 'mcp:all', {
          ssrSiteId: 'renamed-web',
          includeTool: identity => identity.controller === 'test-mcp.controller.toolFixture',
        });
        const client = await connect(server);
        try {
          const names = (await client.request('tools/list')).result.tools.map(
            (tool: any) => tool.name,
          );
          assert.ok(
            names.includes(scalarToolName),
            'onion membership survives a changed external Site ID',
          );
          assert.ok(names.includes(arrayToolName), 'omitted membership remains unrestricted');
          assert.ok(!names.includes(statusToolName));
          assert.deepEqual(server.diagnostics, [], 'excluded contracts produce no diagnostics');
          for (const name of [statusToolName, 'invalid name for another Site']) {
            assert.equal((await client.request('tools/call', { name })).error?.code, -32602);
            assert.equal(
              (
                await client.request('tools/call', {
                  name: toolContractToolName,
                  arguments: { tool: name },
                })
              ).error?.code,
              -32602,
            );
          }
          assert.deepEqual(
            (await client.request('tools/call', { name: scalarToolName })).result.structuredContent,
            { result: 7 },
          );
        } finally {
          await client.close();
        }
      } finally {
        contracts.mock.restore();
        metadata.mock.restore();
        sites.mock.restore();
      }
    });
  });

  it('validates Action-local options after includeTool filtering', async t => {
    await app.bean.executor.mockCtx(async () => {
      const original = appMetadata.getOwnMetadata;
      let configuration:
        | 'local-options'
        | 'invalid-name'
        | 'duplicate'
        | 'reserved-name'
        | 'logout-name'
        | 'retired-name'
        | 'invalid-pick' = 'local-options';
      const metadata = t.mock.method(
        appMetadata,
        'getOwnMetadata',
        function (...args: Parameters<typeof original>) {
          const [key, target, action] = args;
          const value = original.apply(appMetadata, args) as IMcpToolOptions | undefined;
          if (
            key === SymbolMcpOptions &&
            target === ControllerToolFixture.prototype &&
            action === 'status'
          ) {
            if (configuration === 'local-options') {
              return {
                name: 'mcp_test_local_status',
                description: 'Local description',
                readOnly: false,
                output: { pick: ['count'] },
              };
            }
            if (configuration === 'invalid-name') return { ...value, name: 'invalid tool name' };
            if (configuration === 'duplicate') return { ...value, name: categoryToolName };
            if (configuration === 'reserved-name') return { ...value, name: toolContractToolName };
            if (configuration === 'logout-name') return { ...value, name: 'cabloy_logout' };
            if (configuration === 'retired-name')
              return { ...value, name: retiredQueryCapabilitiesToolName };
            return { ...value, output: { pick: ['missing'] } };
          }
          return value;
        },
      );
      try {
        const client = await connect(
          await createControllerToolServer(app, 'mcp:all', { ssrSiteId: 'web' }),
        );
        try {
          const tools = (await client.request('tools/list')).result.tools;
          const status = tools.find((tool: any) => tool.name === 'mcp_test_local_status');
          assert.ok(status);
          assert.equal(status.description, 'Local description');
          assert.equal(status.annotations.readOnlyHint, false);
          assert.deepEqual(Object.keys(status.outputSchema.properties), ['count']);
          assert.equal(
            tools.some((tool: any) => tool.name === statusToolName),
            false,
          );
          const result = await client.request('tools/call', { name: status.name });
          assert.deepEqual(result.result.structuredContent, { count: toolFixtureState.count });
        } finally {
          await client.close();
        }
        configuration = 'retired-name';
        const reused = await connect(
          await createControllerToolServer(app, 'mcp:read', {
            ssrSiteId: 'web',
            includeTool: identity =>
              identity.controller === 'test-mcp.controller.toolFixture' &&
              identity.action === 'status',
          }),
        );
        try {
          assert.deepEqual(
            (await reused.request('tools/list')).result.tools.map((tool: any) => tool.name),
            [retiredQueryCapabilitiesToolName, toolContractToolName],
            'the retired helper name has no reserved-name behavior',
          );
          const response = await reused.request('tools/call', {
            name: retiredQueryCapabilitiesToolName,
          });
          assert.deepEqual(
            response.result.structuredContent,
            { count: toolFixtureState.count },
            'an explicit Action may use the retired name without helper fallback',
          );
        } finally {
          await reused.close();
        }
        for (const [mode, expected] of [
          ['invalid-name', /Invalid or duplicate MCP tool name/],
          ['duplicate', /Invalid or duplicate MCP tool name/],
          ['reserved-name', /Invalid or duplicate MCP tool name/],
          ['logout-name', /Invalid or duplicate MCP tool name/],
          ['invalid-pick', /Invalid MCP output.pick/],
        ] as const) {
          configuration = mode;
          await assert.rejects(
            () => createControllerToolServer(app, 'mcp:all', { ssrSiteId: 'web' }),
            expected,
          );
          const filtered = await createControllerToolServer(app, 'mcp:all', {
            ssrSiteId: 'web',
            includeTool: identity =>
              identity.controller === 'test-mcp.controller.catalog' &&
              identity.action === 'categories',
          });
          const selected = await connect(filtered);
          try {
            assert.deepEqual(filtered.diagnostics, []);
            assert.deepEqual(
              (await selected.request('tools/list')).result.tools.map((tool: any) => tool.name),
              [categoryToolName, toolContractToolName],
            );
          } finally {
            await selected.close();
          }
        }
      } finally {
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

  it('keeps @Api.exclude() independent, wraps scalar/array output and diagnoses unsupported Actions', async () => {
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
      const server = await createControllerToolServer(app, 'mcp:read', { ssrSiteId: 'web' });
      const client = await connect(server);
      try {
        assert.ok(
          server.diagnostics.some(
            item =>
              item.controller === 'test-mcp.controller.toolFixture' &&
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
          const fullOutput = await client.request('tools/call', {
            name: toolContractToolName,
            arguments: { tool: name, section: 'output' },
          });
          assert.equal(fullOutput.error, undefined);
          assert.deepEqual(fullOutput.result.structuredContent, {
            contractVersion: 1,
            tool: name,
            section: 'output',
            schema: tool.outputSchema,
          });
          assert.deepEqual(fullOutput.result.structuredContent.schema.required, ['result']);
          assert.equal(fullOutput.result.structuredContent.schema.additionalProperties, false);
          const resultSchema = fullOutput.result.structuredContent.schema.properties.result;
          assert.equal(resultSchema.type, name === scalarToolName ? 'integer' : 'array');
          if (name === arrayToolName) assert.deepEqual(resultSchema.items, { type: 'string' });
          const overview = await client.request('tools/call', {
            name: toolContractToolName,
            arguments: { tool: name },
          });
          assert.deepEqual(overview.result.structuredContent.sections, [
            'overview',
            'input',
            'output',
          ]);
          assert.deepEqual(overview.result.structuredContent.output, {
            type: 'object',
            compactPaths: [],
          });
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
      const client = await connect(
        await createSharedBusinessToolServer(app, `${getMcpIssuer(app)}/admin`, 'mcp:all'),
      );
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
      const action = mockOwnedPerformAction(t, async () => raw);
      try {
        const listed = await client.request('tools/list');
        const summary = listed.result.tools.find(
          (tool: any) => tool.name === 'training-student_student_summary',
        );
        const fullOutput = await client.request('tools/call', {
          name: toolContractToolName,
          arguments: { tool: summary.name, section: 'output' },
        });
        assert.equal(fullOutput.error, undefined);
        assert.deepEqual(fullOutput.result.structuredContent, {
          contractVersion: 1,
          tool: summary.name,
          section: 'output',
          schema: summary.outputSchema,
        });
        assert.deepEqual(
          Object.keys(fullOutput.result.structuredContent.schema.properties).sort(),
          ['descriptionLength', 'id', 'level', 'levelTitle', 'name', 'summaryText'],
        );
        assert.doesNotMatch(
          JSON.stringify(fullOutput.result.structuredContent.schema),
          /"(?:mobile|descriptionMarkdown|descriptionHtml)":|#\/components\/schemas\//,
        );
        assert.equal(
          action.mock.callCount(),
          0,
          'full output lookup does not execute the summary Action',
        );
        const call = () =>
          client.request('tools/call', {
            name: 'training-student_student_summary',
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
          assert.deepEqual(categoryTool.outputSchema, toolSchema(responseSchema, schemas));
          assert.deepEqual(
            categoryTool.outputSchema.$defs[appResource.getBeanFullName(DtoCategoryPublic)!],
            toolSchema(schemas[appResource.getBeanFullName(DtoCategoryPublic)!], schemas),
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
          assert.ok(tool.outputSchema.$defs);
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
        assert.ok(tool.outputSchema.$defs);
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
