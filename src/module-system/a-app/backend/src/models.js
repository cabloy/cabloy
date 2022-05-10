const appMenu = require('./model/appMenu.js');
const _app = require('./model/app.js');
const appContent = require('./model/appContent.js');
const appFull = require('./model/appFull.js');

module.exports = app => {
  const models = { appMenu, app: _app, appContent, appFull };
  return models;
};
