const emailConfirm = require('./schema/emailConfirm.js');
const passwordChange = require('./schema/passwordChange.js');
const passwordForgot = require('./schema/passwordForgot.js');
const passwordReset = require('./schema/passwordReset.js');
const signin = require('./schema/signin.js');
const signup = require('./schema/signup.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, emailConfirm(app));
  Object.assign(schemas, passwordChange(app));
  Object.assign(schemas, passwordForgot(app));
  Object.assign(schemas, passwordReset(app));
  Object.assign(schemas, signin(app));
  Object.assign(schemas, signup(app));
  // ok
  return schemas;
};
