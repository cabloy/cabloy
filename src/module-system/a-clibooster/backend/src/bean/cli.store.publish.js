const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');
const glob = require3('glob');
const bb = require3('bluebird');
const CliStoreBase = require('../common/cliStoreBase.js');

module.exports = ctx => {
  class Cli extends CliStoreBase(ctx) {
    constructor(options) {
      super(options, 'publish');
    }

    async onExecuteStoreCommandEntity({ entityName }) {
      // fetch entity status
      const entityStatus = await this.openAuthClient.post({
        path: '/cabloy/store/store/publish/entityStatus',
        body: {
          entityName,
        },
      });
      if (!entityStatus) {
        throw new Error(ctx.text('Not Found'));
      }
      // suite/module
      if (entityStatus.entity.entityTypeCode === 1) {
        return await this._publishSuite({ suiteName: entityName, entityStatus });
      }
      return await this._publishModule({ moduleName: entityName, entityStatus });
    }

    async _publishSuite({ suiteName, entityStatus }) {
      // check if exists
      const _suite = this.helper.findSuite(suiteName);
      if (!_suite) {
        throw new Error(ctx.text('Not Found'));
      }
    }
  }

  return Cli;
};
