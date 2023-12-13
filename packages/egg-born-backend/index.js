require('@zhennann/set');
require('regenerator-runtime/runtime');
require('./lib/base/json.js');

// process.traceDeprecation = true;

const moduleAlias = require('module-alias');
moduleAlias.addAlias('egg', '@zhennann/egg');
moduleAlias.addAlias('koa-static-cache', '@zhennann/koa-static-cache');

const Master = require('egg-cluster/lib/master.js');
Master.prototype.onReload = require('./lib/utils/reload.js');

module.exports = require('./lib/framework.js');
