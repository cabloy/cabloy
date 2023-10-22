const fieldsRightMode = require('./dict/fieldsRightMode.js');

module.exports = app => {
  const dicts = [fieldsRightMode(app)];
  return dicts;
};
