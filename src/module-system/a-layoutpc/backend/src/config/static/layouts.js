const layoutPC = require('./layout/layoutPC.js');

module.exports = app => {
  const layouts = [
    layoutPC(app),
  ];
  return layouts;
};
