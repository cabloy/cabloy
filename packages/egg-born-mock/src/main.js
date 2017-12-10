const moment = require('moment');
const chalk = require('chalk');
const { assert, app, mock, mm } = require('egg-mock/bootstrap');

before(async () => {
  const ctx = app.mockContext({ mockUrl: '/api/a/version/' });

  // drop old databases
  const dbs = await ctx.db.query('show databases like \'egg-born-test-%\'');
  for (const db of dbs) {
    const name = db[Object.keys(db)[0]];
    await ctx.db.query(`drop database \`${name}\``);
  }

  // create database
  const database = `egg-born-test-${moment().format('YYYYMMDD-HHmmss')}`;
  await ctx.db.query(`CREATE DATABASE \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

  // use database
  await ctx.db.query(`use \`${database}\``);
  console.log(chalk.cyan(`  database: ${database}`));

  // version check
  await app.meta.runSchedule('egg-born-module-a-version:versionCheck');

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
      const prefix = app.meta.mockUtil.parseUrlFromPackage(dirname);
      return url ? `${prefix}/${url}` : `${prefix}/`;
    },
    mockInfo() {
      return app.meta.mockUtil.parseInfoFromPackage(dirname);
    },
  };
};
