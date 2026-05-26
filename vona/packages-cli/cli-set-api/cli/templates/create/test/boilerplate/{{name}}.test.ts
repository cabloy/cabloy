import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('<%=argv.name%>.test.ts', () => {
  it('action:<%=argv.name%>', async () => {
    await app.bean.executor.mockCtx(async () => {
      assert.equal(app.ctx.instanceName, '');
    });
  });
});
