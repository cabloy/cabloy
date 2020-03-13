require('object-get-o-a');
require('./lib/base/json.js');

const moduleAlias = require('module-alias');
moduleAlias.addAlias('ali-rds', '@zhennann/ali-rds');

module.exports = require('./lib/framework.js');
