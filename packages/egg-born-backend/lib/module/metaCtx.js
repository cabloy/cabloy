const utilCtxFn = require('../utils/utilCtx.js');
const mockUtilCtxFn = require('../utils/mockUtilCtx.js');

module.exports = function (ctx) {
  const meta = {};
  // util
  meta.util = utilCtxFn(ctx);

  // mockUtil
  meta.mockUtil = mockUtilCtxFn(ctx);

  return meta;
};
