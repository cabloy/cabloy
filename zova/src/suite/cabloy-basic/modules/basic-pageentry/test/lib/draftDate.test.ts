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

const dateTime = { type: 'string', format: 'date-time' } satisfies SchemaObject;
const iso = '2026-10-15T08:30:00.000Z';
const previous = '2026-10-14T08:30:00.000Z';

function compile(properties: Record<string, any>, refs: Record<string, SchemaObject> = {}) {
  return createDraftSchema(
    { type: 'object', properties },
    {
      scene: 'form',
      resolveSchema: reference => refs[reference],
      loadProperties(schema) {
        return Object.entries(schema.properties ?? {}).map(
          ([key, value]) => ({ ...value, key }) as ISchemaObjectExtensionField,
        );
      },
    },
  );
}

function roundTrip(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}

test('draft date-time encodes native Dates and recovers ISO strings over the edit baseline', () => {
  const compiled = compile({ trainingTime: dateTime });
  const projected = projectDraftValues(compiled, { trainingTime: new Date(iso) });
  assert.deepEqual(projected.values, { trainingTime: iso });
  const restored = restoreDraftValues(compiled, roundTrip(projected), {
    trainingTime: new Date(previous),
  });
  assert.deepEqual(restored, { trainingTime: iso });
  assert.deepEqual(projectDraftValues(compiled, restored), projected);
});

test('draft date-time supports safe refs and unambiguous nullable scalar unions', () => {
  for (const schema of [
    dateTime,
    { ...dateTime, type: ['string', 'null'] },
    { $ref: '#Date' },
    { $ref: '#Date', type: ['string', 'null'] },
    { anyOf: [dateTime, { type: 'null' }] },
    { oneOf: [{ $ref: '#Date' }, { const: null }] },
    { anyOf: [dateTime, { ...dateTime, minLength: 1 }, { enum: [null] }] },
    { anyOf: [{ anyOf: [dateTime, { type: 'null' }] }, { type: 'null' }] },
  ]) {
    const compiled = compile({ value: schema }, { '#Date': dateTime });
    assert.deepEqual(projectDraftValues(compiled, { value: new Date(iso) }).values, { value: iso });
    assert.deepEqual(
      restoreDraftValues(compiled, roundTrip(projectDraftValues(compiled, { value: null })), {}),
      { value: null },
    );
  }
});

test('draft date-time does not infer Date eligibility from ambiguous alternatives or metadata', () => {
  for (const schema of [
    { type: 'string' },
    { type: 'string', format: 'date' },
    { type: ['string', 'number'], format: 'date-time' },
    { enum: [iso], format: 'date-time' },
    { type: 'string', default: iso, rest: { render: 'basic-date:formFieldDate' } },
    { anyOf: [dateTime, { type: 'string' }] },
    { anyOf: [dateTime, { type: 'number' }, { type: 'null' }] },
    { anyOf: [dateTime, { type: 'string', format: 'date' }] },
    { $ref: '#Date', format: 'date' },
    { $ref: '#Date', type: 'number' },
    { type: 'number', anyOf: [dateTime, { type: 'null' }] },
    { format: 'date', anyOf: [dateTime, { type: 'null' }] },
    { type: 'object', properties: {} },
  ]) {
    const compiled = compile({ value: schema }, { '#Date': dateTime });
    assert.deepEqual(
      projectDraftValues(compiled, { value: new Date(iso) }).values,
      {},
      JSON.stringify(schema),
    );
  }
});

test('draft date-time keeps unfinished primitives and missing/undefined/null distinctions', () => {
  const compiled = compile({ value: dateTime });
  for (const value of ['', 'unfinished', '2026-10', iso, previous, false, 0, null, undefined]) {
    const projected = projectDraftValues(compiled, { value });
    assert.deepEqual(restoreDraftValues(compiled, roundTrip(projected), { value: previous }), {
      value,
    });
  }
  const baseline = new Date(previous);
  const restored = restoreDraftValues(compiled, projectDraftValues(compiled, {}), {
    value: baseline,
  });
  assert.deepEqual(restored, { value: baseline });
  assert.notEqual(restored?.value, baseline);
});

test('draft date-time uses native Date operations without running serialization hooks', () => {
  const compiled = compile({ value: dateTime });
  const fail = () => {
    throw new Error('Must not call user serialization');
  };
  const date = new Date(iso);
  date.toJSON = fail;
  date.toISOString = fail;
  date.getTime = fail;
  assert.deepEqual(projectDraftValues(compiled, { value: date }).values, { value: iso });
  for (const value of [
    new Date(Number.NaN),
    Object.create(Date.prototype),
    { toJSON: fail, toISOString: fail },
    [iso],
    new Map([['value', iso]]),
    Number.NaN,
    Infinity,
    2n,
  ]) {
    const projected = projectDraftValues(compiled, { value });
    assert.deepEqual(projected.values, {});
    assert.deepEqual(
      restoreDraftValues(compiled, { ...projected, values: { value } }, { value: previous }),
      { value: previous },
    );
  }
});

test('draft date-time retains exclusions on fields and every union/ref branch', () => {
  for (const metadata of [
    { readOnly: true },
    { writeOnly: true },
    { rest: { draft: false } },
    { rest: { readonly: true } },
    { rest: { render: 'basic-file:formFieldFile' } },
    { contentEncoding: 'base64' },
  ]) {
    for (const schema of [
      { ...dateTime, ...metadata },
      { $ref: '#Date', ...metadata },
      { anyOf: [dateTime, { type: 'null', ...metadata }] },
      { oneOf: [dateTime, { $ref: '#Unsafe' }] },
    ]) {
      const compiled = compile(
        { value: schema },
        { '#Date': dateTime, '#Unsafe': { ...dateTime, ...metadata } },
      );
      assert.deepEqual(projectDraftValues(compiled, { value: new Date(iso) }).values, {});
    }
  }
  assert.deepEqual(
    projectDraftValues(compile({ accessToken: dateTime }), { accessToken: new Date(iso) }).values,
    {},
  );
});

const record = {
  type: 'object',
  properties: {
    id: { type: 'number', readOnly: true },
    name: { type: 'string' },
    trainingTime: dateTime,
    serverTime: { ...dateTime, readOnly: true },
  },
};

test('draft nested relation dates retain row identity, clearing and detached baseline dates', () => {
  const compiled = compile({ trainingRecords: { type: 'array', items: record } });
  const baseline = {
    trainingRecords: [
      { id: 1, name: 'first', trainingTime: new Date(previous), serverTime: new Date(previous) },
      { id: 2, name: 'second', trainingTime: new Date(previous), serverTime: new Date(iso) },
    ],
  };
  const projected = projectDraftValues(
    compiled,
    {
      trainingRecords: [
        { id: 2, name: 'edited', trainingTime: new Date(iso), serverTime: new Date(0) },
        { id: 1, name: 'cleared', trainingTime: undefined },
        { name: 'new', trainingTime: new Date(iso) },
      ],
    },
    baseline,
  );
  assert.deepEqual(projected.values, {
    trainingRecords: [
      { name: 'edited', trainingTime: iso },
      { name: 'cleared' },
      { name: 'new', trainingTime: iso },
    ],
  });
  const restored = restoreDraftValues(compiled, roundTrip(projected), {
    trainingRecords: baseline.trainingRecords.toReversed(),
  });
  assert.deepEqual(restored, {
    trainingRecords: [
      { id: 2, name: 'edited', trainingTime: iso, serverTime: new Date(iso) },
      { id: 1, name: 'cleared', trainingTime: undefined, serverTime: new Date(previous) },
      { name: 'new', trainingTime: iso },
    ],
  });
  const serverTime = restored?.trainingRecords[0].serverTime;
  assert.notEqual(serverTime, baseline.trainingRecords[1].serverTime);
  serverTime?.setTime(0);
  assert.equal(baseline.trainingRecords[1].serverTime.toISOString(), iso);
  assert.equal(
    restoreDraftValues(compiled, roundTrip(projected), {
      trainingRecords: [baseline.trainingRecords[0]],
    }),
    undefined,
  );
});

test('draft baseline signatures include dates and retain relation reorder equivalence', () => {
  const compiled = compile({ trainingRecords: { type: 'array', items: record } });
  const rows = [
    { id: 1, name: 'first', trainingTime: new Date(previous) },
    { id: 2, name: 'second', trainingTime: new Date(iso) },
  ];
  const signature = draftBaselineSignature(compiled, { trainingRecords: rows });
  assert.equal(signature, draftBaselineSignature(compiled, { trainingRecords: rows.toReversed() }));
  assert.equal(signature, draftBaselineSignature(compiled, { trainingRecords: roundTrip(rows) }));
  assert.equal(
    signature,
    draftBaselineSignature(compiled, {
      trainingRecords: [rows[0], { ...rows[1], trainingTime: '2026-10-15T10:30:00+02:00' }],
    }),
  );
  assert.notEqual(
    signature,
    draftBaselineSignature(compiled, {
      trainingRecords: [rows[0], { ...rows[1], trainingTime: new Date(previous) }],
    }),
  );
  assert.equal(
    signature,
    draftBaselineSignature(compiled, {
      trainingRecords: rows.map(row => ({ ...row, serverTime: new Date(0) })),
    }),
  );
});

test('draft date-time codec changes compatibility without making labels significant', () => {
  const compiled = compile({ value: dateTime });
  assert.equal(
    compiled.signature,
    compile({ value: { ...dateTime, title: '培训时间' } }).signature,
  );
  assert.notEqual(compiled.signature, compile({ value: { type: 'string' } }).signature);
  // This same schema's descriptor before date-time projection had no codec marker.
  assert.notEqual(compiled.signature, '329e741252b60096');
});
