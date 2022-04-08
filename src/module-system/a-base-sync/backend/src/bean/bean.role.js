const role_base = require('./bean.role/bean.role_base.js');
// const user_1 = require('./bean.user/bean.user_1.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(role_base, [], ctx);
};
