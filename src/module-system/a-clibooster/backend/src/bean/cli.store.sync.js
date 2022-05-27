const require3 = require('require3');
const globby = require3('globby');
const CliStoreBase = require('../common/cliStoreBase.js');

module.exports = ctx => {
  class Cli extends CliStoreBase(ctx) {
    constructor(options) {
      super(options, 'sync');
    }
  }

  return Cli;
};
