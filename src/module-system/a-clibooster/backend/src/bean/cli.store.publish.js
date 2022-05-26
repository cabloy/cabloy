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
      const results = [];
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
        const result = await this._publishEntity({ entityName });
        // result
        if (result.message) {
          await this.console.log({ text: result.message });
        }
        results.push(result);
      }
      // log results
      await this._logResults({ results });
    }

    async _logResults({ results }) {
      const table = this.helper.newTable({
        head: ['Entity Name', 'Message'],
        colWidths: [30, 50],
      });
      for (const result of results) {
        table.push([result.entityName, result.message]);
      }
      await this.console.log({ text: table.toString() });
    }

    async _publishEntity({ entityName }) {
      // save to config
      let entityConfig = ctx.bean.util.getProperty(this.cabloyConfig, `store.commands.publish.entities.${entityName}`);
      if (!entityConfig) {
        entityConfig = {};
        ctx.bean.util.setProperty(this.cabloyConfig, `store.commands.publish.entities.${entityName}`, entityConfig);
        await this.saveCabloyConfig();
      }
      // fetch entity status
      const entityStatus = await this.openAuthClient.post({
        path: '/cabloy/store/store/publish/entityStatus',
        body: {
          entityName,
        },
      });
      if (!entityStatus) {
        return {
          entityName,
          message: ctx.text('Not Found'),
        };
      }
    }
  }

  return Cli;
};
