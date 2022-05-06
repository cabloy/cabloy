const layoutAtomListUserOnline = require('./layout/layoutAtomListUserOnline.js');

module.exports = app => {
  const layouts = [layoutAtomListUserOnline(app)];
  return layouts;
};
