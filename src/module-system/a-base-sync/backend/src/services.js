const base = require('./service/base.js');
const user = require('./service/user.js');
const atom = require('./service/atom.js');
const atomClass = require('./service/atomClass.js');
const atomAction = require('./service/atomAction.js');
const auth = require('./service/auth.js');
const resource = require('./service/resource.js');
const comment = require('./service/comment.js');
const jwt = require('./service/jwt.js');
const layoutConfig = require('./service/layoutConfig.js');
const category = require('./service/category.js');
const tag = require('./service/tag.js');

module.exports = app => {
  const services = {
    base,
    user,
    atom,
    atomClass,
    atomAction,
    auth,
    resource,
    comment,
    jwt,
    layoutConfig,
    category,
    tag,
  };
  return services;
};
