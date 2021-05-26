const layoutPC = require('./layout/layoutPC.js');
const layoutPCAnonymous = require('./layout/layoutPCAnonymous.js');

module.exports = app => {
  const layouts = [
    layoutPC(app),
    layoutPCAnonymous(app),
  ];
  return layouts;
};
