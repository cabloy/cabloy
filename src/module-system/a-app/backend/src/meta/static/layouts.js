const layoutAtomListApp = require('./layout/layoutAtomListApp.js');
const layoutAppMenuBase = require('./layout/layoutAppMenuBase.js');
const layoutAppMenuDefault = require('./layout/layoutAppMenuDefault.js');

module.exports = app => {
  const layouts = [layoutAtomListApp(app), layoutAppMenuBase(app), layoutAppMenuDefault(app)];
  return layouts;
};
