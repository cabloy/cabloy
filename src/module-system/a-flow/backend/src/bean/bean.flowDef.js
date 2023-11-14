const flowDef_0 = require('./bean.flowDef/bean.flowDef_0.js');
const flowDef_deploy = require('./bean.flowDef/bean.flowDef_deploy.js');
const flowDef_prepare = require('./bean.flowDef/bean.flowDef_prepare.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    flowDef_0,
    [
      //
      flowDef_deploy,
      flowDef_prepare,
    ],
    ctx
  );
};
