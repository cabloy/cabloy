const ctx_0 = require('./test.ctx_0.js');
const ctx_1 = require('./test.ctx_1.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(ctx_0, ctx_1, ctx);
};
