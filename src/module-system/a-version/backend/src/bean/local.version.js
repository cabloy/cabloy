const require3 = require('require3');
const moment = require3('moment');
const chalk = require3('chalk');

module.exports = app => {
  class Version extends app.meta.BeanBase {

    async databaseInitStartup() {
      // database
      await this.__database();
      // version start
      await this.ctx.performAction({
        method: 'post',
        url: '/a/version/version/start',
      });
    }

    async databaseNameStartup() {
      // database
      await this.__database();
    }

    async __database() {
      // db prefix
      const dbPrefix = `egg-born-test-${app.name}`;
      // dev/debug db
      if (app.meta.isLocal) {
        const mysqlConfig = app.config.mysql.clients.__ebdb;
        if (mysqlConfig.database === 'sys' && !app.mysql.__ebdb_test) {
          let databaseName;
          const mysql = app.mysql.get('__ebdb');
          const dbs = await mysql.query(`show databases like \'${dbPrefix}-%\'`);
          if (dbs.length === 0) {
            databaseName = `${dbPrefix}-${moment().format('YYYYMMDD-HHmmss')}`;
            await mysql.query(`CREATE DATABASE \`${databaseName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
          } else {
            const db = dbs[0];
            databaseName = db[Object.keys(db)[0]];
          }
          // create test mysql
          mysqlConfig.database = databaseName;
          app.mysql.__ebdb_test = app.mysql.createInstance(mysqlConfig);// database ready
          console.log(chalk.cyan(`  database: ${mysqlConfig.database}`));
        }
      }
      // test db
      if (app.meta.isTest && !app.mysql.__ebdb_test) {
        // drop old databases
        const mysql = app.mysql.get('__ebdb');
        const dbs = await mysql.query(`show databases like \'${dbPrefix}-%\'`);
        for (const db of dbs) {
          const name = db[Object.keys(db)[0]];
          await mysql.query(`drop database \`${name}\``);
        }
        // create database
        const databaseName = `${dbPrefix}-${moment().format('YYYYMMDD-HHmmss')}`;
        await mysql.query(`CREATE DATABASE \`${databaseName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
        // create test mysql
        const mysqlConfig = app.config.mysql.clients.__ebdb;
        mysqlConfig.database = databaseName;
        app.mysql.__ebdb_test = app.mysql.createInstance(mysqlConfig);
        // database ready
        console.log(chalk.cyan(`  database: ${mysqlConfig.database}`));
      }
    }

  }

  return Version;
};
