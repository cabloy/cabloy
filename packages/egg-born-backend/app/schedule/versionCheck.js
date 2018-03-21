const scheduleTestFn = require('../../lib/module/schedule/test.js');
const eventCheckReady = 'eb:event:version:checkReady';

module.exports = {
  schedule: {
    type: 'worker',
    immediate: true,
  },
  async task(ctx) {
    // version start
    await ctx.performAction({
      method: 'post',
      url: '/a/version/version/start',
    });
    // test
    if (ctx.app.meta.isTest) {
      // version init
      await ctx.performAction({
        method: 'post',
        url: '/a/version/version/check',
        body: {
          subdomain: '',
          password: '',
          scene: 'init',
        },
      });
      // version test
      await ctx.performAction({
        method: 'post',
        url: '/a/version/version/check',
        body: {
          scene: 'test',
        },
      });
    }
    // ready
    if (!ctx.app.meta.isTest) {
      // emit checkReady
      ctx.app.emit(eventCheckReady);
    } else {
      await scheduleTestFn(ctx.app);
    }
  },
};
