const moment = require('moment');
const chalk = require('chalk');

const transactionIsolationNames = [ 'transaction_isolation', 'tx_isolation' ];

async function transactionIsolationSet(app) {
  for (const name of transactionIsolationNames) {
    const transaction_isolation_cmd = `SET GLOBAL ${name}='READ-COMMITTED'`;
    try {
      await app.mysql.get('__ebdb').query(transaction_isolation_cmd);
      break;
    } catch (error) {
      if (error.code !== 'ER_UNKNOWN_SYSTEM_VARIABLE') {
        // throw error;
        // just console then pass
        console.log(chalk.red(transaction_isolation_cmd));
        break;
      }
    }
  }
}

async function transactionIsolationGet(app) {
  for (const name of transactionIsolationNames) {
    const transaction_isolation_cmd = `SELECT @@GLOBAL.${name} transaction_isolation`;
    try {
      const res = await app.mysql.get('__ebdb').query(transaction_isolation_cmd);
      const value = res[0] && res[0].transaction_isolation;
      return { name, value };
      break;
    } catch (error) {
      if (error.code !== 'ER_UNKNOWN_SYSTEM_VARIABLE') {
        throw error;
      }
    }
  }
}

module.exports = async function(app) {
  // isolation level
  if (app.meta.isLocal || app.meta.isTest) {
    await transactionIsolationSet(app);
  } else {
    const res = await transactionIsolationGet(app);
    if (!res) throw new Error('transactionIsolationGet error');
    if (res.value !== 'READ-COMMITTED') {
      const transaction_isolation_cmd = `SET GLOBAL ${res.name}='READ-COMMITTED'`;
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
      if (dbs.length === 0) {
        const database = `${dbPrefix}-${moment().format('YYYYMMDD-HHmmss')}`;
        await mysql.query(`CREATE DATABASE \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
        mysqlConfig.database = database;
      } else {
        const db = dbs[0];
        mysqlConfig.database = db[Object.keys(db)[0]];
      }
      // create test mysql
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
    await mysql.query(`CREATE DATABASE \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
    // create test mysql
    const mysqlConfig = app.config.mysql.clients.__ebdb;
    mysqlConfig.database = database;
    app.mysql.__ebdb_test = app.mysql.createInstance(mysqlConfig);
    // database ready
    console.log(chalk.cyan(`  database: ${database}`));
  }
};
