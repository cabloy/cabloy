const role = require('./controller/role.js');
const user = require('./controller/user.js');
const atomRight = require('./controller/atomRight.js');
const resourceRight = require('./controller/resourceRight.js');
const auth = require('./controller/auth.js');
const authScene = require('./controller/authScene.js');

module.exports = {
  role,
  user,
  atomRight,
  resourceRight,
  auth,
  authScene,
};
