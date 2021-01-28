const layoutTest = require('./layout/layoutTest.js');

module.exports = app => {
  const layouts = [
    layoutTest(app),
  ];
  return layouts;
};
