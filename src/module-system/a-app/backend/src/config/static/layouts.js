const layoutAtomListApp = require('./layout/layoutAtomListApp.js');

module.exports = app => {
  const layouts = [layoutAtomListApp(app)];
  return layouts;
};
