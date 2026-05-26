import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('static.test.ts', () => {
  it('action:static', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scopeTest = app.scope('test-vona');
      const url = scopeTest.static.get('img/vona.png');
      assert.equal(url, '/api/static/test/vona/img/vona.png');
    });
  });
  it('action:asset', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scopeTest = app.scope('test-vona');
      const file = scopeTest.asset.get('static', 'img/vona.png');
      assert.equal(file.includes('vona.png'), true);
      const file2 = scopeTest.asset.get('img', 'vona.png');
      assert.equal(file2.includes('vona.png'), true);
    });
  });
});
