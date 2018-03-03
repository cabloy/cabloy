const eventCheckReady = 'eb:event:version:checkReady';

module.exports = {
  schedule: {
    type: 'worker',
    immediate: true,
  },
  async task(ctx) {
    // dev/debug db
    if (ctx.app.meta.isLocal) {
      const mysqlConfig = ctx.app.config.mysql.clients.__ebdb;
      if (mysqlConfig.database === 'sys') {
        const mysql = ctx.app.mysql.get('__ebdb');
        const dbs = await mysql.query('show databases like \'egg-born-test-%\'');
        if (dbs.length === 0) throw new Error('run \'npm run test:backend\' first!');
        const db = dbs[0];
        mysqlConfig.database = db[Object.keys(db)[0]];
        ctx.app.mysql.__ebdb_test = ctx.app.mysql.createInstance(mysqlConfig);
      }
    }
    // version start
    await ctx.performAction({
      method: 'post',
      url: '/a/version/version/start',
    });
    ctx.app.messenger.sendToApp(eventCheckReady);
  },
};
