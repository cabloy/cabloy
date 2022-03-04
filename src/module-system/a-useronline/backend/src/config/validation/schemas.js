const userOnline = require('./schema/userOnline.js');
const userOnlineHistory = require('./schema/userOnlineHistory.js');

module.exports = app => {
  const schemas = {};
  // userOnline
  Object.assign(schemas, userOnline(app));
  // userOnlineHistory
  Object.assign(schemas, userOnlineHistory(app));
  // ok
  return schemas;
};
