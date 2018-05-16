const moment = require('moment');
const chalk = require('chalk');

module.exports = app => {
  // beforeStart
  app.beforeStart(async () => {
    // db prefix
    const dbPrefix = `egg-born-test-${app.name}`;
    // dev/debug db
    if (app.meta.isLocal) {
      const mysqlConfig = app.config.mysql.clients.__ebdb;
      if (mysqlConfig.database === 'sys') {
        const mysql = app.mysql.get('__ebdb');
        const dbs = await mysql.query(`show databases like \'${dbPrefix}-%\'`);
        if (dbs.length === 0) throw new Error('run \'npm run test:backend\' first!');
        const db = dbs[0];
        mysqlConfig.database = db[Object.keys(db)[0]];
        app.mysql.__ebdb_test = app.mysql.createInstance(mysqlConfig);
        // database ready
        console.log(chalk.cyan(`  database: ${mysqlConfig.database}`));
      }
    }
    // test db
    if (app.meta.isTest) {
      // drop old databases
      const mysql = app.mysql.get('__ebdb');
      const dbs = await mysql.query(`show databases like \'${dbPrefix}-%\'`);
      for (const db of dbs) {
        const name = db[Object.keys(db)[0]];
        await mysql.query(`drop database \`${name}\``);
      }
      // create database
      const database = `${dbPrefix}-${moment().format('YYYYMMDD-HHmmss')}`;
      await mysql.query(`CREATE DATABASE \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      // create test mysql
      const mysqlConfig = app.config.mysql.clients.__ebdb;
      mysqlConfig.database = database;
      app.mysql.__ebdb_test = app.mysql.createInstance(mysqlConfig);
      // database ready
      console.log(chalk.cyan(`  database: ${database}`));
    }
  });
};
