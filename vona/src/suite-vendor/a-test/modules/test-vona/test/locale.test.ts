import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app, mockModuleInfo } from 'vona-mock';

import { __ThisModule__ } from '../src/.metadata/this.ts';

describe('locale.test.ts', () => {
  it('action:locale', async () => {
    const moduleInfo = mockModuleInfo();
    assert.equal(moduleInfo.relativeName, __ThisModule__);
    await app.bean.executor.mockCtx(
      async () => {
        const ctx = app.ctx;
        // ctx.locale
        assert.equal(ctx.locale, 'zh-cn');
        // getText
        assert.equal(
          app.meta.locale.getText(false, moduleInfo.relativeName, ctx.locale, 'TestHelloWorld'),
          '您好，世界',
        );
        assert.equal(
          app.meta.locale.getText(false, undefined, ctx.locale, 'test-vona::TestHelloWorld'),
          '您好，世界',
        );
        // scope locale
        const scopeTest = app.scope('test-vona');
        assert.equal(scopeTest.locale.TestHelloWorld(), '您好，世界');
      },
      { locale: 'zh-cn' },
    );
  });

  it('action:locale:plurals', async () => {
    await app.bean.executor.mockCtx(async () => {
      // scope
      const scopeTest = app.scope('test-vona');
      // english
      assert.equal(scopeTest.locale.TestApples_.locale('en-us', 0), 'no apples');
      assert.equal(scopeTest.locale.TestApples_.locale('en-us', 1), 'one apple');
      assert.equal(scopeTest.locale.TestApples_.locale('en-us', 2), '2 apples');
      // chinese
      assert.equal(scopeTest.locale.TestApples_.locale('zh-cn', 0), '没有苹果');
      assert.equal(scopeTest.locale.TestApples_.locale('zh-cn', 1), '1个苹果');
      assert.equal(scopeTest.locale.TestApples_.locale('zh-cn', 2), '2个苹果');
      // english
      assert.equal(
        scopeTest.locale.TestNameApples_.locale('en-us', 'Mike', 0),
        'Mike has no apples',
      );
      assert.equal(
        scopeTest.locale.TestNameApples_.locale('en-us', 'Mike', 1),
        'Mike has one apple',
      );
      assert.equal(
        scopeTest.locale.TestNameApples_.locale('en-us', 'Mike', 2),
        'Mike has 2 apples',
      );
      // chinese
      assert.equal(scopeTest.locale.TestNameApples_.locale('zh-cn', 'Mike', 0), 'Mike没有苹果');
      assert.equal(scopeTest.locale.TestNameApples_.locale('zh-cn', 'Mike', 1), 'Mike有1个苹果');
      assert.equal(scopeTest.locale.TestNameApples_.locale('zh-cn', 'Mike', 2), 'Mike有2个苹果');
    });
  });
});
