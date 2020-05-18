module.exports = async function(app) {
  // run startups
  for (const key in app.meta.startups) {
    const startup = app.meta.startups[key];
    if (!startup.startup.disable) {
      await app.meta.runStartup(key);
    }
  }
  // version test
  if (app.meta.isTest) {
    // ctx
    const ctx = app.createAnonymousContext({
      method: 'post',
      url: '/api/a/version',
    });
    await ctx.performAction({
      subdomain: '',
      method: 'post',
      url: '/a/version/version/check',
      body: {
        scene: 'test',
      },
    });
  }
  // queue workers
  if (!app.meta.isTest) {
    app.meta._loadQueueWorkers();
  }
};
