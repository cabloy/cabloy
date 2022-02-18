let bundle = global.__egg_born_mock;
if (!bundle) {
  global.__egg_born_mock = bundle = require('@zhennann/egg-mock/bootstrap');
  const eventAppReady = 'eb:event:appReady';

  before(done => {
    // session
    bundle.app.mockSession({});
    // wait app ready
    bundle.app.on(eventAppReady, () => {
      bundle.mock.restore();
      done();
    });
  });
}

module.exports = function (dirname) {
  const { assert, app, mock, mm } = bundle;
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
