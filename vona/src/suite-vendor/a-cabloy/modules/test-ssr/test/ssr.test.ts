import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('ssr.test.ts', () => {
  it('action:ssr:retrieveMenus:en-us', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        // // publicPath
        // let menus = await app.bean.menu.retrieveMenus();
        // let menu = menus.menus?.find(item => item.title === 'Home');
        // assert.equal(!!menu, true);
        // let group = menus.groups?.find(item => item.title === 'Tools');
        // assert.equal(!!group, false);
        // publicPath: second
        const menus = await app.bean.ssr.retrieveMenus('second');
        const menu = menus!.menus?.find(item => item.title === 'Home');
        assert.equal(!!menu, false);
        const group = menus!.groups?.find(item => item.title === 'Tools');
        assert.equal(!!group, true);
      },
      { locale: 'en-us' },
    );
  });
  it('action:ssr:retrieveMenus:zh-cn', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        // // publicPath
        // let menus = await app.bean.menu.retrieveMenus();
        // let menu = menus.menus?.find(item => item.title === '首页');
        // assert.equal(!!menu, true);
        // let group = menus.groups?.find(item => item.title === '工具');
        // assert.equal(!!group, false);
        // publicPath: second
        const menus = await app.bean.ssr.retrieveMenus('second');
        const menu = menus!.menus?.find(item => item.title === '首页');
        assert.equal(!!menu, false);
        const group = menus!.groups?.find(item => item.title === '工具');
        assert.equal(!!group, true);
      },
      { locale: 'zh-cn' },
    );
  });
});
