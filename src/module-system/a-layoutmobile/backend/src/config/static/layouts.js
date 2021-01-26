const layoutMobile = require('./layout/layoutMobile.js');

module.exports = app => {
  const layouts = [
    layoutMobile(app),
  ];
  return layouts;
};
