const { assert, app, mock, mm } = require('egg-mock/bootstrap');

before(function(done) {
  app.messenger.once('eb:module:a-version:check-ready', done);
});

module.exports = function(dirname) {

  return {
    assert,
    app,
    mock,
    mm,
    mockUrl(url) {
      const prefix = app.mockUtil.parseUrlFromPackage(dirname);
      return url ? `${prefix}${url}` : prefix;
    },
  };

};
