const path = require('path');
const { assert, app, mock, mm } = require('egg-mock/bootstrap');
const eventAppReady = 'eb:event:appReady';

before(done => {
  // session
  app.mockSession({});
  // wait app ready
  app.on(eventAppReady, () => {
    mock.restore();
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
      return app.meta.mockUtil.mockUrl(dirname, url);
    },
    mockInfo() {
      return app.meta.mockUtil.parseInfoFromPackage(dirname);
    },
  };
};
