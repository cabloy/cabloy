const version = require('./service/version.js');
const base = require('./service/base.js');
const user = require('./service/user.js');
const atom = require('./service/atom.js');
const atomClass = require('./service/atomClass.js');
const atomAction = require('./service/atomAction.js');
const schedule = require('./service/schedule.js');
const auth = require('./service/auth.js');
const func = require('./service/function.js');
const comment = require('./service/comment.js');
const layoutConfig = require('./service/layoutConfig.js');

module.exports = app => {
  const services = {
    version,
    base,
    user,
    atom,
    atomClass,
    atomAction,
    schedule,
    auth,
    function: func,
    comment,
    layoutConfig,
  };
  return services;
};
