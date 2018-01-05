const eventCheckReady = 'eb:event:version:checkReady';

module.exports = {
  schedule: {
    type: 'worker',
    immediate: true,
  },
  async task(ctx) {
    await ctx.performAction({
      method: 'post',
      url: '/a/version/version/start',
    });
    ctx.app.messenger.sendToApp(eventCheckReady);
  },
};
