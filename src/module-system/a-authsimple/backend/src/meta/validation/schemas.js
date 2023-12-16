const emailConfirm = require('./schema/emailConfirm.js');
const passwordChange = require('./schema/passwordChange.js');
const passwordForgot = require('./schema/passwordForgot.js');
const passwordReset = require('./schema/passwordReset.js');
const signin = require('./schema/signin.js');
const signup = require('./schema/signup.js');

const schemas = {};
Object.assign(schemas, emailConfirm);
Object.assign(schemas, passwordChange);
Object.assign(schemas, passwordForgot);
Object.assign(schemas, passwordReset);
Object.assign(schemas, signin);
Object.assign(schemas, signup);
// ok
module.exports = schemas;
