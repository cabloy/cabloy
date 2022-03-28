const roleType = require('./dict/roleType.js');

module.exports = app => {
  const dicts = [roleType(app)];
  return dicts;
};
