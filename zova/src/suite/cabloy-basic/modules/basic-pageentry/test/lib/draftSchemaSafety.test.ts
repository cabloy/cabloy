import type { ISchemaObjectExtensionField } from 'zova-module-a-openapi';

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createDraftSchema,
  projectDraftValues,
  restoreDraftValues,
} from '../../src/lib/draftSchema.ts';

function compile(
  properties: Record<string, any>,
  refs: Record<string, any> = {},
  scene: 'form' | 'form-create' = 'form',
) {
  return createDraftSchema(
    { type: 'object', properties },
    {
      scene,
      resolveSchema: reference => refs[reference],
      loadProperties(schema) {
        return Object.entries(schema.properties ?? {}).map(
          ([key, value]) => ({ ...value, key }) as ISchemaObjectExtensionField,
        );
      },
    },
  );
}

test('draft unions reject every unsafe alternative including null branches and ref wrappers', () => {
  const exclusions = [
    { readOnly: true },
    { writeOnly: true },
    { format: 'password' },
    { format: 'binary' },
    { contentEncoding: 'base64' },
    { contentMediaType: 'image/png' },
    { rest: { draft: false } },
    { rest: { readonly: true } },
    { rest: { options: { type: 'password' } } },
    { rest: { render: { type: 'basic-file:formFieldFile' } } },
    { rest: { render: { type: 'basic-input:formFieldInput', props: { readonly: true } } } },
  ];
  for (const metadata of exclusions) {
    for (const type of ['number', 'null']) {
      for (const branch of [
        { type, ...metadata },
        { $ref: '#Safe', ...metadata },
        { $ref: '#Unsafe' },
        { $ref: '#Wrapper' },
      ]) {
        const compiled = compile(
          { value: { anyOf: [{ type: 'number' }, branch, { type: 'null' }] } },
          {
            '#Safe': { type },
            '#Unsafe': { type, ...metadata },
            '#Wrapper': { $ref: '#Safe', ...metadata },
          },
        );
        assert.deepEqual(
          projectDraftValues(compiled, { value: 2 }).values,
          {},
          JSON.stringify(branch),
        );
      }
    }
  }
});

test('draft union safety honors scene overrides without dropping excluded alternatives', () => {
  const properties = {
    value: {
      anyOf: [{ type: 'number' }, { type: 'null', rest: { 'form-create': { draft: false } } }],
    },
  };
  assert.deepEqual(projectDraftValues(compile(properties), { value: 2 }).values, { value: 2 });
  assert.deepEqual(
    projectDraftValues(compile(properties, {}, 'form-create'), { value: 2 }).values,
    {},
  );
});

test('draft unions fail closed on unsupported, unresolved, cyclic and structural alternatives', () => {
  const invalid = [
    {},
    { default: 2 },
    { enum: [] },
    { const: {} },
    { enum: [1, {}] },
    { enum: [1, []] },
    { type: [] },
    { type: 'unknown' },
    { type: ['number', 'object'] },
    { type: ['number', 'array'], items: { type: 'number' } },
    { type: 'object', properties: { label: { type: 'string' } } },
    { type: 'array', items: { type: 'string' } },
    { $ref: '#Missing' },
    { $ref: '#Safe', type: ['number', 'object'] },
    { $ref: '#Cycle' },
    { $ref: '#Recursive' },
    { anyOf: [{ type: 'number' }], oneOf: [{ type: 'number' }] },
    { anyOf: [{ type: 'number' }], allOf: [{ type: 'number' }] },
    { allOf: [{ type: 'number' }] },
  ];
  for (const branch of invalid) {
    const compiled = compile(
      { value: { anyOf: [{ type: 'number' }, branch, { type: 'null' }] } },
      {
        '#Safe': { type: 'number' },
        '#Cycle': { $ref: '#Cycle' },
        '#Recursive': { anyOf: [{ type: 'number' }, { $ref: '#Recursive' }] },
      },
    );
    assert.deepEqual(projectDraftValues(compiled, { value: 2 }).values, {}, JSON.stringify(branch));
  }
  for (const value of [
    { anyOf: [] },
    { anyOf: [{ type: 'number' }], oneOf: [{ type: 'number' }] },
    { anyOf: [{ type: 'number' }], allOf: [] },
    { anyOf: [{ type: 'object' }, { type: 'object' }, { type: 'null' }] },
    {
      type: ['number', 'object'],
      anyOf: [{ type: 'object', properties: { label: { type: 'string' } } }, { type: 'null' }],
    },
  ]) {
    assert.deepEqual(projectDraftValues(compile({ value }), { value: 2 }).values, {});
  }
});

test('draft nullable structural unions still reject unsafe or unresolved null alternatives', () => {
  const object = { type: 'object', properties: { label: { type: 'string' } } };
  for (const branch of [{ type: 'null', rest: { draft: false } }, { $ref: '#Missing' }]) {
    const compiled = compile({ value: { anyOf: [object, { type: 'null' }, branch] } });
    assert.deepEqual(projectDraftValues(compiled, { value: { label: 'no' } }).values, {});
  }
});

test('draft excludes JSX file/password/readonly renderers and obvious credential names', () => {
  const string = { type: 'string' };
  const compiled = compile({
    token: string,
    login_token: string,
    pin: string,
    tokenizer: string,
    code: string,
    monkey: string,
    upload: { ...string, rest: { render: { type: 'basic-file:formFieldFile' } } },
    masked: {
      ...string,
      rest: { render: { type: 'basic-input:formFieldInput', props: { type: 'password' } } },
    },
    readonly: {
      ...string,
      rest: { render: { type: 'basic-input:formFieldInput', props: { readonly: true } } },
    },
  });
  const values = Object.fromEntries(
    [
      'token',
      'login_token',
      'pin',
      'tokenizer',
      'code',
      'monkey',
      'upload',
      'masked',
      'readonly',
    ].map(key => [key, 'value']),
  );
  assert.deepEqual(projectDraftValues(compiled, values).values, {
    tokenizer: 'value',
    code: 'value',
    monkey: 'value',
  });
});

test('draft nullable objects and arrays preserve ordinary incomplete values', () => {
  const compiled = compile({
    nested: {
      anyOf: [
        { type: 'object', properties: { label: { type: 'string' }, password: { type: 'string' } } },
        { type: 'null' },
      ],
    },
    names: { type: ['array', 'null'], items: { type: 'string' } },
  });
  assert.deepEqual(
    projectDraftValues(compiled, {
      nested: { label: '', password: 'never' },
      names: ['one', undefined, ''],
    }).values,
    { nested: { label: '' }, names: ['one', null, ''] },
  );
  const projected = projectDraftValues(compiled, { nested: null, names: ['one', undefined, ''] });
  assert.deepEqual(restoreDraftValues(compiled, JSON.parse(JSON.stringify(projected)), {}), {
    nested: null,
    names: ['one', undefined, ''],
  });
});
