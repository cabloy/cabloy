const layoutDetailListBase = require('./layout/layoutDetailListBase.js');

module.exports = app => {
  const layouts = [
    //
    layoutDetailListBase(app),
  ];
  return layouts;
};
