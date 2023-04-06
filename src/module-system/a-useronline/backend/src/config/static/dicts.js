const loginType = require('./dict/loginType.js');

module.exports = app => {
  const dicts = [
    loginType(app), //
  ];
  return dicts;
};
