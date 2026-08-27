import type { IFormLayout, ISchemaObjectExtensionField } from 'zova-module-a-openapi';

import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveFormLayout } from '../../src/lib/formLayout.js';

function createProperties(...properties: ISchemaObjectExtensionField[]) {
  return properties;
}

function createTabsLayout(name: string): IFormLayout {
  return {
    children: [
      {
        type: 'tabs',
        children: [
          {
            type: 'tab',
            title: 'Content',
            children: [{ type: 'section', children: [{ type: 'field', name }] }],
          },
        ],
      },
    ],
  };
}

function getTabFieldNames(resolved: ReturnType<typeof resolveFormLayout>) {
  const tabs = resolved.children[0] as any;
  return tabs.children[0].children[0].children.map((item: any) => item.name);
}

test('Form Layout resolves a real relation name to its unique canonical source', () => {
  const resolved = resolveFormLayout(
    createTabsLayout('content'),
    createProperties({ key: 'content.descriptionMarkdown', type: 'string' }),
  );

  assert.deepEqual(getTabFieldNames(resolved), ['content.descriptionMarkdown']);
  assert.deepEqual(resolved.fieldTabPaths, {
    'content.descriptionMarkdown': [{ tabsId: 'tabs-0', tabId: 'tab-0-0' }],
  });
  assert.deepEqual(resolved.diagnostics, []);
});

test('Form Layout resolves a virtual schema alias to its canonical source', () => {
  const resolved = resolveFormLayout(
    createTabsLayout('_descriptionMarkdown'),
    createProperties({
      key: 'content.descriptionMarkdown',
      schemaKey: '_descriptionMarkdown',
      type: 'string',
    }),
  );

  assert.deepEqual(getTabFieldNames(resolved), ['content.descriptionMarkdown']);
  assert.deepEqual(resolved.fieldTabPaths, {
    'content.descriptionMarkdown': [{ tabsId: 'tabs-0', tabId: 'tab-0-0' }],
  });
  assert.deepEqual(resolved.diagnostics, []);
});

test('Form Layout accepts every preserved alias for the same canonical source', () => {
  const resolved = resolveFormLayout(
    createTabsLayout('studentContentForm'),
    createProperties({
      key: 'content.descriptionMarkdown',
      schemaKey: '_descriptionMarkdown',
      schemaKeys: ['studentContentForm'],
      type: 'string',
    }),
  );

  assert.deepEqual(getTabFieldNames(resolved), ['content.descriptionMarkdown']);
  assert.deepEqual(resolved.diagnostics, []);
});

test('Form Layout prefers an exact canonical field over a colliding alias', () => {
  const resolved = resolveFormLayout(
    { children: [{ type: 'field', name: 'content' }] },
    createProperties(
      { key: 'content', type: 'object' },
      {
        key: 'content.descriptionMarkdown',
        schemaKey: 'content',
        type: 'string',
      },
    ),
  );

  assert.deepEqual(resolved.children, [
    { type: 'field', name: 'content' },
    { type: 'field', name: 'content.descriptionMarkdown' },
  ]);
  assert.deepEqual(resolved.diagnostics, []);
});

test('Form Layout detects duplicate alias and canonical declarations by canonical key', () => {
  const resolved = resolveFormLayout(
    {
      children: [
        { type: 'field', name: '_descriptionMarkdown' },
        { type: 'field', name: 'content.descriptionMarkdown' },
      ],
    },
    createProperties({
      key: 'content.descriptionMarkdown',
      schemaKey: '_descriptionMarkdown',
      type: 'string',
    }),
  );

  assert.deepEqual(resolved.children, [{ type: 'field', name: 'content.descriptionMarkdown' }]);
  assert.deepEqual(resolved.diagnostics, [
    { type: 'duplicateField', value: 'content.descriptionMarkdown' },
  ]);
});

test('Form Layout keeps ambiguous aliases and relation prefixes unknown', () => {
  const resolved = resolveFormLayout(
    {
      children: [
        { type: 'field', name: '_content' },
        { type: 'field', name: 'content' },
      ],
    },
    createProperties(
      { key: 'content.descriptionMarkdown', schemaKey: '_content', type: 'string' },
      { key: 'content.descriptionHtml', schemaKey: '_content', type: 'string' },
    ),
  );

  assert.deepEqual(resolved.children, [
    { type: 'field', name: 'content.descriptionMarkdown' },
    { type: 'field', name: 'content.descriptionHtml' },
  ]);
  assert.deepEqual(resolved.diagnostics, [
    { type: 'unknownField', value: '_content' },
    { type: 'unknownField', value: 'content' },
  ]);
});

test('Form Layout does not resolve or append invisible aliases', () => {
  const resolved = resolveFormLayout(
    { children: [{ type: 'field', name: '_descriptionMarkdown' }] },
    createProperties({
      key: 'content.descriptionMarkdown',
      schemaKey: '_descriptionMarkdown',
      type: 'string',
      rest: { visible: false },
    }),
  );

  assert.deepEqual(resolved.children, []);
  assert.deepEqual(resolved.diagnostics, [{ type: 'unknownField', value: '_descriptionMarkdown' }]);
});
