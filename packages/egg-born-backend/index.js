require('object-get-o-a');

const moduleAlias = require('module-alias');
moduleAlias.addAlias('ali-rds', '@zhennann/ali-rds');

module.exports = require('./lib/framework.js');
