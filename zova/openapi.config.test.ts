import assert from 'node:assert/strict';
import { test } from 'node:test';

import { resolveOpenapiSource } from './openapi.config.ts';

test('prefers a complete non-empty OpenAPI source override', () => {
  assert.equal(
    resolveOpenapiSource('http://localhost:7102', '  https://example.test/openapi.json  '),
    'https://example.test/openapi.json',
  );
});

test('falls back to the API base URL for the default Swagger source', () => {
  assert.equal(
    resolveOpenapiSource('  http://localhost:7102/  ', '  '),
    'http://localhost:7102/swagger/json?version=V31',
  );
});

test('allows an override without an API base URL', () => {
  assert.equal(
    resolveOpenapiSource(undefined, 'https://example.test/swagger.json'),
    'https://example.test/swagger.json',
  );
});

test('requires an API base URL when no override is available', () => {
  assert.throws(() => resolveOpenapiSource('', ''), /Missing API_BASE_URL/);
});
