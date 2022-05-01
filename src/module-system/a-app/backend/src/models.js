const app = require('./model/app.js');
const appContent = require('./model/appContent.js');
const appFull = require('./model/appFull.js');

module.exports = app => {
  const models = {
    app,
    appContent,
    appFull,
  };
  return models;
};
