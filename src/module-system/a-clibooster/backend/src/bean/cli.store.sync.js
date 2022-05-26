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

    async execute({ user }) {
      const { argv } = this.context;
      // super
      await super.execute({ user });
      const moduleNames = argv._;
      const total = moduleNames.length;
      for (let index = 0; index < total; index++) {
        const moduleName = moduleNames[index];
        // log
        await this.console.log({
          progressNo: 0,
          total,
          progress: index,
          text: moduleName,
        });
        // sync module
        await this._syncModule({ moduleName });
      }
    }

    async _syncModule({ moduleName }) {}
  }

  return Cli;
};
