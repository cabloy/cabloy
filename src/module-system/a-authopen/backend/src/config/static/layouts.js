const layoutAtomListAuthOpen = require('./layout/layoutAtomListAuthOpen.js');

module.exports = app => {
  const layouts = [layoutAtomListAuthOpen(app)];
  return layouts;
};
