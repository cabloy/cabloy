import type { SchemaObject } from 'openapi3-ts/oas31';

import assert from 'node:assert/strict';
import test from 'node:test';
import { computed, shallowReactive } from 'vue';

import type { ISchemaObjectExtensionField } from '../../src/types/rest.ts';

import {
  getQueryCapabilities,
  getQueryOrderField,
  getSchemaOfRequestQuery,
  getSchemaOfRequestQueryFilter,
  loadSchemaProperties,
  schemaToZodSchema,
} from '../../src/lib/schema.ts';

const onGetSchema = () => undefined;

function field(field: ISchemaObjectExtensionField) {
  return field;
}

test('schema properties preserve the canonical fieldSource key and original schema key', () => {
  const properties = loadSchemaProperties(
    {
      type: 'object',
      properties: {
        content: field({
          type: 'object',
          rest: { fieldSource: 'content.descriptionMarkdown' },
          properties: {
            descriptionMarkdown: field({
              type: 'string',
              rest: { render: 'start-markdown:formFieldMarkdown' as any },
            }),
          },
        }),
      },
    },
    onGetSchema,
  );

  assert.deepEqual(properties, [
    {
      key: 'content.descriptionMarkdown',
      schemaKey: 'content',
      type: 'string',
      rest: { render: 'start-markdown:formFieldMarkdown' },
    },
  ]);
});

test('schema properties preserve virtual aliases without changing the form key', () => {
  const properties = loadSchemaProperties(
    {
      type: 'object',
      properties: {
        content: field({
          type: 'object',
          rest: { visible: false },
          properties: {
            descriptionMarkdown: field({ type: 'string' }),
          },
        }),
        _descriptionMarkdown: field({
          type: 'object',
          rest: { fieldSource: 'content.descriptionMarkdown' },
        }),
      },
    },
    onGetSchema,
  );

  assert.deepEqual(properties?.[1], {
    key: 'content.descriptionMarkdown',
    schemaKey: '_descriptionMarkdown',
    type: 'string',
  });
});

test('schema properties normalize a scene-specific fieldSource', () => {
  const properties = loadSchemaProperties(
    {
      type: 'object',
      properties: {
        content: field({
          type: 'object',
          rest: { visible: false },
          properties: {
            descriptionMarkdown: field({ type: 'string' }),
          },
        }),
        _descriptionMarkdown: field({
          type: 'object',
          rest: { form: { fieldSource: 'content.descriptionMarkdown' } },
        }),
      },
    },
    onGetSchema,
    'form',
  );

  assert.deepEqual(properties?.[1], {
    key: 'content.descriptionMarkdown',
    schemaKey: '_descriptionMarkdown',
    type: 'string',
    rest: {},
  });
});

test('schema properties coalesce aliases when the source property has fieldSource', () => {
  const properties = loadSchemaProperties(
    {
      type: 'object',
      properties: {
        content: field({
          type: 'object',
          rest: { fieldSource: 'content.descriptionMarkdown' },
          properties: {
            descriptionMarkdown: field({ type: 'string' }),
          },
        }),
        _descriptionMarkdown: field({
          type: 'object',
          rest: { fieldSource: 'content.descriptionMarkdown' },
        }),
        studentContentForm: field({
          type: 'object',
          rest: { fieldSource: 'content.descriptionMarkdown' },
        }),
      },
    },
    onGetSchema,
  );

  assert.deepEqual(properties, [
    {
      key: 'content.descriptionMarkdown',
      schemaKey: 'content',
      schemaKeys: ['_descriptionMarkdown', 'studentContentForm'],
      type: 'string',
    },
  ]);
});

test('schema properties coalesce aliases declared before their fieldSource parent', () => {
  const properties = loadSchemaProperties(
    {
      type: 'object',
      properties: {
        _descriptionMarkdown: field({
          type: 'object',
          rest: { fieldSource: 'content.descriptionMarkdown' },
        }),
        content: field({
          type: 'object',
          rest: { fieldSource: 'content.descriptionMarkdown' },
          properties: {
            descriptionMarkdown: field({ type: 'string' }),
          },
        }),
      },
    },
    onGetSchema,
  );

  assert.deepEqual(properties, [
    {
      key: 'content.descriptionMarkdown',
      schemaKey: '_descriptionMarkdown',
      schemaKeys: ['content'],
      type: 'string',
    },
  ]);
});

const queryCapabilities = {
  fields: {
    name: { operators: ['eq', 'isNull'] as const, type: 'string' as const, nullable: true },
  },
  orderable: ['studentName'],
  projection: { mode: 'fixed' as const },
  limits: {
    maxBytes: 8192,
    maxNodes: 128,
    maxValueDepth: 6,
    maxPredicateDepth: 3,
    maxListItems: 32,
    maxOrders: 5,
    maxStringLength: 256,
    maxPageSize: 100,
  },
  defaults: { orders: [{ field: 'id', direction: 'asc' as const }], pageNo: 1, pageSize: 20 },
  conveniences: { studentId: { field: 'studentName' } },
};

test('order capabilities survive flattened query parameters without a named filter DTO', () => {
  const operation = {
    parameters: [
      {
        in: 'query' as const,
        name: 'orders',
        schema: field({ type: 'array', filter: { capabilities: { query: queryCapabilities } } }),
      },
    ],
  };
  const query = getSchemaOfRequestQuery(operation);
  const order = getSchemaOfRequestQueryFilter(operation, { order: true });
  assert.equal(getQueryCapabilities(query), queryCapabilities);
  assert.equal(getQueryCapabilities(order), queryCapabilities);
  assert.deepEqual(order?.properties, {});
  assert.equal(getQueryOrderField(order, 'studentId'), 'studentName');
  assert.equal(getQueryOrderField(order, 'id'), 'id');
  assert.equal(getQueryOrderField(undefined, 'studentId'), 'studentId');
});

test('capability-bearing named filter forms retain object roots and coercion beside strict public controls', () => {
  const scalar = { type: 'string' as const, minLength: 2 };
  const scalarRef = { $ref: '#/components/schemas/Name' };
  const resolveSchema = (name: string) => (name === scalarRef.$ref ? scalar : undefined);
  const metadata = { filter: { capabilities: { query: queryCapabilities } } };
  const operation = {
    parameters: [
      { in: 'query' as const, name: 'name', schema: scalarRef },
      {
        in: 'query' as const,
        name: 'where',
        schema: field({
          ...metadata,
          type: 'object',
          additionalProperties: false,
          required: ['field', 'op', 'value'],
          properties: { field: { const: 'name' }, op: { const: 'eq' }, value: scalarRef },
        }),
      },
      {
        in: 'query' as const,
        name: 'orders',
        schema: field({
          ...metadata,
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['field', 'direction'],
            properties: { field: { enum: ['studentName'] }, direction: { enum: ['asc', 'desc'] } },
          },
        }),
      },
    ],
  };
  const filter = getSchemaOfRequestQueryFilter(operation, { where: true })!;
  const form = schemaToZodSchema(filter, resolveSchema);
  assert.equal(getQueryCapabilities(filter), queryCapabilities);
  // ZForm accepts object/union roots, not a ZodPipe around an ordinary form.
  assert.equal(form.def.type, 'object');
  assert.deepEqual(form.parse({ name: 12 }), { name: '12' });
  assert.equal(form.safeParse({ name: 'x' }).success, false);

  const query = schemaToZodSchema(getSchemaOfRequestQuery(operation)!, resolveSchema);
  assert.equal(query.def.type, 'object');
  assert.equal(
    query.safeParse({ name: 12, where: { field: 'name', op: 'eq', value: 'One' } }).success,
    true,
  );
  // The same referenced scalar is coercing in the form and strict in the AST.
  assert.equal(query.safeParse({ where: { field: 'name', op: 'eq', value: 12 } }).success, false);
  assert.equal(query.safeParse({ orders: [{ field: 12, direction: 'asc' }] }).success, false);
});

test('runtime query schemas resolve recursive refs through unions, arrays and not', () => {
  const ref = { $ref: '#/components/schemas/Predicate' };
  const predicate = field({
    anyOf: [
      {
        type: 'object',
        additionalProperties: false,
        required: ['field', 'op', 'value'],
        properties: {
          field: { const: 'name' },
          op: { const: 'eq' },
          value: { type: 'string' },
        },
      },
      {
        type: 'object',
        additionalProperties: false,
        required: ['field', 'op'],
        properties: {
          field: { const: 'name' },
          op: { const: 'isNull' },
        },
      },
      ...['and', 'or'].map(key => ({
        type: 'object' as const,
        additionalProperties: false,
        required: [key],
        properties: { [key]: { type: 'array' as const, minItems: 1, maxItems: 3, items: ref } },
      })),
      { type: 'object', additionalProperties: false, required: ['not'], properties: { not: ref } },
    ],
  });
  const schema = field({
    type: 'object',
    additionalProperties: false,
    filter: { capabilities: { query: queryCapabilities } },
    properties: {
      where: ref,
      orders: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['field', 'direction'],
          properties: { field: { enum: ['studentName'] }, direction: { enum: ['asc', 'desc'] } },
        },
      },
    },
  });
  const runtime = schemaToZodSchema(schema, name => (name === ref.$ref ? predicate : undefined));
  const leaf = { field: 'name', op: 'eq', value: 'One' };
  assert.equal(
    runtime.safeParse({
      where: { and: [leaf, { or: [{ not: leaf }, { field: 'name', op: 'isNull' }] }] },
    }).success,
    true,
  );
  for (const where of [
    { name: 'One' },
    { and: [] },
    { not: { unknown: true } },
    { field: 'name', op: 'eq', value: 1 },
    { field: 'name', op: 'isNull', value: null },
    { or: [leaf, leaf, leaf, leaf] },
  ])
    assert.equal(runtime.safeParse({ where }).success, false, JSON.stringify(where));
  assert.equal(
    runtime.safeParse({ orders: [{ field: 'studentName', direction: 'asc' }] }).success,
    true,
  );
  assert.equal(runtime.safeParse({ orders: [['studentName', 'asc']] }).success, false);
  assert.equal(
    runtime.safeParse({ orders: [{ field: 'studentId', direction: 'asc' }] }).success,
    false,
  );
  assert.equal(runtime.safeParse({ columns: ['name'] }).success, false);
});

test('ordinary pending references skip their owning properties and return after reactive schema arrival', () => {
  const reference = '#/components/schemas/training-record.dto.detailRecordSubjectResItem';
  const schemas = shallowReactive<Record<string, SchemaObject>>({});
  const schema: SchemaObject = {
    type: 'object',
    required: ['name', 'subjects'],
    properties: {
      name: { type: 'string', minLength: 2 },
      count: { type: 'integer', default: 2 },
      subjects: { type: 'array', items: { $ref: reference } },
      trainingRecords: {
        type: 'array',
        items: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', minLength: 2 },
            _trainingRecordSubjects: {
              type: 'array',
              items: { anyOf: [{ $ref: reference }, { type: 'null' }] },
            },
            choice: { oneOf: [{ $ref: reference }, { type: 'null' }] },
          },
        },
      },
    },
  };
  const original = structuredClone(schema);
  let conversions = 0;
  const runtime = computed(() => {
    conversions++;
    return schemaToZodSchema(schema, name => schemas[name]);
  });
  const pending = runtime.value;
  assert.equal(pending.def.type, 'object');
  assert.deepEqual(Object.keys((pending as any).shape), ['name', 'count', 'trainingRecords']);
  const detail = (pending as any).shape.trainingRecords.unwrap().element;
  assert.deepEqual(Object.keys(detail.shape), ['title']);
  assert.deepEqual(pending.parse({ name: 12, trainingRecords: [{ title: 'One' }] }), {
    name: '12',
    count: 2,
    trainingRecords: [{ title: 'One' }],
  });
  assert.equal(pending.safeParse({ name: 'x' }).success, false);
  assert.equal(conversions, 1);

  schemas[reference] = {
    type: 'object',
    required: ['subject'],
    properties: { subject: { type: 'string', minLength: 2 } },
  };
  const ready = runtime.value;
  assert.notEqual(ready, pending);
  assert.equal(conversions, 2);
  assert.equal(ready.safeParse({ name: 'One' }).success, false);
  assert.equal(ready.safeParse({ name: 'One', subjects: [] }).success, true);
  assert.equal(
    ready.safeParse({
      name: 'One',
      subjects: [{ subject: 'Math' }],
      trainingRecords: [{ title: 'One', _trainingRecordSubjects: [null, { subject: 'Math' }] }],
    }).success,
    true,
  );
  assert.equal(ready.safeParse({ name: 'One', subjects: [{ subject: 'x' }] }).success, false);
  assert.equal(
    ready.safeParse({
      name: 'One',
      subjects: [],
      trainingRecords: [{ title: 'One', _trainingRecordSubjects: [{ subject: 'x' }] }],
    }).success,
    false,
  );
  assert.deepEqual(schema, original);
  assert.equal((pending as any).shape.subjects, undefined);
});

test('pending ordinary properties do not hide unresolved public query references', () => {
  for (const control of ['where', 'orders']) {
    assert.throws(
      () =>
        schemaToZodSchema(
          field({
            type: 'object',
            filter: { capabilities: { query: queryCapabilities } },
            properties: {
              pending: { $ref: 'PendingForm' },
              [control]: { type: 'array', items: { $ref: 'MissingQuery' } },
            },
          }),
          onGetSchema,
        ),
      /Unresolved schema reference: MissingQuery/,
    );
  }
});

test('schema compilation fails explicitly on unresolved refs, ref-only cycles and unsupported query schemas', () => {
  assert.throws(
    () => schemaToZodSchema({ $ref: 'Missing' }, onGetSchema),
    /Unresolved schema reference/,
  );
  const cycle = { $ref: 'Cycle' };
  assert.throws(() => schemaToZodSchema(cycle, () => cycle), /Cyclic schema reference/);
  assert.throws(
    () =>
      schemaToZodSchema(
        field({
          type: 'object',
          filter: { capabilities: { query: queryCapabilities } },
          properties: { where: {} },
        }),
        onGetSchema,
      ),
    /Unsupported unrestricted query schema/,
  );
});

test('oneOf and ordinary form defaults, optional fields and array refs retain validation', () => {
  const runtime = schemaToZodSchema(
    {
      type: 'object',
      required: ['name', 'items'],
      properties: {
        name: { type: 'string', minLength: 2 },
        count: { type: 'integer', default: 2 },
        items: { type: 'array', items: { $ref: 'Item' } },
        choice: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      },
    },
    name => (name === 'Item' ? { type: 'string', minLength: 1 } : undefined),
  );
  assert.deepEqual(runtime.parse({ name: 'One', items: ['x'] }), {
    name: 'One',
    items: ['x'],
    count: 2,
  });
  assert.equal(runtime.type, 'object');
  assert.equal(runtime.safeParse({ name: 'x', items: ['x'] }).success, false);
  // Ordinary forms retain the existing Zova primitive-coercion adapter.
  assert.deepEqual(runtime.parse({ name: 'One', items: [1] }), {
    name: 'One',
    items: ['1'],
    count: 2,
  });
  assert.equal(runtime.safeParse({ name: 'One', items: [], choice: {} }).success, false);
});

test('ordinary schema properties do not gain a schema alias', () => {
  const properties = loadSchemaProperties(
    {
      type: 'object',
      properties: {
        name: field({ type: 'string' }),
      },
    },
    onGetSchema,
  );

  assert.deepEqual(properties, [{ key: 'name', type: 'string' }]);
});
