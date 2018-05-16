module.exports = async function(app) {
  // ctx
  const ctx = app.createAnonymousContext({
    method: 'post',
    url: '/api/a/version',
  });
  // version init
  if (app.meta.isTest) {
    await ctx.performAction({
      method: 'post',
      url: '/a/version/version/check',
      headers: {
        'x-inner-subdomain': '',
      },
      body: {
        subdomain: '',
        password: '',
        scene: 'init',
      },
    });
  }
  // run immediate schedules
  for (const key in app.meta.schedules) {
    const schedule = app.meta.schedules[key];
    const config = schedule.schedule;
    if (!config.disable && config.immediate2) {
      await app.meta.runSchedule(key);
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
