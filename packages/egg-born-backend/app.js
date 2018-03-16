module.exports = app => {
  app.beforeStart(async () => {
    // dev/debug db
    if (app.meta.isLocal) {
      const mysqlConfig = app.config.mysql.clients.__ebdb;
      if (mysqlConfig.database === 'sys') {
        const mysql = app.mysql.get('__ebdb');
        const dbs = await mysql.query('show databases like \'egg-born-test-%\'');
        if (dbs.length === 0) throw new Error('run \'npm run test:backend\' first!');
        const db = dbs[0];
        mysqlConfig.database = db[Object.keys(db)[0]];
        app.mysql.__ebdb_test = app.mysql.createInstance(mysqlConfig);
      }
    }
  });
};
