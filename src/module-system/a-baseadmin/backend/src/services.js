const role = require('./service/role.js');
const user = require('./service/user.js');
const atomRight = require('./service/atomRight.js');
const auth = require('./service/auth.js');

module.exports = app => {
  const services = {
    role,
    user,
    atomRight,
    auth,
  };
  return services;
};
