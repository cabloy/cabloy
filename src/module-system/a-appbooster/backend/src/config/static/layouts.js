const layoutAppMenuSystem = require('./layout/layoutAppMenuSystem.js');

module.exports = app => {
  const layouts = [layoutAppMenuSystem(app)];
  return layouts;
};
