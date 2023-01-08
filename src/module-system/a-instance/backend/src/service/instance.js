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
      // changed
      await this.ctx.bean.instance.instanceChanged();
    }

    async getConfigsPreview() {
      const instance = await this.item();
      let configPreview = this.ctx.bean.util.extend({}, app.meta.configs, JSON.parse(instance.config));
      configPreview = this.__configBlackFields(configPreview);
      return { data: configPreview };
    }

    async reload() {
      await this.ctx.bean.instance.reload();
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
