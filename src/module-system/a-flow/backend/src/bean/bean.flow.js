const flow_0 = require('./bean.flow/bean.flow_0.js');
const flow_assignees = require('./bean.flow/bean.flow_assignees.js');
const flow_load = require('./bean.flow/bean.flow_load.js');
const flow_query = require('./bean.flow/bean.flow_query.js');
const flow_start = require('./bean.flow/bean.flow_start.js');
const flow_utils = require('./bean.flow/bean.flow_utils.js');

module.exports = module.meta.util.mixinClasses(flow_0, [
  //
  flow_assignees,
  flow_load,
  flow_query,
  flow_start,
  flow_utils,
]);
