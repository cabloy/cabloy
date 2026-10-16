import type { SchemaObject } from 'openapi3-ts/oas31';
import type { ISchemaObjectExtensionField } from 'zova-module-a-openapi';

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createDraftSchema,
  draftBaselineSignature,
  projectDraftValues,
  restoreDraftValues,
} from '../../src/lib/draftSchema.js';

interface ITestSchema extends Omit<ISchemaObjectExtensionField, 'properties' | 'items'> {
  properties?: Record<string, ITestSchema>;
  items?: ITestSchema;
}

function compile(
  schema: ITestSchema,
  scene: 'form' | 'form-create' = 'form',
  refs: Record<string, SchemaObject> = {},
) {
  return createDraftSchema(schema, {
    scene,
    resolveSchema: reference => refs[reference],
    loadProperties(schema, scene) {
      const result: ISchemaObjectExtensionField[] = [];
      for (const [name, raw] of Object.entries(schema.properties ?? {})) {
        const source = (raw.$ref ? refs[raw.$ref] : raw) as ISchemaObjectExtensionField;
        if (!source) continue;
        const rest = {
          ...source.rest,
          ...(scene !== 'form' ? source.rest?.form : undefined),
          ...source.rest?.[scene],
        };
        const key = rest.fieldSource ?? name;
        let property = source;
        if (rest.fieldSource) {
          const [parent, child] = key.split('.');
          const rawParent = schema.properties?.[parent] as SchemaObject;
          const parentSchema = rawParent?.$ref ? refs[rawParent.$ref] : rawParent;
          property = parentSchema?.properties?.[child] as ISchemaObjectExtensionField;
          if (!property) continue;
        }
        const existing = result.find(item => item.key === key);
        if (existing) {
          existing.schemaKeys = [...(existing.schemaKeys ?? []), name];
          continue;
        }
        result.push({
          ...property,
          key,
          schemaKey: key === name ? undefined : name,
          rest: {
            ...property.rest,
            ...(scene !== 'form' ? property.rest?.form : undefined),
            ...property.rest?.[scene],
          },
        });
      }
      return result;
    },
  });
}

const string = { type: 'string' } as const;
const level = {
  anyOf: [1, 2, 3].map(value => ({ type: 'number' as const, enum: [value] })),
} satisfies SchemaObject;

test('draft Student level unions recover numeric selections over the edit baseline', () => {
  for (const union of [level, { oneOf: level.anyOf }]) {
    const compiled = compile({ type: 'object', properties: { level: union } });
    const projected = projectDraftValues(compiled, { level: 2 });
    assert.deepEqual(projected.values, { level: 2 });
    assert.deepEqual(
      restoreDraftValues(compiled, JSON.parse(JSON.stringify(projected)), { level: 1 }),
      {
        level: 2,
      },
    );
    assert.notEqual(
      draftBaselineSignature(compiled, { level: 1 }),
      draftBaselineSignature(compiled, { level: 2 }),
    );
    assert.deepEqual(
      restoreDraftValues(
        compiled,
        { ...projected, values: { level: { private: 'no' } } },
        { level: 1 },
      ),
      { level: 1 },
    );
    assert.deepEqual(
      restoreDraftValues(compiled, { ...projected, values: { level: [2] } }, { level: 1 }),
      { level: 1 },
    );
  }
});

test('draft primitive unions retain incomplete values and missing/undefined/null distinctions', () => {
  const compiled = compile({ type: 'object', properties: { level } });
  for (const value of [2, '', 'unfinished', false, 0, null, undefined, 99]) {
    const projected = projectDraftValues(compiled, { level: value });
    assert.deepEqual(
      restoreDraftValues(compiled, JSON.parse(JSON.stringify(projected)), { level: 1 }),
      {
        level: value,
      },
    );
  }
  assert.deepEqual(restoreDraftValues(compiled, projectDraftValues(compiled, {}), { level: 1 }), {
    level: 1,
  });
  for (const value of [Number.NaN, Infinity, -Infinity, {}, [], new Date(), 2n]) {
    assert.deepEqual(projectDraftValues(compiled, { level: value }).values, {});
  }
});

test('draft primitive/null alternatives include refs, const/enum inference and nested unions', () => {
  const compiled = compile(
    {
      type: 'object',
      properties: {
        mixed: {
          oneOf: [
            { $ref: '#Scalar' },
            { const: false },
            { enum: [null, 1, 'other'] },
            { type: ['integer', 'null'] },
            { anyOf: [{ type: 'number' }, { type: 'null' }] },
          ],
        },
        rows: { type: 'array', items: { type: 'object', properties: { level } } },
      },
    },
    'form',
    { '#Scalar': { type: 'string', maxLength: 20 } },
  );
  const projected = projectDraftValues(compiled, { mixed: false, rows: [{ level: 2 }] });
  assert.deepEqual(projected.values, { mixed: false, rows: [{ level: 2 }] });
  assert.deepEqual(restoreDraftValues(compiled, JSON.parse(JSON.stringify(projected)), {}), {
    mixed: false,
    rows: [{ level: 2 }],
  });
});

test('draft union signatures retain operator, branch constraints and ref wrappers, not labels', () => {
  const schema: ITestSchema = { type: 'object', properties: { level: structuredClone(level) } };
  const initial = compile(schema).signature;
  schema.properties!.level.title = '培训阶段';
  (schema.properties!.level.anyOf![1] as SchemaObject).title = '提升班';
  assert.equal(compile(schema).signature, initial);
  const replacements: ITestSchema[] = [
    { oneOf: level.anyOf },
    { anyOf: [...level.anyOf, { const: 4 }] },
    { anyOf: [{ type: 'number', enum: [1], minimum: 1 }, ...level.anyOf.slice(1)] },
    { anyOf: [{ type: 'number', enum: [1], multipleOf: 2 }, ...level.anyOf.slice(1)] },
    { anyOf: [{ type: 'integer', enum: [1] }, ...level.anyOf.slice(1)] },
    { anyOf: [{ type: 'number', enum: [4] }, ...level.anyOf.slice(1)] },
  ];
  for (const replacement of replacements) {
    assert.notEqual(
      compile({ type: 'object', properties: { level: replacement } }).signature,
      initial,
    );
  }
  const withRef = (minimum: number) =>
    compile(
      {
        type: 'object',
        properties: { level: { anyOf: [{ $ref: '#Level', minimum }, { type: 'null' }] } },
      },
      'form',
      { '#Level': { type: 'number', enum: [1, 2, 3] } },
    );
  assert.notEqual(withRef(1).signature, withRef(2).signature);
  assert.notEqual(initial, compile({ type: 'object', properties: {} }).signature);
});

test('draft fields default on with sensitive, readonly and file exclusions', () => {
  const schema = compile({
    type: 'object',
    properties: {
      name: string,
      empty: string,
      title: string,
      readonly: { ...string, readOnly: true },
      rendererReadonly: { ...string, rest: { readonly: true } },
      privateNote: { ...string, rest: { draft: false } },
      password: { ...string, rest: { draft: true } },
      code: { ...string, writeOnly: true },
      accessToken: string,
      verificationCode: string,
      apiKey: string,
      masked: { ...string, rest: { options: { type: 'password' } } } as any,
      picture: { ...string, rest: { render: 'basic-image:formFieldImage' } },
      file: { ...string, format: 'binary' },
    },
  });
  const input = Object.fromEntries(
    [
      'name',
      'empty',
      'title',
      'readonly',
      'rendererReadonly',
      'privateNote',
      'password',
      'code',
      'accessToken',
      'verificationCode',
      'apiKey',
      'masked',
      'picture',
      'file',
      'unknown',
    ].map(key => [key, key]),
  );
  input.empty = '';
  input.title = undefined as any;
  const projected = projectDraftValues(schema, input);
  assert.deepEqual(projected.values, { name: 'name', empty: '' });
  assert.deepEqual(projected.undefinedPaths, ['["title"]']);
  const restored = restoreDraftValues(schema, JSON.parse(JSON.stringify(projected)), {
    title: 'baseline',
    readonly: 'fresh',
    privateNote: 'private',
  });
  assert.deepEqual(restored, {
    title: undefined,
    readonly: 'fresh',
    privateNote: 'private',
    name: 'name',
    empty: '',
  });
  assert.equal(
    projectDraftValues(
      compile({ type: 'object', rest: { draft: false }, properties: { name: string } }),
      input,
    ).values.name,
    undefined,
  );
});

test('draft recursively projects declared fields, refs and scene overrides', () => {
  const schema: ITestSchema = {
    type: 'object',
    properties: {
      title: { ...string, rest: { 'form-create': { draft: false } } },
      content: { $ref: '#Content' },
      tags: { type: 'array', items: string },
      blocked: { type: 'object', rest: { draft: false }, properties: { safe: string } },
    },
  };
  const refs = {
    '#Content': {
      type: 'object',
      properties: {
        description: string,
        secret: string,
        nested: {
          type: 'array',
          items: {
            type: 'object',
            properties: { label: string, readonly: { ...string, readOnly: true } },
          },
        },
      },
    },
  } as Record<string, SchemaObject>;
  const input = {
    title: 'draft',
    content: {
      description: 'text',
      secret: 'no',
      unknown: 'no',
      nested: [{ label: 'yes', readonly: 'no' }],
    },
    tags: ['one', 'two'],
    blocked: { safe: 'no' },
  };
  assert.deepEqual(projectDraftValues(compile(schema, 'form-create', refs), input).values, {
    content: { description: 'text', nested: [{ label: 'yes' }] },
    tags: ['one', 'two'],
  });
  assert.equal(projectDraftValues(compile(schema, 'form', refs), input).values.title, 'draft');
});

test('draft uses canonical fieldSource and conservatively excludes colliding aliases', () => {
  const schema: ITestSchema = {
    type: 'object',
    properties: {
      content: { type: 'object', properties: { description: string } },
      _description: { ...string, rest: { fieldSource: 'content.description' } },
    },
  };
  assert.deepEqual(
    projectDraftValues(compile(schema), {
      content: { description: 'yes', unknown: 'no' },
      _description: 'not canonical',
    }).values,
    { content: { description: 'yes' } },
  );
  schema.properties!._secret = {
    ...string,
    rest: { fieldSource: 'content.description', draft: false },
  };
  assert.deepEqual(projectDraftValues(compile(schema), { content: { description: 'no' } }).values, {
    content: {},
  });
});

test('draft relation recovery preserves fresh IDs and readonly values across row reorder', () => {
  const compiled = compile({
    type: 'object',
    properties: {
      details: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', readOnly: true },
            label: string,
            deleted: { type: 'boolean', readOnly: true },
            server: { ...string, readOnly: true },
          },
        },
      },
    },
  });
  const baseline = {
    details: [
      { id: 1, label: 'one', server: 'first' },
      { id: 2, label: 'two', server: 'second' },
    ],
  };
  const input = {
    details: [
      { id: 2, label: 'edited', server: 'stale' },
      { id: 1, label: 'one', deleted: true },
      { label: 'new' },
    ],
  };
  const projected = projectDraftValues(compiled, input, baseline);
  assert.deepEqual(projected.values, {
    details: [{ label: 'edited' }, { label: 'one' }, { label: 'new' }],
  });
  assert.deepEqual(projected.relations, {
    '["details"]': [{ id: 2 }, { id: 1, deleted: true }, {}],
  });
  assert.deepEqual(
    restoreDraftValues(compiled, projected, { details: baseline.details.toReversed() }),
    {
      details: [
        { id: 2, label: 'edited', server: 'second' },
        { id: 1, label: 'one', server: 'first', deleted: true },
        { label: 'new' },
      ],
    },
  );
  assert.equal(
    restoreDraftValues(compiled, projected, { details: [baseline.details[0]] }),
    undefined,
  );
  assert.equal(
    draftBaselineSignature(compiled, baseline),
    draftBaselineSignature(compiled, { details: baseline.details.toReversed() }),
  );
  const duplicate = structuredClone(projected);
  duplicate.relations['["details"]'][1].id = 2;
  assert.equal(restoreDraftValues(compiled, duplicate, baseline), undefined);
});

test('draft rejects runtime objects, cycles and prototype paths without leaking unknown fields', () => {
  const compiled = compile({
    type: 'object',
    properties: {
      'normal': string,
      'unsupported': string,
      'number': { type: 'number' },
      'object': { type: 'object', properties: { child: string } },
      '__proto__.polluted': string,
      'constructor.prototype.polluted': string,
    },
  });
  const cyclic: Record<string, unknown> = {};
  cyclic.child = cyclic;
  const projection = projectDraftValues(compiled, {
    normal: 'safe',
    unsupported: new Blob(['private']),
    number: Number.NaN,
    object: cyclic,
  });
  assert.deepEqual(projection.values, { normal: 'safe', object: {} });
  (projection.values as Record<string, unknown>).unknown = 'not declared';
  projection.values.object = JSON.parse('{"child":"valid","__proto__":{"polluted":true}}');
  const restored = restoreDraftValues(compiled, projection, {}) as Record<string, unknown>;
  assert.deepEqual(restored.object, { child: 'valid' });
  assert.equal(restored.unknown, undefined);
  assert.equal(({} as any).polluted, undefined);
});

test('draft compatibility ignores translations but detects structure and safety changes', () => {
  const schema: ITestSchema = {
    type: 'object',
    title: 'English',
    properties: { name: { ...string, title: 'Name', description: 'Help' }, password: string },
  };
  const compiled = compile(schema);
  const baseline = { name: 'old', password: 'never stored' };
  const signature = draftBaselineSignature(compiled, baseline);
  assert.equal(
    signature,
    draftBaselineSignature(compiled, { name: 'old', password: 'different secret' }),
  );
  assert.notEqual(
    signature,
    draftBaselineSignature(compiled, { name: 'new', password: 'never stored' }),
  );
  schema.title = '中文';
  schema.properties!.name.title = '姓名';
  assert.equal(compiled.signature, compile(schema).signature);
  schema.properties!.name.rest = { draft: false };
  assert.notEqual(compiled.signature, compile(schema).signature);
});
