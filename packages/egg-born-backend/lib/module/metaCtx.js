const utilCtxFn = require('../utils/utilCtx.js');
const mockUtilFn = require('../utils/mockUtil.js');

module.exports = function (ctx) {
  const meta = {};
  // util
  meta.util = utilCtxFn(ctx);

  // mockUtil
  meta.mockUtil = mockUtilFn(ctx);

  return meta;
};
