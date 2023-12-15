module.exports = function (app, meta) {
  // isProd
  meta.isProd = app.config.env !== 'local' && app.config.env !== 'unittest' && app.config.env !== 'test';
  // isTest
  meta.isTest = app.config.env === 'unittest' || app.config.env === 'test';
  // isLocal
  meta.isLocal = app.config.env === 'local';
};
