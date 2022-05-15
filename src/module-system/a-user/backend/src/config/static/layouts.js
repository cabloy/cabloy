const layoutAppMineBase = require('./layout/layoutAppMineBase.js');

module.exports = app => {
  const layouts = [layoutAppMineBase(app)];
  return layouts;
};
