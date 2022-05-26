const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');
const eggBornUtils = require3('egg-born-utils');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CliStoreBase extends ctx.app.meta.CliBase(ctx) {
    constructor(options, tokenName) {
      super(options);
      this.tokenName = tokenName;
      this.cabloyConfig = null;
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
      const openAuthClient = new eggBornUtils.OpenAuthClient({ host: token.host });
      // signin
      await openAuthClient.post({
        path: '/a/authopen/auth/signin',
        body: {
          data: {
            clientID: token.clientID,
            clientSecret: token.clientSecret,
          },
        },
      });
      // execute command
      try {
        await this.onExecuteStoreCommand();
      } catch (err) {
        //  logout
        await openAuthClient.post({
          path: '/a/base/auth/logout',
        });
        throw err;
      }
    }
  }
  return CliStoreBase;
};
