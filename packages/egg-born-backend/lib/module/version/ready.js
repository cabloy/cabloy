module.exports = async function(app) {
  // ctx
  const ctx = app.createAnonymousContext({
    method: 'post',
    url: '/api/a/version',
  });
  // run startups: all
  for (const key in app.meta.startups) {
    const startup = app.meta.startups[key];
    if (!startup.startup.disable && (startup.startup.type === 'all' || app.meta.isTest)) {
      await app.meta.runStartup(key);
    }
  }
  // version test
  if (app.meta.isTest) {
    await ctx.performAction({
      method: 'post',
      url: '/a/version/version/check',
      headers: {
        'x-inner-subdomain': '',
      },
      body: {
        scene: 'test',
      },
    });
  }
};
