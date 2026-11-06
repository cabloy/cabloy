import type { Page, Request } from '@playwright/test';

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { EventEmitter } from 'node:events';
import test from 'node:test';

import { observeClientResources } from './clientResourceObservation.ts';

function fixture() {
  const frame = {};
  const page = Object.assign(new EventEmitter(), { mainFrame: () => frame });
  const body = Buffer.from('synthetic public script');
  const sha256 = createHash('sha256').update(body).digest('hex');
  const observer = observeClientResources(page as unknown as Page, 'https://example.invalid', [
    { label: 'entry', pathname: '/assets/entry.js', sha256 },
  ]);
  const request = (url = 'https://example.invalid/assets/entry.js', navigation = false) =>
    ({
      url: () => url,
      isNavigationRequest: () => navigation,
      frame: () => frame,
      resourceType: () => (navigation ? 'document' : 'script'),
      response: async () => ({ status: () => 200, body: async () => body }),
      failure: () => {
        throw new Error('Raw failure must not be inspected');
      },
    }) as unknown as Request;
  return { page, observer, request, sha256 };
}

test('selected resource hashes are scoped to documents without retaining URLs or bodies', async () => {
  const { page, observer, request, sha256 } = fixture();
  try {
    page.emit('request', request('https://example.invalid/private-document?token=private', true));
    const first = request();
    page.emit('request', first);
    page.emit('requestfinished', first);
    const snapshot = await observer.snapshot();
    assert.deepEqual(snapshot, {
      document: 1,
      dropped: 0,
      otherScripts: 0,
      records: [
        { document: 1, label: 'entry', status: 200, outcome: 'finished', sha256, matches: true },
      ],
    });
    page.emit('request', request('https://example.invalid/next', true));
    const failed = request();
    page.emit('request', failed);
    page.emit('requestfailed', failed);
    const next = await observer.snapshot();
    assert.equal(next.document, 2);
    assert.equal(next.records[0].document, 1);
    assert.equal(next.records[1].document, 2);
    assert.equal(next.records[1].outcome, 'failed');
    assert.doesNotMatch(JSON.stringify(next), /example|private|public script|assets/);
  } finally {
    observer.dispose();
  }
  for (const event of ['request', 'requestfinished', 'requestfailed', 'close']) {
    assert.equal(page.listenerCount(event), 0);
  }
});

test('revalidation and unavailable bodies stay unverified; only hashed bodies can mismatch', async () => {
  const { page, observer, request } = fixture();
  let revalidatedBodyReads = 0;
  try {
    page.emit('request', request('https://example.invalid/first', true));
    const initial = request();
    page.emit('request', initial);
    page.emit('requestfinished', initial);
    assert.equal((await observer.snapshot()).records[0].matches, true);

    page.emit('request', request('https://example.invalid/next', true));
    const revalidated = request();
    revalidated.response = async () =>
      ({
        status: () => 304,
        body: async () => {
          revalidatedBodyReads++;
          throw new Error('A 304 has no new body to hash');
        },
      }) as unknown as Awaited<ReturnType<Request['response']>>;
    page.emit('request', revalidated);
    page.emit('requestfinished', revalidated);

    const unavailable = request();
    unavailable.response = async () =>
      ({
        status: () => 200,
        body: async () => {
          throw new Error('Synthetic body unavailable');
        },
      }) as unknown as Awaited<ReturnType<Request['response']>>;
    page.emit('request', unavailable);
    page.emit('requestfinished', unavailable);
    const snapshot = await observer.snapshot();
    assert.equal(revalidatedBodyReads, 0);
    assert.deepEqual(snapshot.records.slice(1), [
      {
        document: 2,
        label: 'entry',
        status: 304,
        outcome: 'body-unavailable',
        sha256: null,
        matches: null,
      },
      {
        document: 2,
        label: 'entry',
        status: 200,
        outcome: 'body-unavailable',
        sha256: null,
        matches: null,
      },
    ]);
    const mismatches = (records: typeof snapshot.records) =>
      records.filter(record => record.document === snapshot.document && record.matches === false);
    assert.deepEqual(mismatches(snapshot.records), []);

    const changed = request();
    changed.response = async () =>
      ({
        status: () => 200,
        body: async () => Buffer.from('different public script'),
      }) as unknown as Awaited<ReturnType<Request['response']>>;
    page.emit('request', changed);
    page.emit('requestfinished', changed);
    const final = await observer.snapshot();
    assert.equal(mismatches(final.records).length, 1);
    assert.equal(final.records[3].outcome, 'finished');
    assert.equal(
      final.records[3].sha256,
      createHash('sha256').update('different public script').digest('hex'),
    );
  } finally {
    observer.dispose();
  }
});

test('unselected scripts are counts-only and selected history is bounded', async () => {
  const { page, observer, request } = fixture();
  try {
    for (const url of [
      'https://other.invalid/assets/entry.js',
      'https://example.invalid/assets/entry.js?token=private',
      'https://example.invalid/unknown.js',
    ]) {
      const ignored = request(url);
      ignored.response = async () => {
        throw new Error('Unselected body must not be read');
      };
      page.emit('request', ignored);
      page.emit('requestfinished', ignored);
    }
    for (let i = 0; i < 101; i++) {
      const resource = request();
      page.emit('request', resource);
      page.emit('requestfailed', resource);
    }
    const snapshot = await observer.snapshot();
    assert.equal(snapshot.otherScripts, 3);
    assert.equal(snapshot.records.length, 100);
    assert.equal(snapshot.dropped, 1);
    page.emit('close');
    assert.equal(page.listenerCount('request'), 0);
  } finally {
    observer.dispose();
  }
});
