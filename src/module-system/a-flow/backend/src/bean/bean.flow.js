const flow_0 = require('./bean.flow/bean.flow_0.js');
const flow_query = require('./bean.flow/bean.flow_query.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    flow_0,
    [
      //
      flow_query,
    ],
    ctx
  );
};
