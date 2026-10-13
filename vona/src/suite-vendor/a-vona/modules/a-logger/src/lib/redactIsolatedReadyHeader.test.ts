import assert from 'node:assert/strict';
import { test } from 'node:test';

import { redactIsolatedReadyHeader } from './redactIsolatedReadyHeader.ts';

test('redacts isolated readiness challenge and proof without changing live headers', () => {
  const runId = '20261014010203-a1b2c3d4';
  const req = { 'x-vona-test-challenge': 'challenge-value', 'accept': 'application/json' };
  const res = { 'x-vona-test-proof': 'proof-value', 'content-type': 'application/json' };
  const loggedReq = redactIsolatedReadyHeader(req, '/health/ready', runId, 'x-vona-test-challenge');
  const loggedRes = redactIsolatedReadyHeader(res, '/health/ready', runId, 'x-vona-test-proof');

  assert.equal(JSON.stringify(loggedReq).includes('challenge-value'), false);
  assert.equal(JSON.stringify(loggedRes).includes('proof-value'), false);
  assert.equal(loggedReq.accept, 'application/json');
  assert.equal(loggedRes['content-type'], 'application/json');
  assert.equal(req['x-vona-test-challenge'], 'challenge-value');
  assert.equal(res['x-vona-test-proof'], 'proof-value');
  assert.equal(redactIsolatedReadyHeader(req, '/health/live', runId, 'x-vona-test-challenge'), req);
  assert.equal(
    redactIsolatedReadyHeader(req, '/health/ready', undefined, 'x-vona-test-challenge'),
    req,
  );
});
