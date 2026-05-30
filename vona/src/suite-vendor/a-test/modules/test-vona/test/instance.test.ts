import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('instance.test.ts', () => {
  it('action:instance:shareTest', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const scopeDatabase = app.scope('a-orm');
        const defaultClientName = scopeDatabase.service.database.getDefaultClientName();
        assert.equal(app.ctx.instanceName, 'shareTest');
        assert.equal(app.ctx.instance.name, 'shareTest');
        assert.equal(app.bean.database.current.clientName, defaultClientName);
        assert.equal(
          ['sqlite3', 'pg', 'mysql'].includes(app.bean.database.current.clientName),
          true,
        );
      },
      { instanceName: 'shareTest' as any },
    );
  });
  it('action:instance:isolateTest', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const scopeDatabase = app.scope('a-orm');
        const defaultClientName = scopeDatabase.service.database.getDefaultClientName();
        assert.equal(app.ctx.instanceName, 'isolateTest');
        assert.equal(app.ctx.instance.name, 'isolateTest');
        assert.equal(app.bean.database.current.clientName, defaultClientName);
        assert.equal(app.bean.database.current.clientName, 'isolateTest');
      },
      { instanceName: 'isolateTest' as any },
    );
  });
});
