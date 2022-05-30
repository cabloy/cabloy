const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');
const eggBornUtils = require3('egg-born-utils');

// const __storeTokenHost = 'https://admin.cabloy.com';
// const __storeTokenHost = 'http://localhost:9192';

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CliStoreBase extends ctx.app.meta.CliBase(ctx) {
    constructor(options, commandName) {
      super(options);
      this.commandName = commandName;
      this.tokenName = `store.${commandName}`;
      this.cabloyConfig = null;
      this.openAuthClient = null;
    }

    get localToken() {
      return ctx.bean.local.module('a-authopen').token;
    }

    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    async meta({ user }) {
      // meta
      const meta = await super.meta({ user });
      // check if token exists
      const item = await this.localToken.get({ name: this.tokenName });
      if (item) {
        delete meta.groups;
      }
      // ok
      return meta;
    }

    async execute({ user }) {
      // super
      await super.execute({ user });
      // token
      await this.addToken();
      // cabloy config
      await this.loadCabloyConfig();
      // executeStoreCommand
      await this.executeStoreCommand();
    }
    async addToken() {
      const { argv } = this.context;
      const { clientID, clientSecret } = argv;
      if (clientID && clientSecret) {
        await this.localToken.add({
          name: this.tokenName,
          host: this.configModule.store.token.host,
          clientID,
          clientSecret,
        });
      }
    }
    async saveCabloyConfig() {
      const { argv } = this.context;
      const fileName = path.join(argv.projectPath, 'cabloy.json');
      await fse.outputFile(fileName, JSON.stringify(this.cabloyConfig, null, 2));
    }
    async loadCabloyConfig() {
      const { argv } = this.context;
      const fileName = path.join(argv.projectPath, 'cabloy.json');
      const exists = await fse.pathExists(fileName);
      let config;
      if (exists) {
        const content = await fse.readFile(fileName);
        config = JSON.parse(content);
      } else {
        config = {
          store: {
            commands: {
              sync: {
                entities: {},
              },
              publish: {
                entities: {},
              },
            },
          },
        };
        await fse.outputFile(fileName, JSON.stringify(config, null, 2));
      }
      this.cabloyConfig = config;
    }

    async executeStoreCommand() {
      // token
      const token = await this.localToken.get({ name: this.tokenName });
      // OpenAuthClient
      this.openAuthClient = new eggBornUtils.OpenAuthClient({ token });
      // signin
      await this.openAuthClient.signin();
      // execute command
      try {
        this._needLernaBootstrap = false;
        await this._executeStoreCommand();
        if (this._needLernaBootstrap) {
          await this.helper.lernaBootstrap();
          // reload
          ctx.app.meta.reload.now();
        }
      } catch (err) {
        //  logout
        await this.openAuthClient.logout();
        this.openAuthClient = null;
        throw err;
      }
    }

    async _executeStoreCommand() {
      const { argv } = this.context;
      // entityNames
      let entityNames = argv._;
      if (entityNames.length === 0) {
        // load all entities
        const entitiesConfig = ctx.bean.util.getProperty(
          this.cabloyConfig,
          `store.commands.${this.commandName}.entities`
        );
        entityNames = Object.keys(entitiesConfig);
      }
      // loop
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
        // command entity
        const result = await this._executeStoreCommandEntity({ entityName });
        result.entityName = entityName;
        // result
        if (result.code && !result.message) {
          const args = result.args || [];
          result.message = ctx.parseSuccess.module(moduleInfo.relativeName, result.code, ...args).message;
        }
        if (result.message) {
          await this.console.log({ text: result.message });
        }
        results.push(result);
      }
      // log results
      await this._logResults({ results });
    }

    async _executeStoreCommandEntity({ entityName }) {
      try {
        // save to config
        let entityConfig = ctx.bean.util.getProperty(
          this.cabloyConfig,
          `store.commands.${this.commandName}.entities.${entityName}`
        );
        if (!entityConfig) {
          entityConfig = {};
          ctx.bean.util.setProperty(
            this.cabloyConfig,
            `store.commands.${this.commandName}.entities.${entityName}`,
            entityConfig
          );
          await this.saveCabloyConfig();
        }
        // onExecuteStoreCommandEntity
        return await this.onExecuteStoreCommandEntity({ entityName });
      } catch (err) {
        return {
          code: err.code,
          message: err.message,
        };
      }
    }

    async _logResults({ results }) {
      // sort
      results.sort((a, b) => a.code - b.code);
      // table
      const table = this.helper.newTable({
        head: ['Entity Name', 'Message'],
        colWidths: [30, 80],
      });
      for (const result of results) {
        table.push([result.entityName, result.message]);
        table.push(['', this._getEntityURL(result.entityName)]);
      }
      await this.console.log({ text: table.toString() });
    }

    _getEntityURL(entityName) {
      const locale = this.openAuthClient.locale;
      return `https://store.cabloy.com/${locale === 'zh-cn' ? 'zh-cn/' : ''}articles/${entityName}.html`;
    }
  }
  return CliStoreBase;
};
