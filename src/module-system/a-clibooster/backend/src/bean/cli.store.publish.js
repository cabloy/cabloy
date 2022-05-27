const path = require('path');
const require3 = require('require3');
const globby = require3('globby');
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
      // entityHash
      const entityHash = entityStatus.entityHash ? JSON.parse(entityStatus.entityHash) : {};
      // suite/module
      if (entityStatus.entity.entityTypeCode === 1) {
        return await this._publishSuite({ suiteName: entityName, entityHash });
      }
      return await this._publishModule({ moduleName: entityName, entityHash });
    }

    async _publishSuite({ suiteName, entityHash }) {
      // check if exists
      const suite = this.helper.findSuite(suiteName);
      if (!suite) {
        throw new Error(ctx.text('Not Found'));
      }
      // modules
      const pathSuite = suite.root;
      const filePkgs = await globby(`${pathSuite}/modules/*/package.json`);
      for (const filePkg of filePkgs) {
        // name
        const name = filePkg.split('/').slice(-2)[0];
        // meta
        const _package = require(filePkg);
        const root = path.dirname(filePkg);
        const moduleMeta = {
          name,
          root,
          pkg: filePkg,
          package: _package,
        };
        await this._publishSuiteModule({ moduleMeta, entityHash });
      }
    }

    async _publishSuiteModule({ moduleMeta, entityHash }) {
      // build:all
      await this.console.log(`===> build module: ${moduleMeta.name}`);
      // // spawn
      // await this.helper.spawn({
      //   cmd: 'npm',
      //   args: ['run', 'build:all'],
      //   options: {
      //     cwd: moduleMeta.root,
      //   },
      // });
      // zip full
      // zip trial
      // check hash
      // full version
      // trial version
    }
  }

  return Cli;
};
