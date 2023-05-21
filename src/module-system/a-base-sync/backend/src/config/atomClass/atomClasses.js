const resource = require('./atomClass/resource.js');
const role = require('./atomClass/role.js');
const roleRight = require('./atomClass/roleRight.js');
const roleRightSpread = require('./atomClass/roleRightSpread.js');
const user = require('./atomClass/user.js');
const userAtomRight = require('./atomClass/userAtomRight.js');

module.exports = app => {
  const atomClasses = {
    //
    resource: resource(app),
    role: role(app),
    roleRight: roleRight(app),
    roleRightSpread: roleRightSpread(app),
    user: user(app),
    userAtomRight: userAtomRight(app),
  };
  return atomClasses;
};
