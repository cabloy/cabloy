const moment = require('moment');
const chalk = require('chalk');

module.exports = async function(app) {
  // isolation level
  const transaction_isolation_cmd = 'SET GLOBAL transaction_isolation=\'READ-COMMITTED\'';
  if (app.meta.isLocal || app.meta.isTest) {
    await app.mysql.get('__ebdb').query(transaction_isolation_cmd);
  } else {
    const res = await app.mysql.get('__ebdb').query('SELECT @@GLOBAL.transaction_isolation transaction_isolation');
    const transaction_isolation = res[0] && res[0].transaction_isolation;
    if (transaction_isolation !== 'READ-COMMITTED') {
      console.log(chalk.red(transaction_isolation_cmd));
      throw new Error(transaction_isolation_cmd);
    }
  }
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
};
