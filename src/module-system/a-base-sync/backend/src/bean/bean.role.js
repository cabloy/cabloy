const role_base = require('./bean.role/bean.role_base.js');
const role_atomRights = require('./bean.role/bean.role_atomRights.js');
const role_build = require('./bean.role/bean.role_build.js');
const role_includes = require('./bean.role/bean.role_includes.js');
const role_others = require('./bean.role/bean.role_others.js');
const role_resourceRights = require('./bean.role/bean.role_resourceRights.js');
const role_users = require('./bean.role/bean.role_users.js');
const role_flow = require('./bean.role/bean.role_flow.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    role_base,
    [
      role_atomRights, //
      role_build,
      role_includes,
      role_others,
      role_resourceRights,
      role_users,
      role_flow,
    ],
    ctx
  );
};
