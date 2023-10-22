const layoutMessageGroupBase = require('./layout/layoutMessageGroupBase.js');
const layoutMessageListBase = require('./layout/layoutMessageListBase.js');

module.exports = app => {
  const layouts = [layoutMessageGroupBase(app), layoutMessageListBase(app)];
  return layouts;
};
