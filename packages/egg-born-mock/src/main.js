const moment = require('moment');
const chalk = require('chalk');
const { assert, app, mock, mm } = require('egg-mock/bootstrap');

const database = `egg-born-test-${moment().format('YYYYMMDD-HHmmss')}`;

before(function(done) {
  const ctx = app.mockContext({ mockUrl: '/api/a/version/' });

  // create database
  ctx.db.query(`CREATE DATABASE \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`).then(() => {
    // use database
    ctx.db.query(`use \`${database}\``).then(() => {
      console.log(chalk.cyan(`  database: ${database}`));
      app.meta.runSchedule('egg-born-module-a-version:versionCheck').then(() => {
        mock.restore();
        done();
      });
    });
  });
});

after(function(done) {
  const ctx = app.mockContext({ mockUrl: '/api/a/version/' });
  // drop database
  ctx.db.query(`DROP DATABASE \`${database}\``).then(() => {
    done();
  });
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
  };
};
