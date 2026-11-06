import type { Browser, BrowserContext, ConsoleMessage, Page, TestInfo } from '@playwright/test';

import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';

import { BrowserDiagnostics } from './browserDiagnostics.ts';

const safeEvents = [
  'synthetic.action entered',
  'synthetic.action allowed',
  'synthetic.action skipped reason=busy',
  'synthetic.request completed',
  'synthetic.refresh failed',
];

function fixture(events: readonly string[] = safeEvents) {
  const browser = new EventEmitter() as EventEmitter & { contexts: () => BrowserContext[] };
  const context = new EventEmitter();
  browser.contexts = () => [context as unknown as BrowserContext];
  const diagnostics = new BrowserDiagnostics(events);
  diagnostics.observeBrowser(browser as unknown as Browser);
  const page = {};
  const log = (text: string, type = 'log', target = context) => {
    target.emit('console', {
      type: () => type,
      text: () => text,
      page: () => page,
      args: () => {
        throw new Error('Console arguments must never be inspected');
      },
    } as unknown as ConsoleMessage);
  };
  return { browser, context, diagnostics, log, page };
}

test('browser diagnostics retain only configured literals and count errors without reading them', () => {
  const { browser, context, diagnostics, log } = fixture();
  try {
    diagnostics.observeBrowser(browser as unknown as Browser);
    browser.emit('context', context);
    assert.equal(context.listenerCount('console'), 1);
    log('timestamp debug [bean] synthetic.action entered token=private');
    log('synthetic.action skipped reason=busy');
    log('synthetic.request completed', 'debug');
    log('synthetic.refresh failed', 'info');
    log('arbitrary private console value');
    log('synthetic.action skipped reason=private');
    log('private browser error', 'error');
    context.emit('weberror', {
      error() {
        throw new Error('Raw errors must never be inspected');
      },
    });
    const summary = diagnostics.summary();
    assert.match(summary, /consoleErrors=1 pageErrors=1 dropped=0/);
    assert.match(summary, /page=1 synthetic.action entered/);
    assert.match(summary, /reason=busy/);
    assert.match(summary, /synthetic.request completed/);
    assert.match(summary, /synthetic.refresh failed/);
    assert.doesNotMatch(summary, /private|timestamp|\[bean\]|token=/);
    assert.equal(summary.split('\n').length, 5);
  } finally {
    diagnostics.dispose();
  }
  assert.equal(browser.listenerCount('context'), 0);
  assert.equal(context.listenerCount('console'), 0);
  assert.equal(context.listenerCount('weberror'), 0);
});

test('event readiness is scoped to the observed page and configured literal', () => {
  const { diagnostics, log, page } = fixture(['synthetic.observation ready']);
  const otherPage = {} as Page;
  try {
    assert.equal(diagnostics.hasEvent(otherPage, 'synthetic.observation ready'), false);
    log('synthetic.observation ready');
    assert.equal(diagnostics.hasEvent(otherPage, 'synthetic.observation ready'), false);
    assert.equal(diagnostics.hasEvent(page as Page, 'synthetic.observation ready'), true);
    assert.equal(diagnostics.hasEvent(page as Page, 'synthetic.observation'), false);
  } finally {
    diagnostics.dispose();
  }
});

test('default diagnostics count errors without reading console text', () => {
  const diagnostics = new BrowserDiagnostics();
  const context = new EventEmitter();
  const browser = new EventEmitter() as EventEmitter & { contexts: () => BrowserContext[] };
  browser.contexts = () => [context as unknown as BrowserContext];
  diagnostics.observeBrowser(browser as unknown as Browser);
  try {
    for (const type of ['log', 'debug', 'info', 'error']) {
      context.emit('console', {
        type: () => type,
        text: () => {
          throw new Error('Unconfigured console text must not be read');
        },
      } as unknown as ConsoleMessage);
    }
    context.emit('weberror');
    assert.equal(
      diagnostics.summary(),
      'browser diagnostics: consoleErrors=1 pageErrors=1 dropped=0',
    );
  } finally {
    diagnostics.dispose();
  }
});

test('configured events match literal punctuation and whitespace boundaries only', () => {
  const { diagnostics, log } = fixture(['', 'synthetic.task[1] (ready)?']);
  try {
    log('prefix syntheticXtask1 ready private');
    log('prefixsynthetic.task[1] (ready)?');
    log('synthetic.task[1] (ready)?suffix');
    log('prefix synthetic.task[1] (ready)? secret=private');
    assert.equal(diagnostics.summary().split('\n').length, 2);
    assert.ok(diagnostics.summary().endsWith('synthetic.task[1] (ready)?'));
    assert.doesNotMatch(diagnostics.summary(), /prefix|suffix|private|secret=/);
  } finally {
    diagnostics.dispose();
  }
});

test('new custom contexts are observed and retained history is bounded after context closure', () => {
  const { browser, context, diagnostics, log } = fixture();
  const extra = new EventEmitter();
  try {
    browser.emit('context', extra);
    for (let i = 0; i < 130; i++) log('synthetic.action entered', 'log', extra);
    extra.emit('close');
    assert.match(diagnostics.summary(), /dropped=30/);
    assert.equal(diagnostics.summary().split('\n').length, 101);
    assert.ok(Buffer.byteLength(diagnostics.summary()) < 32 * 1024);
    assert.equal(context.listenerCount('console'), 1);
  } finally {
    diagnostics.dispose();
  }
  assert.equal(extra.listenerCount('console'), 0);
  assert.equal(extra.listenerCount('weberror'), 0);
});

test('UTF-8 byte limits evict old records and oversized events preserve existing history', () => {
  const event = `synthetic.event ${'界'.repeat(2000)}`;
  const oversized = `synthetic.event ${'界'.repeat(12000)}`;
  const { diagnostics, log } = fixture([event, oversized]);
  try {
    for (let i = 0; i < 8; i++) log(event);
    const before = diagnostics.summary();
    assert.match(before, /dropped=3/);
    assert.equal(before.split('\n').length, 6);
    assert.ok(Buffer.byteLength(before) < 32 * 1024);
    log(oversized);
    const after = diagnostics.summary();
    assert.match(after, /dropped=4/);
    assert.deepEqual(after.split('\n').slice(1), before.split('\n').slice(1));
    assert.ok(Buffer.byteLength(after) < 32 * 1024);
  } finally {
    diagnostics.dispose();
  }
});

test('unexpected outcomes attach retained diagnostics and print only a short tail', async () => {
  const { diagnostics, log } = fixture();
  for (let i = 0; i < 25; i++) log('synthetic.action allowed');
  diagnostics.dispose();
  const attachments: string[] = [];
  const terminal: string[] = [];
  const info = {
    status: 'timedOut',
    expectedStatus: 'passed',
    testId: 'synthetic-test',
    retry: 0,
    project: { name: 'chromium' },
    attach: async (_name: string, options: { body: string }) => {
      attachments.push(options.body);
    },
  } as unknown as TestInfo;
  await diagnostics.report(info, 'synthetic-run', message => terminal.push(message));
  assert.equal(attachments.length, 1);
  assert.equal(attachments[0].split('\n').length, 27);
  assert.equal(terminal[0].split('\n').length, 22);
  assert.match(attachments[0], /synthetic-run/);
  info.status = 'passed';
  await diagnostics.report(info, 'synthetic-run', message => terminal.push(message));
  assert.equal(attachments.length, 1);
  assert.equal(terminal.length, 1);
});

test('attachment and terminal failures cannot replace an existing failure', async () => {
  const diagnostics = new BrowserDiagnostics();
  let terminalAttempted = false;
  await assert.doesNotReject(
    diagnostics.report(
      {
        status: 'failed',
        expectedStatus: 'passed',
        testId: 'synthetic-test',
        project: { name: 'chromium' },
        retry: 0,
        attach: async () => {
          throw new Error('Synthetic attachment failure');
        },
      } as unknown as TestInfo,
      'synthetic-run',
      () => {
        terminalAttempted = true;
        throw new Error('Synthetic terminal failure');
      },
    ),
  );
  assert.equal(terminalAttempted, true);
});
