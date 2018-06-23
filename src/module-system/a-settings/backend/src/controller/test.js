const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {
  class TestController extends app.Controller {

    async settings() {

      // user

      // get settings from config
      let data = await this.ctx.meta.settings.getUser({ name: '/info/username' });
      assert(data === 'zhennann');
      data = await this.ctx.meta.settings.getUser({ name: '/extra/extra/info/language' });
      assert(data === 'en-us');

      // load settings
      data = await this.ctx.meta.settings.loadSettingsUser();
      assert(data.info.username === 'zhennann');
      // save settings
      data.extra.extra.info.language = 'zh-cn';
      await this.ctx.meta.settings.saveSettingsUser({ data });

      // get settings from db
      data = await this.ctx.meta.settings.getUser({ name: '/extra/extra/info/language' });
      assert(data === 'zh-cn');

      // instance

      // get settings from config
      data = await this.ctx.meta.settings.getInstance({ name: '/info/title' });
      assert(data === 'title1');

      // laod settings
      data = await this.ctx.meta.settings.loadSettingsInstance();
      assert(data.info.title === 'title1');
      // save settings
      data.info.title = 'title2';
      await this.ctx.meta.settings.saveSettingsInstance({ data });

      // get settings from db
      data = await this.ctx.meta.settings.getInstance({ name: '/info/title' });
      assert(data === 'title2');

      this.ctx.success();
    }

  }
  return TestController;
};

