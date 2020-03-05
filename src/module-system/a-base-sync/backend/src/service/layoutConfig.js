const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {

  class Settings extends app.Service {

    async load({ module, user }) {
      const name = `user-layoutConfig:${module}:${user.id}`;
      return await this.ctx.meta.status.get(name);
    }

    async save({ module, data, user }) {
      const name = `user-layoutConfig:${module}:${user.id}`;
      await this.ctx.meta.status.set(name, data);
    }

    async saveKey({ module, key, value, user }) {
      const layoutConfig = await this.load({ module, user });
      const data = extend(true, {}, layoutConfig || {}, { [key]: value });
      await this.save({ module, data, user });
    }

  }

  return Settings;
};
