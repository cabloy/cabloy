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
  // run immediate schedules: worker
  for (const key in app.meta.schedules) {
    const schedule = app.meta.schedules[key];
    const config = schedule.schedule;
    if (!config.disable && config.immediate2 && config.type === 'worker') {
      await app.meta.runSchedule(key);
    }
  }
};
