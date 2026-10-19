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
  it('normalizes static URL separators independently of the filesystem platform', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const staticPath of ['img/vona.png', 'img\\vona.png', 'img\\nested/../vona.png']) {
        assert.equal(
          app.util.combineStaticPath(staticPath, 'test-vona'),
          '/api/static/test/vona/img/vona.png',
        );
      }
      for (const provider of ['file-native', 'image-native']) {
        const staticPath = `/public/123/${provider}/default/test.png`;
        const expected = `/api/static${staticPath}`;
        assert.equal(app.util.combineStaticPath(staticPath), expected);
        assert.equal(app.util.combineStaticPath(staticPath.replace(/\//g, '\\')), expected);
      }
      assert.throws(() => app.util.combineStaticPath('img/vona.png'), /moduleName/);
      for (const staticPath of ['../outside.png', '..\\outside.png']) {
        assert.throws(() => app.util.combineStaticPath(staticPath, 'test-vona'), /unsafe path/);
      }
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
