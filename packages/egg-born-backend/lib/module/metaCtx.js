const utilCtxFn = require('./utilCtx.js');
module.exports = function (ctx) {
  const meta = {};
  // util
  meta.util = utilCtxFn(ctx);

  return meta;
};
