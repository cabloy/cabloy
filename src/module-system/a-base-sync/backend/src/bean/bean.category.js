const category_0 = require('./bean.category/bean.category_0.js');
const category_cache = require('./bean.category/bean.category_cache.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(category_0, [category_cache], ctx);
};
