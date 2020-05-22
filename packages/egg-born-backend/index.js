require('object-get-o-a');
require('./lib/base/json.js');

const moduleAlias = require('module-alias');
moduleAlias.addAlias('ali-rds', '@zhennann/ali-rds');

const Master = require('egg-cluster/lib/master.js');
Master.prototype.onReload = require('./lib/utils/reload.js');

module.exports = require('./lib/framework.js');

