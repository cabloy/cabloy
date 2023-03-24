const user_0 = require('./bean.user/bean.user_0.js');
const user_1 = require('./bean.user/bean.user_1.js');
const user_cache = require('./bean.user/bean.user_cache.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(user_0, [user_1, user_cache], ctx);
};
