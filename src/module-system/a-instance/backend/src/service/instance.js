const require3 = require('require3');
const extend = require3('extend2');

const __blackFields = ['startups', 'queues', 'broadcasts', 'middlewares', 'schedules'];

module.exports = app => {
  class Instance extends app.Service {
    async item() {
      return await this.ctx.model.instance.get({ id: this.ctx.instance.id });
    }

    async save({ data }) {
      // update
      await this.ctx.model.instance.update({
        id: this.ctx.instance.id,
        title: data.title,
        config: JSON.stringify(this.__configBlackFields(data.config)),
      });
      // broadcast
      this.ctx.meta.util.broadcastEmit({
        module: 'a-instance',
        broadcastName: 'resetCache',
        data: null,
      });
    }

    async getConfigsPreview() {
      const instance = await this.item();
      let configPreview = extend(true, {}, app.meta.configs, JSON.parse(instance.config));
      configPreview = this.__configBlackFields(configPreview);
      return { data: configPreview };
    }

    async reload() {
      // broadcast
      this.ctx.meta.util.broadcastEmit({
        module: 'a-instance',
        broadcastName: 'reload',
        data: null,
      });
    }

    __configBlackFields(config) {
      if (typeof config === 'string') config = JSON.parse(config);
      for (const moduleName in config) {
        const moduleConfig = config[moduleName];
        for (const field of __blackFields) {
          delete moduleConfig[field];
        }
      }
      return config;
    }
  }

  return Instance;
};
