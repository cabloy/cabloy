const layoutType = require('./dict/layoutType.js');

module.exports = app => {
  const dicts = [layoutType(app)];
  return dicts;
};
