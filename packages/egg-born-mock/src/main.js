const path = require('path');
const { assert, app, mock, mm } = require('egg-mock/bootstrap');

before(async () => {
  // session
  app.mockSession({});
  // version check
  const pathVersionCheck = path.join(__dirname, '../../egg-born-backend/app/schedule/versionCheck.js');
  await app.runSchedule(pathVersionCheck);
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
