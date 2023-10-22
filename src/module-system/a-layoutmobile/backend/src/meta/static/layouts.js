const layoutMobile = require('./layout/layoutMobile.js');
const layoutMobileAnonymous = require('./layout/layoutMobileAnonymous.js');

module.exports = app => {
  const layouts = [layoutMobile(app), layoutMobileAnonymous(app)];
  return layouts;
};
