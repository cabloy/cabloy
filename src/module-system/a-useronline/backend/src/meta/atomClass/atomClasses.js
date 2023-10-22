const userOnline = require('./atomClass/userOnline.js');
const userOnlineHistory = require('./atomClass/userOnlineHistory.js');

module.exports = app => {
  const atomClasses = {
    //
    userOnline: userOnline(app),
    userOnlineHistory: userOnlineHistory(app),
  };
  return atomClasses;
};
