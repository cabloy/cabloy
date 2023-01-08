module.exports = app => {
  class Settings extends app.Service {
    async load({ module, user }) {
      const name = `user-layoutConfig:${module}:${user.id}`;
      return await this.ctx.bean.status.get(name);
    }

    async save({ module, data, user }) {
      const name = `user-layoutConfig:${module}:${user.id}`;
      await this.ctx.bean.status.set(name, data);
    }

    async saveKey({ module, key, value, user }) {
      const layoutConfig = await this.load({ module, user });
      const data = this.ctx.bean.util.extend({}, layoutConfig || {}, { [key]: value });
      await this.save({ module, data, user });
    }
  }

  return Settings;
};
