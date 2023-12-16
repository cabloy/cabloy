const flowDef_0 = require('./bean.flowDef/bean.flowDef_0.js');
const flowDef_deploy = require('./bean.flowDef/bean.flowDef_deploy.js');
const flowDef_prepare = require('./bean.flowDef/bean.flowDef_prepare.js');
const flowDef_find = require('./bean.flowDef/bean.flowDef_find.js');
const flowDef_utils = require('./bean.flowDef/bean.flowDef_utils.js');

module.exports = module.meta.util.mixinClasses(flowDef_0, [
  //
  flowDef_deploy,
  flowDef_prepare,
  flowDef_find,
  flowDef_utils,
]);
