import assert from 'node:assert/strict';
import test from 'node:test';

import type { ISchemaRefreshContext } from '../../src/lib/schemaRefresh.js';

import {
  createSchemaRefreshContract,
  schemaRefreshFingerprint,
  SchemaRefreshTracker,
} from '../../src/lib/schemaRefresh.js';

function contract(
  name: Record<string, unknown> = {},
  level: Record<string, unknown> = {},
  root: Record<string, unknown> = {},
) {
  const properties = { name: { type: 'string', ...name }, level: { type: 'number', ...level } };
  return createSchemaRefreshContract(
    { type: 'object', properties, ...root },
    Object.entries(properties).map(([key, property]) => ({ key, ...property })),
    () => undefined,
  );
}

function context(overrides: Partial<ISchemaRefreshContext> = {}): ISchemaRefreshContext {
  return {
    locale: 'en-us',
    identity: 'student:edit:1',
    epoch: 1,
    scene: 'form',
    contract: contract({ title: 'Name', errorMessage: { minLength: 'Too short' } }),
    configuration: 'default',
    enabled: true,
    eligible: true,
    ...overrides,
  };
}

const chinese = () => contract({ title: '姓名', errorMessage: { minLength: '太短' } });

test('normalizes only display strings on schema nodes, retaining message keys and raw validation', () => {
  const before = contract({
    title: 'Name',
    description: 'Student name',
    errorMessage: { minLength: 'Short' },
  });
  const after = contract({
    title: '姓名',
    description: '学生姓名',
    errorMessage: { minLength: '太短' },
  });
  assert.equal(before.ready, true);
  assert.equal(before.validation, after.validation);
  assert.notEqual(before.validationRaw, after.validationRaw);
  assert.notEqual(before.fields.name.raw, after.fields.name.raw);
  assert.equal(before.fields.name.compatible, after.fields.name.compatible);
  assert.notEqual(before.validation, contract({ errorMessage: { maximum: 'Short' } }).validation);
  for (const keyword of ['default', 'const', 'enum', 'examples', 'options', 'x-unknown']) {
    const a = contract({ [keyword]: { title: 'Name', description: 'English' } });
    const b = contract({ [keyword]: { title: '姓名', description: '中文' } });
    assert.notEqual(a.validation, b.validation, keyword);
    assert.notEqual(a.fields.name.compatible, b.fields.name.compatible, keyword);
  }
  assert.notEqual(contract({ title: 1 }).validation, contract({ title: 2 }).validation);
  assert.notEqual(
    contract({ errorMessage: 'English' }).validation,
    contract({ errorMessage: '中文' }).validation,
  );
});

test('serialization is sorted, detached, and distinguishes undefined from absent or null', () => {
  assert.equal(schemaRefreshFingerprint({ b: 2, a: 1 }), schemaRefreshFingerprint({ a: 1, b: 2 }));
  for (const other of [{}, { a: null }, { a: 'undefined' }]) {
    assert.notEqual(schemaRefreshFingerprint({ a: undefined }), schemaRefreshFingerprint(other));
  }
  const property = { key: 'name', type: 'string', default: { title: 'Original' } };
  const schema = { type: 'object', properties: { name: property } };
  const before = createSchemaRefreshContract(schema, [property], () => undefined);
  const signature = before.fields.name.raw;
  property.default.title = 'Changed';
  assert.equal(before.fields.name.raw, signature);
  assert.notEqual(
    before.validation,
    createSchemaRefreshContract(schema, [property], () => undefined).validation,
  );
  assert.notEqual(contract({ default: undefined }).validation, contract().validation);
});

test('parent required and unknown validation keywords invalidate every field', () => {
  const baseline = contract({}, {}, { required: ['name'] });
  assert.notEqual(baseline.validation, contract({}, {}, { required: ['level'] }).validation);
  assert.notEqual(baseline.validationRaw, contract({}, {}, { required: ['level'] }).validationRaw);
  assert.notEqual(
    contract({}, {}, { 'x-rule': 1 }).validation,
    contract({}, {}, { 'x-rule': 2 }).validation,
  );
  const tracker = new SchemaRefreshTracker();
  tracker.consume('level', context({ contract: baseline }));
  assert.deepEqual(
    tracker.consume(
      'level',
      context({ locale: 'zh-cn', contract: contract({}, {}, { required: ['level'] }) }),
    ),
    { changed: true, preserve: false },
  );
});

function studentRest(title: string) {
  return {
    render: {
      $$typeof: 'zova-jsx:component',
      type: 'training-student:formFieldLevel',
      props: {
        items: [{ value: 1, title }],
        placeholder: title,
      },
    },
  };
}

test('Student static JSX rest is strict per-field and does not block an independent name', () => {
  const before = contract({ title: 'Name' }, { rest: studentRest('Level') });
  const after = contract({ title: '姓名' }, { rest: studentRest('级别') });
  assert.equal(before.fields.name.eligible, true);
  assert.equal(before.validation, after.validation);
  assert.equal(before.behavior, after.behavior);
  assert.notEqual(before.fields.level.compatible, after.fields.level.compatible);
  const tracker = new SchemaRefreshTracker();
  tracker.consume('name', context({ contract: before }));
  tracker.consume('level', context({ contract: before }));
  assert.deepEqual(tracker.consume('name', context({ locale: 'zh-cn', contract: after })), {
    changed: true,
    preserve: true,
  });
  assert.deepEqual(tracker.consume('level', context({ locale: 'zh-cn', contract: after })), {
    changed: true,
    preserve: false,
  });
  assert.notEqual(
    contract({}, {}, { rest: { readonly: false } }).behavior,
    contract({}, {}, { rest: { readonly: true } }).behavior,
  );
  const ancestor = (readonly: boolean) =>
    createSchemaRefreshContract(
      {
        properties: {
          content: { type: 'object', rest: { readonly }, properties: { name: { type: 'string' } } },
        },
      },
      [{ key: 'content.name', type: 'string' }],
      () => undefined,
    );
  assert.equal(ancestor(false).validation, ancestor(true).validation);
  assert.notEqual(ancestor(false).behavior, ancestor(true).behavior);
});

test('opaque cross-field behavior or unknown rest fails preservation globally', () => {
  const cases = [
    { onEffect: 'handler' },
    { onEffect: () => {} },
    { evaluate: 'value + 1' },
    { commands: [] },
    { behaviors: {} },
    { unknown: 'opaque' },
    { visible: { unknown: 'opaque' } },
    { options: { unknown: 'opaque' } },
    { visible: 'cel://value.name != ""' },
    { render: { type: 'training-student:formFieldLevel', props: { onChange: 'handler' } } },
    { render: { type: 'component', props: { items: [{ title: 'cel://value.name' }] } } },
  ];
  for (const rest of cases) {
    const result = contract({}, { rest });
    assert.equal(result.ready, true);
    assert.equal(result.fields.name.eligible, false);
    assert.equal(result.fields.level.eligible, false);
  }
});

test('resolves supported schema positions, retaining ref identity and target changes', () => {
  const schema: Record<string, unknown> = {
    type: 'object',
    properties: { name: { $ref: '#/$defs/Name' } },
    $defs: { Name: { type: 'string', title: 'Name' } },
  };
  const build = () =>
    createSchemaRefreshContract(schema, [{ key: 'name', $ref: '#/$defs/Name' }], () => undefined);
  const before = build();
  (schema.$defs as any).Name.title = '姓名';
  const after = build();
  assert.equal(before.ready, true);
  assert.equal(before.validation, after.validation);
  assert.equal(before.fields.name.compatible, after.fields.name.compatible);
  assert.notEqual(before.fields.name.raw, after.fields.name.raw);
  (schema.$defs as any).Name.minLength = 3;
  assert.notEqual(after.validation, build().validation);
  const target = { type: 'string' };
  const ref = (name: string) =>
    createSchemaRefreshContract(
      { properties: { name: { $ref: name } } },
      [{ key: 'name', $ref: name }],
      () => target,
    );
  assert.notEqual(ref('A').validation, ref('B').validation);
  for (const keyword of [
    'items',
    'additionalProperties',
    'unevaluatedProperties',
    'contains',
    'not',
    'if',
    'then',
    'else',
    'propertyNames',
    'contentSchema',
  ]) {
    const result = contract({ [keyword]: { $ref: 'missing' } });
    assert.equal(result.ready, false, keyword);
  }
  for (const keyword of ['allOf', 'anyOf', 'oneOf', 'prefixItems']) {
    assert.equal(contract({ [keyword]: [{ $ref: 'missing' }] }).ready, false, keyword);
  }
  for (const keyword of [
    'properties',
    'patternProperties',
    '$defs',
    'definitions',
    'dependentSchemas',
    'dependencies',
  ]) {
    assert.equal(contract({ [keyword]: { child: { $ref: 'missing' } } }).ready, false, keyword);
  }
  // A business object containing $ref/title is data, not another schema node.
  assert.equal(contract({ default: { $ref: 'missing', title: 'Data' } }).ready, true);
});

test('unresolved refs defer, while cycles and runtime metadata remain changed but ineligible', () => {
  assert.equal(createSchemaRefreshContract({ $ref: 'missing' }, [], () => undefined).ready, false);
  const result = createSchemaRefreshContract(
    { $ref: 'A' },
    [{ key: 'name', type: 'string' }],
    () => ({ $ref: 'A' }),
  );
  assert.equal(result.ready, true);
  assert.equal(result.fields.name.eligible, false);
  const cyclic: any = { type: 'object' };
  cyclic.properties = { self: cyclic };
  const cycle = createSchemaRefreshContract(
    cyclic,
    [{ key: 'name', type: 'string' }],
    () => undefined,
  );
  assert.equal(cycle.ready, true);
  assert.equal(cycle.fields.name.eligible, false);
  const callback = () => {};
  assert.equal(contract({ default: { callback } }).fields.name.eligible, false);
  assert.equal(contract({ 'x-runtime': callback }).fields.name.eligible, false);
  assert.equal(schemaRefreshFingerprint(callback), schemaRefreshFingerprint(callback));
  assert.notEqual(
    schemaRefreshFingerprint(callback),
    schemaRefreshFingerprint(() => {}),
  );
  let invoked = false;
  const getter = {
    get title() {
      invoked = true;
      return 'Never read';
    },
  };
  schemaRefreshFingerprint(getter);
  const opaque = contract({ 'x-runtime': getter });
  assert.equal(invoked, false);
  assert.equal(opaque.fields.name.eligible, false);
});

test('canonical keys and aliases remain strict; duplicates fail closed', () => {
  const build = (aliases: Record<string, unknown>) =>
    createSchemaRefreshContract(
      { type: 'object' },
      [{ key: 'content.name', type: 'string', ...aliases }],
      () => undefined,
    );
  const a = build({ schemaKey: '_name', schemaKeys: ['alias'] });
  const b = build({ schemaKey: '_name', schemaKeys: ['other'] });
  assert.deepEqual(Object.keys(a.fields), ['content.name']);
  assert.notEqual(a.fields['content.name'].compatible, b.fields['content.name'].compatible);
  const duplicate = createSchemaRefreshContract(
    {},
    [{ key: 'name' }, { key: 'name' }],
    () => undefined,
  );
  assert.equal(duplicate.fields.name.eligible, false);
  assert.deepEqual(Object.keys(build({ key: '__proto__.name' }).fields), []);
});

test('tracker preserves eligible locale refresh only and does not overwrite on a loading gap', () => {
  const tracker = new SchemaRefreshTracker();
  assert.equal(tracker.has('name'), false);
  assert.deepEqual(tracker.consume('name', context()), { changed: false, preserve: false });
  assert.equal(tracker.has('name'), true);
  assert.deepEqual(
    tracker.consume('name', context({ locale: 'zh-cn', contract: { ready: false, fields: {} } })),
    { changed: false, preserve: false },
  );
  assert.deepEqual(tracker.consume('name', context({ locale: 'zh-cn', contract: chinese() })), {
    changed: true,
    preserve: true,
  });
  assert.deepEqual(tracker.consume('name', context({ locale: 'zh-cn', contract: chinese() })), {
    changed: false,
    preserve: false,
  });
  tracker.clear();
  assert.equal(tracker.has('name'), false);
});

test('tracker rejects epoch drift, absent identities, owner config and eligibility changes', () => {
  for (const overrides of [
    { epoch: 2 },
    { identity: undefined },
    { identity: 'student:create' },
    { scene: 'form-view' },
    { configuration: 'custom' },
    { enabled: false },
    { eligible: false },
    { contract: contract({ title: '姓名', minLength: 1 }) },
  ]) {
    const tracker = new SchemaRefreshTracker();
    tracker.consume('name', context());
    assert.deepEqual(
      tracker.consume('name', context({ locale: 'zh-cn', contract: chinese(), ...overrides })),
      { changed: true, preserve: false },
    );
  }
  const tracker = new SchemaRefreshTracker();
  tracker.consume('name', context());
  assert.deepEqual(tracker.consume('name', context({ epoch: 2 })), {
    changed: false,
    preserve: false,
  });
  assert.deepEqual(
    tracker.consume('name', context({ epoch: 2, locale: 'zh-cn', contract: chinese() })),
    { changed: true, preserve: true },
  );
});

test('tracker observes parent raw validation, field removal and manual field configuration', () => {
  const tracker = new SchemaRefreshTracker();
  tracker.consume(
    'level',
    context({ contract: contract({}, {}, { errorMessage: { required: 'Required' } }) }),
  );
  assert.deepEqual(
    tracker.consume(
      'level',
      context({ contract: contract({}, {}, { errorMessage: { required: '必须' } }) }),
    ),
    { changed: true, preserve: false },
  );
  tracker.consume('name', context());
  const empty = { ready: true, fields: {} };
  assert.deepEqual(tracker.consume('name', context({ contract: empty })), {
    changed: true,
    preserve: false,
  });
  assert.deepEqual(tracker.consume('manual', context({ contract: empty })), {
    changed: false,
    preserve: false,
  });
  assert.deepEqual(
    tracker.consume('manual', context({ contract: empty, configuration: 'other' })),
    { changed: true, preserve: false },
  );
});

function studentBlocks(title: string, permission = 'update') {
  return [
    {
      $$typeof: 'zova-jsx:block',
      render: 'basic-pageentry:blockPageEntry',
      options: {
        blocks: [
          {
            $$typeof: 'zova-jsx:block',
            render: 'basic-pageentry:blockForm',
            options: {
              blocks: [
                {
                  $$typeof: 'zova-jsx:block',
                  render: 'basic-form:blockFormLayout',
                  options: {
                    formLayout: {
                      children: [
                        {
                          type: 'tabs',
                          children: [
                            {
                              type: 'tab',
                              title,
                              children: [
                                {
                                  type: 'group',
                                  title,
                                  children: [
                                    {
                                      type: 'section',
                                      columns: { default: 1, md: 2 },
                                      children: [{ type: 'field', name: 'name' }],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $$typeof: 'zova-jsx:block',
            render: 'basic-pageentry:blockToolbarRow',
            options: {
              actions: [
                {
                  $$typeof: 'zova-jsx:actionRow',
                  name: 'submit',
                  render: 'basic-form:actionSubmit',
                  options: {
                    permission: { actionInherit: permission, formScene: ['create', 'edit'] },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ];
}

test('actual Student static blocks and table columnProps allow independent name across localized layout titles', () => {
  const student = (title: string, permission = 'update') =>
    contract(
      { title },
      {
        rest: {
          order: 5,
          form: {
            render: 'training-student:formFieldLevel',
            options: { items: [{ value: 1, title }], placeholder: title },
          },
          table: {
            render: 'training-student:level',
            columnProps: { items: [{ value: 1, title }] },
          },
        },
      },
      { rest: { blocks: studentBlocks(title, permission) } },
    );
  const before = student('Name');
  const after = student('姓名');
  assert.equal(before.fields.name.eligible, true);
  assert.equal(before.behavior, after.behavior);
  assert.notEqual(before.behaviorRaw, after.behaviorRaw);
  assert.notEqual(before.fields.level.compatible, after.fields.level.compatible);
  const tracker = new SchemaRefreshTracker();
  tracker.consume('name', context({ contract: before }));
  assert.deepEqual(tracker.consume('name', context({ locale: 'zh-cn', contract: after })), {
    changed: true,
    preserve: true,
  });
  assert.notEqual(after.behavior, student('姓名', 'create').behavior);
  const unknown = studentBlocks('Name');
  (unknown[0].options as any).unknown = { title: 'Name' };
  assert.equal(contract({}, {}, { rest: { blocks: unknown } }).fields.name.eligible, false);
  const effect = studentBlocks('Name');
  (effect[0].options as any).onEffect = 'callback';
  assert.equal(contract({}, {}, { rest: { blocks: effect } }).fields.name.eligible, false);
  const expression = studentBlocks('cel://value.name');
  assert.equal(contract({}, {}, { rest: { blocks: expression } }).fields.name.eligible, false);
});

test('layout exception never normalizes descriptions, actions, field names, or arbitrary titles', () => {
  const signature = (change: (blocks: any[]) => void) => {
    const blocks = studentBlocks('Name');
    change(blocks);
    return contract({}, {}, { rest: { blocks } });
  };
  const base = signature(() => {});
  const description = signature(blocks => {
    blocks[0].options.blocks[0].options.blocks[0].options.formLayout.children[0].children[0].children[0].description =
      'Translated';
  });
  assert.notEqual(base.behavior, description.behavior);
  const changedName = signature(blocks => {
    blocks[0].options.blocks[0].options.blocks[0].options.formLayout.children[0].children[0].children[0].children[0].children[0].name =
      'level';
  });
  assert.notEqual(base.behavior, changedName.behavior);
  const arbitraryTitle = signature(blocks => {
    blocks[0].options.title = 'Unknown';
  });
  assert.equal(arbitraryTitle.fields.name.eligible, false);
});

test('prune removes vanished schema fields only after readiness, retaining manual fields', () => {
  const tracker = new SchemaRefreshTracker();
  tracker.consume('name', context());
  tracker.consume('manual', context());
  tracker.prune({ ready: false, fields: {} });
  assert.equal(tracker.has('name'), true);
  tracker.prune({ ready: true, fields: {} });
  assert.equal(tracker.has('name'), false);
  assert.equal(tracker.has('manual'), true);
});

test('full Student static image options and nested details effects preserve independent name only', () => {
  const effect = () => {};
  const build = (
    title: string,
    details = true,
    direct = false,
    auxiliary: Record<string, unknown> = {},
  ) => {
    const fields = {
      _trainingRecords: {
        type: ['array', 'null'],
        rest: { visible: false },
        items: { $ref: '#/components/schemas/DetailRecord' },
        ...auxiliary,
      },
      name: {
        type: 'string',
        title,
        rest: {
          order: 1,
          table: {
            render: 'basic-table:actionView',
            align: 'left',
            width: 240,
            fixed: 'left',
            enableSorting: true,
            sortDescFirst: true,
          },
        },
      },
      level: {
        type: 'number',
        title,
        rest: {
          form: {
            render: 'training-student:formFieldLevel',
            options: { items: [{ value: 1, title }], placeholder: title },
          },
          table: {
            render: 'training-student:level',
            columnProps: { items: [{ value: 1, title }] },
          },
        },
      },
      imageId: {
        type: 'number',
        rest: {
          form: {
            render: 'basic-image:formFieldImage',
            options: {
              imageScene: 'training-student:studentImage',
              enableCrop: true,
              cropAspectRatio: 1,
              relationName: 'image',
              resize: { width: 512, height: 512, fit: 'cover', format: 'jpeg', quality: 90 },
            },
          },
          table: { render: 'basic-image:image', columnProps: { relationName: 'image' } },
        },
      },
      trainingRecords: {
        type: 'array',
        rest: {
          form: { render: details ? 'basic-details:formFieldDetails' : 'other:formFieldObject' },
          ...(direct ? { onEffect: effect } : {}),
        },
        items: {
          type: 'object',
          properties: {
            trainingRecordSubjects: {
              type: 'array',
              rest: { form: { render: 'basic-details:formFieldDetails' }, onEffect: effect },
              items: { type: 'string' },
            },
          },
        },
      },
    };
    return createSchemaRefreshContract(
      { type: 'object', properties: fields, rest: { blocks: studentBlocks(title) } },
      Object.entries(fields).map(([key, property]) => ({ key, ...property })),
      () => ({
        type: 'object',
        rest: { blocks: [{ render: 'basic-details:blockForm', options: { dialogOptions: {} } }] },
        properties: {
          nested: { type: 'string', rest: { onEffect: effect } },
        },
      }),
    );
  };
  const before = build('Name');
  const after = build('姓名');
  assert.equal(before.fields.name.eligible, true);
  assert.equal(before.fields.imageId.eligible, true);
  assert.equal(before.fields.trainingRecords.eligible, false);
  assert.equal(before.fields._trainingRecords.eligible, false);
  assert.equal(build('Name', true, false, { type: 'array' }).fields.name.eligible, true);
  assert.equal(build('Name', true, false, { type: ['null', 'array'] }).fields.name.eligible, true);
  for (const type of [['array', 'string'], ['array', 'null', 'string'], ['array'], 'object']) {
    assert.equal(build('Name', true, false, { type }).fields.name.eligible, false);
  }
  assert.notEqual(before.validation, build('Name', true, false, { type: 'array' }).validation);
  assert.equal(build('Name', true, false, { rest: { visible: true } }).fields.name.eligible, false);
  assert.equal(build('Name', true, false, { key: '_unrelated' }).fields.name.eligible, false);
  assert.equal(
    build('Name', true, false, { items: { type: 'object', rest: { onEffect: effect } } }).fields
      .name.eligible,
    false,
  );
  const tracker = new SchemaRefreshTracker();
  tracker.consume('name', context({ contract: before }));
  assert.deepEqual(tracker.consume('name', context({ locale: 'zh-cn', contract: after })), {
    changed: true,
    preserve: true,
  });
  assert.equal(build('Name', false).fields.name.eligible, false);
  assert.equal(build('Name', true, true).fields.name.eligible, false);
});
