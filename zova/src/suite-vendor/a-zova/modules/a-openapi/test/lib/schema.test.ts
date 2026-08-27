import assert from 'node:assert/strict';
import test from 'node:test';

import type { ISchemaObjectExtensionField } from '../../src/types/rest.js';

import { loadSchemaProperties } from '../../src/lib/schema.js';

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
              rest: { render: 'start-markdown:formFieldMarkdown' },
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
