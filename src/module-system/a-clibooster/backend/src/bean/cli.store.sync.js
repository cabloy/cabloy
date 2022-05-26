const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');
const glob = require3('glob');
const bb = require3('bluebird');
const CliStoreBase = require('../common/cliStoreBase.js');

module.exports = ctx => {
  class Cli extends CliStoreBase(ctx) {
    constructor(options) {
      super(options, 'store.sync');
    }

    async onExecuteStoreCommand() {
      const { argv } = this.context;
      // entityNames
      const entityNames = argv._;
      const total = entityNames.length;
      for (let index = 0; index < total; index++) {
        const entityName = entityNames[index];
        // log
        await this.console.log({
          progressNo: 0,
          total,
          progress: index,
          text: entityName,
        });
        // sync entity
        await this._syncEntity({ entityName });
      }
    }

    async _syncEntity({ entityName }) {}
  }

  return Cli;
};
