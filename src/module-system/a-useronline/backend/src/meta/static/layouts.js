const layoutAtomListUserOnline = require('./layout/layoutAtomListUserOnline.js');
const layoutAtomListUserOnlineHistory = require('./layout/layoutAtomListUserOnlineHistory.js');

module.exports = app => {
  const layouts = [
    //
    layoutAtomListUserOnline(app),
    layoutAtomListUserOnlineHistory(app),
  ];
  return layouts;
};
