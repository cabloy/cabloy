module.exports = app => {
  class Version extends app.Service {

    async update(options) {
      // eslint-disable-next-line
      if (options.version === 1) {}
    }

    async init(options) {
      if (options.version === 1) {
        // provider
        const info = this.ctx.module.info;
        await this.ctx.model.authProvider.insert({
          module: info.relativeName,
          providerName: info.name,
          config: JSON.stringify({
            addUser: true, addRole: true,
            clientID: options['github.clientID'] || 'required',
            clientSecret: options['github.clientSecret'] || 'required',
          }),
        });
      }
    }

  }

  return Version;
};
