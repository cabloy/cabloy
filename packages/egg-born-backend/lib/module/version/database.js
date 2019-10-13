const moment = require('moment');
const chalk = require('chalk');
const RDSClient = require('ali-rds');
const RDSConnection = require('ali-rds/lib/connection');

// RDSClient
RDSClient.prototype.getConnection = function() {
  return this.pool.getConnection().then(onConnection, onError);
  async function onConnection(conn) {
    const rdsConn = new RDSConnection(conn);
    if (!conn.__eb_inited) {
      await sessionVariablesSet(rdsConn);
      conn.__eb_inited = true;
    }
    return rdsConn;
  }
  function onError(err) {
    if (err.name === 'Error') {
      err.name = 'RDSClientGetConnectionError';
    }
    throw err;
  }
};

// database
module.exports = async function(app) {
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

async function sessionVariablesSet(rdsConn) {
  sessionVariableSet(rdsConn, 'SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
  sessionVariableSet(rdsConn, 'SET SESSION explicit_defaults_for_timestamp=ON');
}

async function sessionVariableSet(rdsConn, sql) {
  try {
    await rdsConn.query(sql);
    return true;
  } catch (error) {
    return false;
  }
}
