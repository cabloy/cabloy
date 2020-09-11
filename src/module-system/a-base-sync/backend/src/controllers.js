const atom = require('./controller/atom.js');
const atomAction = require('./controller/atomAction.js');
const atomClass = require('./controller/atomClass.js');
const auth = require('./controller/auth.js');
const base = require('./controller/base.js');
const comment = require('./controller/comment.js');
const func = require('./controller/function.js');
const jwt = require('./controller/jwt.js');
const layoutConfig = require('./controller/layoutConfig.js');
const user = require('./controller/user.js');

module.exports = app => {
  const controllers = {
    atom,
    atomAction,
    atomClass,
    auth,
    base,
    comment,
    function: func,
    jwt,
    layoutConfig,
    user,
  };
  return controllers;
};
