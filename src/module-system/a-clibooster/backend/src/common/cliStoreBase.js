const eggBornUtils = require('egg-born-utils');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CliStoreBase extends ctx.app.meta.CliBase(ctx) {
    constructor(options, tokenName) {
      super(options);
      this.tokenName = tokenName;
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
      const { argv } = this.context;
      // super
      await super.execute({ user });
      // token
      const { clientID, clientSecret } = argv;
      if (clientID && clientSecret) {
        await this.localToken.add({
          name: this.tokenName,
          host: this.configModule.store.token.host,
          clientID,
          clientSecret,
        });
      }
      // executeStoreCommand
      await this.executeStoreCommand();
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
