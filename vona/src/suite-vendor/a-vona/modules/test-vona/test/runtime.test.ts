import fse from 'fs-extra';
import assert from 'node:assert';
import path from 'node:path';
import { describe, it } from 'node:test';
import { loadJSONFile } from 'vona';
import { app } from 'vona-mock';

describe('runtime.test.ts', () => {
  it('action:runtime', async () => {
    await app.bean.executor.mockCtx(async () => {
      const runtimeFile = path.join(app.projectPath, '.app/runtime/-.json');
      if (!fse.existsSync(runtimeFile)) throw new Error('dev server not running');
      const runtime = await loadJSONFile(runtimeFile);
      const runtimeUser = runtime['a-user'];
      // isAuthenticated: isolate + header
      const isAuthenticated = await app.bean.executor.newCtxIsolate(async () => {
        return await app.bean.executor.performAction('get', '/test/vona/passport/isAuthenticated', {
          authToken: runtimeUser?.accessToken,
        });
      });
      assert.equal(isAuthenticated, true);
    });
  });
});
