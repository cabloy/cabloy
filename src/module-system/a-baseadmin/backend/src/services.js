const role = require('./service/role.js');
const user = require('./service/user.js');
const atomRight = require('./service/atomRight.js');
const resourceRight = require('./service/resourceRight.js');
const auth = require('./service/auth.js');
const authScene = require('./service/authScene.js');

module.exports = {
  role,
  user,
  atomRight,
  resourceRight,
  auth,
  authScene,
};
