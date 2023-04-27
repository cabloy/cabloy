const resource = require('./atomClass/resource.js');
const role = require('./atomClass/role.js');
const roleRight = require('./atomClass/roleRight.js');
const user = require('./atomClass/user.js');

module.exports = app => {
  const atomClasses = {
    //
    resource: resource(app),
    role: role(app),
    roleRight: roleRight(app),
    user: user(app),
  };
  return atomClasses;
};
