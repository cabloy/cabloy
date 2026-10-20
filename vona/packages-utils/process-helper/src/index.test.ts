import assert from 'node:assert/strict';
import ChildProcess from 'node:child_process';
import { PassThrough } from 'node:stream';
import { describe, it } from 'node:test';

import { ProcessHelper } from './index.ts';

describe('ProcessHelper child termination', { concurrency: false }, () => {
  for (const { code, signal } of [
    { code: 0, signal: null },
    { code: 7, signal: null },
    { code: null, signal: 'SIGKILL' },
    { code: null, signal: null },
  ] as const) {
    it(`handles exit code ${code} and signal ${signal}`, async t => {
      const child = new ChildProcess.ChildProcess();
      t.mock.method(ChildProcess, 'spawn', () => child);
      const result = new ProcessHelper().spawn({ cmd: 'test-owned-command' });
      child.emit('exit', code, signal);
      if (code === 0) {
        assert.equal(await result, '');
      } else {
        await assert.rejects(result, (error: Error & { code?: number; signal?: string }) => {
          if (code !== null) {
            assert.equal(error.code, 10000 + code);
            assert.match(error.message, /exit code: 7/);
          } else {
            assert.equal(error.signal, signal);
            assert.match(error.message, signal ? /SIGKILL/ : /exit code: null/);
          }
          return true;
        });
      }
    });
  }

  it('retains the termination signal alongside stderr', async t => {
    const child = new ChildProcess.ChildProcess();
    child.stderr = new PassThrough();
    t.mock.method(ChildProcess, 'spawn', () => child);
    const helper = new ProcessHelper();
    t.mock.method(helper.console, 'log', async () => {});
    const result = helper.spawn({ cmd: 'test-owned-command' });
    child.stderr.emit('data', Buffer.from('controlled_stderr'));
    child.emit('exit', null, 'SIGTERM');
    await assert.rejects(result, (error: Error & { signal?: string }) => {
      assert.equal(error.signal, 'SIGTERM');
      assert.match(error.message, /controlled_stderr/);
      assert.match(error.message, /SIGTERM/);
      return true;
    });
  });

  it('preserves spawn failures', async t => {
    const child = new ChildProcess.ChildProcess();
    t.mock.method(ChildProcess, 'spawn', () => child);
    const failure = new Error('controlled_spawn_failure');
    const result = new ProcessHelper().spawn({ cmd: 'test-owned-command' });
    child.emit('error', failure);
    await assert.rejects(result, error => error === failure);
  });
});
