module.exports = app => {

  class Instance extends app.Service {

    async item() {
      return await this.ctx.db.get('aInstance', { id: this.ctx.instance.id });
    }

    async save({ data }) {
      await this.ctx.db.update('aInstance', {
        id: this.ctx.instance.id,
        title: data.title,
        config: data.config,
      });
    }

  }

  return Instance;
};
