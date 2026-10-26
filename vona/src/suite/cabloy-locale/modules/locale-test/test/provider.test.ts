import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('provider.test.ts', () => {
  it('provider: Japanese scoped lookup stays independent of disabled active language', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const scopeTest = app.scope('test-vona');
        assert.equal(Object.hasOwn(app.config.locale.items, 'ja-jp'), false);
        assert.equal(app.meta.modules['locale-jajp'].info.capabilities?.locale, true);
        assert.equal(scopeTest.locale.TestHelloWorld.locale('ja-jp'), 'こんにちは、世界');
        assert.equal(app.scope('home-base').locale.SiteAll.locale('ja-jp'), 'すべてのサイト');
        assert.equal(
          app.meta.text.locale('ja-jp', 'test-vona::TestHelloWorld'),
          'こんにちは、世界',
        );
        assert.equal(scopeTest.locale.TestApples_.locale('ja-jp', 0), 'りんごはありません');
        assert.equal(scopeTest.locale.TestApples_.locale('ja-jp', 1), 'りんご1個');
        assert.equal(scopeTest.locale.TestApples_.locale('ja-jp', 2), 'りんご2個');
        assert.equal(
          scopeTest.locale.TestNameApples_.locale('ja-jp', 'Mike', 2),
          'Mikeにはりんごが2個あります',
        );
        assert.equal(Object.hasOwn(app.meta.locales['ja-jp'], 'modules'), false);
        assert.equal(app.meta.localeModules['locale-jajp'], undefined);
        assert.equal(app.meta.text.locale('ja-jp', '404'), '見つかりません');
        assert.equal(scopeTest.locale.TestHelloWorld.locale('zh-cn'), '您好，世界');
        app.ctx.locale = 'ja-jp';
        assert.equal(app.ctx.locale, app.config.locale.default);
        assert.equal(app.meta.locale.current, app.config.locale.default);
        assert.equal(scopeTest.locale.TestHelloWorld(), 'Hello World');
        assert.equal(scopeTest.locale.TestHelloWorld.locale('ja-jp'), 'こんにちは、世界');
      },
      { locale: 'en-us' },
    );
  });

  it('provider: Traditional scoped lookup and core globals coexist with Japanese without enabling either', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const scopeTest = app.scope('test-vona');
        assert.equal(Object.hasOwn(app.config.locale.items, 'zh-tw'), false);
        assert.equal(app.meta.modules['locale-zhtw'].info.capabilities?.locale, true);
        assert.equal(scopeTest.locale.TestHelloWorld.locale('zh-tw'), '您好，世界');
        assert.equal(app.scope('home-base').locale.SiteAll.locale('zh-tw'), '所有網站');
        assert.equal(app.meta.text.locale('zh-tw', 'test-vona::TestHelloWorld'), '您好，世界');
        assert.equal(scopeTest.locale.TestApples_.locale('zh-tw', 0), '沒有蘋果');
        assert.equal(scopeTest.locale.TestApples_.locale('zh-tw', 1), '1 顆蘋果');
        assert.equal(scopeTest.locale.TestApples_.locale('zh-tw', 2), '2 顆蘋果');
        assert.equal(
          scopeTest.locale.TestNameApples_.locale('zh-tw', 'Mike', 2),
          'Mike 有 2 顆蘋果',
        );
        assert.equal(app.meta.text.locale('zh-tw', '404'), '找不到資源');
        assert.equal(Object.hasOwn(app.meta.locales['zh-tw'], 'modules'), false);
        assert.equal(app.meta.localeModules['locale-zhtw'], undefined);
        app.ctx.locale = 'zh-tw';
        assert.equal(app.ctx.locale, app.config.locale.default);
        assert.equal(app.meta.locale.current, app.config.locale.default);
        assert.equal(scopeTest.locale.TestHelloWorld(), 'Hello World');
        assert.equal(scopeTest.locale.TestHelloWorld.locale('zh-cn'), '您好，世界');
        assert.equal(scopeTest.locale.TestHelloWorld.locale('ja-jp'), 'こんにちは、世界');
        assert.equal(scopeTest.locale.TestHelloWorld.locale('zh-tw'), '您好，世界');
      },
      { locale: 'en-us' },
    );
  });
});
