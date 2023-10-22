const layoutAppMineBase = require('./layout/layoutAppMineBase.js');
// const layoutAppMineDefault = require('./layout/layoutAppMineDefault.js');

module.exports = app => {
  const layouts = [
    layoutAppMineBase(app),
    // layoutAppMineDefault(app),
  ];
  return layouts;
};
