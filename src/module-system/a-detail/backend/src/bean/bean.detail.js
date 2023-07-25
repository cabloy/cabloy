const detail_0 = require('./bean.detail/bean.detail_0.js');
const detail_1 = require('./bean.detail/bean.detail_0.js');
const detail_copy = require('./bean.detail/bean.detail_0.js');
const detail_delete = require('./bean.detail/bean.detail_0.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    detail_0,
    [
      detail_1, //
      detail_copy,
      detail_delete,
    ],
    ctx
  );
};
