module.exports = async function(app) {
  // ctx
  const ctx = app.createAnonymousContext({
    method: 'post',
    url: '/api/a/version',
  });
  // version start
  await ctx.performAction({
    method: 'post',
    url: '/a/version/version/start',
  });
  // run startups: worker
  for (const key in app.meta.startups) {
    const startup = app.meta.startups[key];
    if (!startup.startup.disable && startup.startup.type === 'worker') {
      await app.meta.runStartup(key);
    }
  }
};
