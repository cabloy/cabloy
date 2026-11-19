import assert from 'node:assert/strict';
import test from 'node:test';

import type { ISchemaObjectExtensionField } from '../../src/types/rest.ts';

import { projectSchemaPayload } from '../../src/lib/schemaPayload.ts';

interface SchemaObject extends Omit<ISchemaObjectExtensionField, 'properties' | 'items'> {
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  $defs?: Record<string, SchemaObject>;
}

const string = { type: 'string' } as const;
const identity = { type: 'number' } as const;
const resolve = () => undefined;

test('update projection preserves writable nested identities and excludes view-only fields', () => {
  const schema: SchemaObject = {
    type: 'object',
    properties: {
      name: string,
      studentId: identity,
      sceneImageIds: { type: 'array', items: identity },
      content: {
        type: 'object',
        rest: { fieldSource: 'content.descriptionMarkdown', visible: false },
        properties: { id: identity, descriptionMarkdown: string },
      },
      trainingRecordSubjects: {
        type: 'array',
        items: { $ref: '#/$defs/subject' },
      },
    },
    $defs: {
      subject: {
        type: 'object',
        properties: {
          id: { ...identity, rest: { visible: false } },
          deleted: { type: 'boolean' },
          name: string,
          score: { type: 'number' },
          serverScore: { type: 'number', rest: { readonly: true } },
        },
      },
    },
  };
  const input = {
    id: 3,
    iid: 1,
    name: 'Edited record',
    studentId: 7,
    student: { id: 7, name: 'Display only' },
    sceneImageIds: [11],
    sceneImages: [{ id: 11, url: '/display-only' }],
    content: { id: 9, descriptionMarkdown: 'Keep', display: 'Remove' },
    trainingRecordSubjects: [
      { id: 5, deleted: false, name: 'Math', score: 95, serverScore: 90, display: 'Remove' },
      { id: 6, deleted: true, name: 'Old', score: 0 },
    ],
  };
  const original = structuredClone(input);
  const originalSchema = structuredClone(schema);
  const result = projectSchemaPayload(schema, input, resolve);
  assert.deepEqual(result, {
    name: 'Edited record',
    studentId: 7,
    sceneImageIds: [11],
    content: { id: 9, descriptionMarkdown: 'Keep' },
    trainingRecordSubjects: [
      { id: 5, deleted: false, name: 'Math', score: 95 },
      { id: 6, deleted: true, name: 'Old', score: 0 },
    ],
  });
  assert.deepEqual(input, original);
  assert.deepEqual(schema, originalSchema);
  assert.notEqual(result, input);
  assert.notEqual(result.content, input.content);
  assert.notEqual(result.sceneImageIds, input.sceneImageIds);
  assert.notEqual(result.trainingRecordSubjects[0], input.trainingRecordSubjects[0]);
});

test('student nested display arrays are omitted without dropping attachment IDs or mutation controls', () => {
  const schema: SchemaObject = {
    type: 'object',
    properties: {
      trainingRecords: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { ...identity, rest: { visible: false } },
            deleted: { type: 'boolean' },
            sceneImageIds: { type: 'array', items: identity },
            dossierFileIds: { type: 'array', items: identity },
            sceneImages: { type: 'array', rest: { visible: false, readonly: true } },
            dossierFiles: { type: 'array', rest: { visible: false, readonly: true } },
            trainingRecordSubjects: {
              type: 'array',
              items: {
                type: 'object',
                properties: { id: identity, deleted: { type: 'boolean' }, name: string },
              },
            },
          },
        },
      },
    },
  };
  const input = {
    trainingRecords: [
      {
        id: 101,
        deleted: false,
        sceneImageIds: [201],
        dossierFileIds: [301],
        sceneImages: [{ id: 201, url: '/image' }],
        dossierFiles: [{ id: 301, downloadUrl: '/file' }],
        trainingRecordSubjects: [{ id: 102, deleted: true, name: 'Math' }],
      },
    ],
  };
  const original = structuredClone(input);
  assert.deepEqual(projectSchemaPayload(schema, input, resolve), {
    trainingRecords: [
      {
        id: 101,
        deleted: false,
        sceneImageIds: [201],
        dossierFileIds: [301],
        trainingRecordSubjects: [{ id: 102, deleted: true, name: 'Math' }],
      },
    ],
  });
  assert.deepEqual(input, original);
});

test('effective readonly excludes declared fields but visibility and writeOnly do not', () => {
  const schema: SchemaObject = {
    type: 'object',
    properties: {
      standard: { ...string, readOnly: true },
      base: { ...string, rest: { readonly: true } },
      scene: { ...string, rest: { form: { readonly: true } } },
      editable: { ...string, rest: { readonly: true, form: { readonly: false } } },
      hidden: { ...string, rest: { visible: false } },
      password: { ...string, writeOnly: true },
      sceneImages: {
        type: 'array',
        rest: { readonly: true },
        items: { type: 'object', properties: { url: string } },
      },
    },
  };
  assert.deepEqual(
    projectSchemaPayload(
      schema,
      {
        standard: 'no',
        base: 'no',
        scene: 'no',
        editable: 'yes',
        hidden: 'yes',
        password: 'yes',
        sceneImages: [{ url: 'no' }],
      },
      resolve,
    ),
    { editable: 'yes', hidden: 'yes', password: 'yes' },
  );
  assert.deepEqual(
    projectSchemaPayload(schema, { scene: 'no', hidden: 'yes' }, resolve, 'form-create'),
    { hidden: 'yes' },
  );
});

test('create uses its own contract and form-create readonly overrides without injecting defaults', () => {
  const schema: SchemaObject = {
    type: 'object',
    properties: {
      name: string,
      initial: {
        ...string,
        rest: { 'form': { readonly: true }, 'form-create': { readonly: false } },
      },
      generated: { ...string, rest: { 'form-create': { readonly: true } } },
      missing: { ...string, default: 'Not injected' },
      details: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: string,
            code: { ...string, rest: { visible: false } },
            display: { ...string, rest: { readonly: true } },
          },
        },
      },
      reference: { type: 'object', properties: { id: identity } },
    },
  };
  const input = {
    id: 1,
    name: 'New',
    initial: 'Set on create',
    generated: 'Server only',
    details: [{ id: 2, deleted: false, name: 'Detail', code: 'Hidden', display: 'View only' }],
    reference: { id: 3 },
  };
  const original = structuredClone(input);
  const result = projectSchemaPayload(schema, input, resolve, 'form-create');
  assert.deepEqual(result, {
    name: 'New',
    initial: 'Set on create',
    details: [{ name: 'Detail', code: 'Hidden' }],
    reference: { id: 3 },
  });
  assert.deepEqual(input, original);
  assert.notEqual(result.details[0], input.details[0]);
  assert.deepEqual(
    projectSchemaPayload(
      schema,
      { initial: 'Omit on update', generated: 'Editable' },
      resolve,
      'form',
    ),
    { generated: 'Editable' },
  );
});

test('references, siblings, maps and recursive DTOs use fresh projected values', () => {
  const schemas: Record<string, SchemaObject> = {
    Node: {
      type: 'object',
      properties: {
        name: string,
        child: { $ref: 'Node' },
        labels: { type: 'object', additionalProperties: string },
      },
    },
  };
  const input = { name: 'Root', child: { name: 'Child', extra: 'no' }, labels: { en: 'Name' } };
  assert.deepEqual(
    projectSchemaPayload({ $ref: 'Node' }, input, ref => schemas[ref]),
    {
      name: 'Root',
      child: { name: 'Child' },
      labels: { en: 'Name' },
    },
  );
  assert.deepEqual(
    projectSchemaPayload(
      { type: 'object', properties: { node: { $ref: 'Node', readOnly: true } } },
      { node: input },
      ref => schemas[ref],
    ),
    {},
  );
});

test('composition selects a matching union without coercing form values', () => {
  const schema: SchemaObject = {
    type: 'object',
    properties: {
      level: { anyOf: [{ type: 'number', enum: [1, 2] }, { type: 'null' }] },
      detail: {
        oneOf: [
          {
            type: 'object',
            required: ['kind'],
            properties: { kind: { const: 'a' }, name: string },
          },
          {
            type: 'object',
            required: ['kind'],
            properties: { kind: { const: 'b' }, score: identity },
          },
        ],
      },
      combined: {
        allOf: [
          { type: 'object', properties: { name: string } },
          { type: 'object', properties: { score: identity } },
        ],
      },
    },
  };
  assert.deepEqual(
    projectSchemaPayload(
      schema,
      {
        level: 2,
        detail: { kind: 'a', name: 'Keep', score: 100, extra: 'no' },
        combined: { name: 'Keep', score: 95, extra: 'no' },
      },
      resolve,
    ),
    {
      level: 2,
      detail: { kind: 'a', name: 'Keep' },
      combined: { name: 'Keep', score: 95 },
    },
  );
  assert.deepEqual(projectSchemaPayload(schema, { level: null }, resolve), { level: null });
});

test('missing contracts and payload cycles abort instead of sending incomplete updates', () => {
  assert.throws(() => projectSchemaPayload({ $ref: 'Missing' }, {}, resolve), /Unresolved/);
  assert.throws(
    () =>
      projectSchemaPayload(
        { type: 'object', properties: { child: { $ref: 'Missing' } } },
        { child: {} },
        resolve,
      ),
    /Unresolved/,
  );
  assert.throws(
    () => projectSchemaPayload({ $ref: 'Cycle' }, {}, () => ({ $ref: 'Cycle' })),
    /Cyclic/,
  );
  const cyclic: any = {};
  cyclic.child = cyclic;
  assert.throws(
    () => projectSchemaPayload({ type: 'object', additionalProperties: true }, cyclic, resolve),
    /Cyclic/,
  );
});
