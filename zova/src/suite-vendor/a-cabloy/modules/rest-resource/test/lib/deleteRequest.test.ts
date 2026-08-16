import assert from 'node:assert/strict';
import test from 'node:test';

import { prepareDeleteRequestConfig } from '../../src/lib/deleteRequest.ts';

test('DELETE without a body preserves the prepared config', () => {
  const config = {
    baseURL: '/api',
    headers: { Authorization: 'Bearer token' },
  };

  const actual = prepareDeleteRequestConfig(config, undefined);

  assert.equal(actual, config);
  assert.equal('data' in actual, false);
});

test('DELETE forwards a supplied body through config.data', () => {
  const config = { baseURL: '/api' };
  const body = { reason: 'duplicate' };

  const actual = prepareDeleteRequestConfig(config, body);

  assert.deepEqual(actual, {
    ...config,
    data: body,
  });
});

test('DELETE preserves null as an intentional body', () => {
  const actual = prepareDeleteRequestConfig({ baseURL: '/api' }, null);

  assert.deepEqual(actual, {
    baseURL: '/api',
    data: null,
  });
});
