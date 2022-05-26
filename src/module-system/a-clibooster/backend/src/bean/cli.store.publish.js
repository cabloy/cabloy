const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');
const glob = require3('glob');
const bb = require3('bluebird');
const CliStoreBase = require('../common/cliStoreBase.js');

module.exports = ctx => {
  class Cli extends CliStoreBase(ctx) {
    constructor(options) {
      super(options, 'store.publish');
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
        // publish entity
        await this._publishEntity({ entityName });
      }
    }

    async _publishEntity({ entityName }) {
      // save to config
      let entityConfig = ctx.bean.util.getProperty(this.cabloyConfig, `store.commands.publish.entities.${entityName}`);
      if (!entityConfig) {
        entityConfig = {};
        ctx.bean.util.setProperty(this.cabloyConfig, `store.commands.publish.entities.${entityName}`, entityConfig);
        await this.saveCabloyConfig();
      }
      // fetch entity
      const entityStatus = await this.openAuthClient.post({
        path: '/cabloy/store/store/publish/entityStatus',
        body: {
          entityName,
        },
      });
      console.log(entityStatus);
    }
  }

  return Cli;
};
