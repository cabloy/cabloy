const version = require('./controller/version.js');
const role = require('./controller/role.js');
const user = require('./controller/user.js');
const atomRight = require('./controller/atomRight.js');
const functionRight = require('./controller/functionRight.js');
const auth = require('./controller/auth.js');
const _function = require('./controller/function.js');

module.exports = app => {
  const controllers = {
    version,
    role,
    user,
    atomRight,
    functionRight,
    auth,
    function: _function,
  };
  return controllers;
};
