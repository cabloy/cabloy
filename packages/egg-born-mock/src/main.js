const moment = require('moment');
const chalk = require('chalk');
const path = require('path');
const { assert, app, mock, mm } = require('egg-mock/bootstrap');

before(async () => {
  // drop old databases
  const mysql = app.mysql.get('__ebdb');
  const dbs = await mysql.query('show databases like \'egg-born-test-%\'');
  for (const db of dbs) {
    const name = db[Object.keys(db)[0]];
    await mysql.query(`drop database \`${name}\``);
  }

  // create database
  const database = `egg-born-test-${moment().format('YYYYMMDD-HHmmss')}`;
  await mysql.query(`CREATE DATABASE \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

  // create test mysql
  const mysqlConfig = app.config.mysql.clients.__ebdb;
  mysqlConfig.database = database;
  app.mysql.__ebdb_test = app.mysql.createInstance(mysqlConfig);

  // database ready
  console.log(chalk.cyan(`  database: ${database}`));

  // session
  app.mockSession({});

  // ctx
  const ctx = app.mockContext({ mockUrl: '/api/a/version/' });

  // version check
  const pathVersionCheck = path.join(__dirname, '../../egg-born-backend/app/schedule/versionCheck.js');
  await app.runSchedule(pathVersionCheck);

  // version init
  await ctx.performAction({
    method: 'post',
    url: 'version/check',
    body: {
      subdomain: '',
      password: '',
      scene: 'init',
    },
  });

  // version test
  await ctx.performAction({
    method: 'post',
    url: 'version/check',
    body: {
      scene: 'test',
    },
  });

  // restore
  mock.restore();
});

module.exports = function(dirname) {
  return {
    assert,
    app,
    mock,
    mm,
    mockUrl(url) {
      return app.meta.mockUtil.mockUrl(dirname, url);
    },
    mockInfo() {
      return app.meta.mockUtil.parseInfoFromPackage(dirname);
    },
  };
};
