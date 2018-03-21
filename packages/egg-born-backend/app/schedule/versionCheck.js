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
    // emit checkReady
    ctx.app.emit(eventCheckReady);
  },
};
