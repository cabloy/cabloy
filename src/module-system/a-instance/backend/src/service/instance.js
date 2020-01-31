const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {

  class Instance extends app.Service {

    async item() {
      return await this.ctx.db.get('aInstance', { id: this.ctx.instance.id });
    }

    async save({ data }) {
      // update
      await this.ctx.db.update('aInstance', {
        id: this.ctx.instance.id,
        title: data.title,
        config: data.config,
      });
      // broadcast
      this.ctx.app.meta.broadcast.emit({
        subdomain: this.ctx.subdomain,
        module: 'a-instance',
        broadcastName: 'resetCache',
        data: null,
      });
    }

    async getConfigsPreview() {
      const instance = await this.item();
      instance.config = JSON.parse(instance.config);
      if (!this.ctx.app.meta._configsOriginal) this.ctx.app.meta._configsOriginal = extend(true, {}, this.ctx.app.meta.configs);
      this.ctx.app.meta.configs = extend(true, {}, this.ctx.app.meta._configsOriginal, instance.config);
      return { data: this.ctx.app.meta.configs };
    }

  }

  return Instance;
};
