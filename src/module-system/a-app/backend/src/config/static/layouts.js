const layoutAtomListApp = require('./layout/layoutAtomListApp.js');
const layoutAppMenuBase = require('./layout/layoutAppMenuBase.js');
const layoutAppMenuDefault = require('./layout/layoutAppMenuDefault.js');
const layoutAppMineDefault = require('./layout/layoutAppMineDefault.js');

module.exports = app => {
  const layouts = [
    layoutAtomListApp(app),
    layoutAppMenuBase(app),
    layoutAppMenuDefault(app),
    layoutAppMineDefault(app),
  ];
  return layouts;
};
