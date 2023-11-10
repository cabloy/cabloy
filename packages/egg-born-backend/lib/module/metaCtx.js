const utilCtxFn = require('../utils/utilCtx.js');
module.exports = function (ctx) {
  const meta = {};
  // util
  meta.util = utilCtxFn(ctx);

  // mockUtil
  // meta.mockUtil = createMockUtil(ctx);

  return meta;
};
