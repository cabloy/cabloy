module.exports = app => {
  class Broadcast extends app.meta.BeanBase {

    async execute() {
      await this.ctx.bean.instance.instanceStartup({
        subdomain: this.ctx.subdomain,
        options: {
          force: true, instanceBase: null,
        },
      });
    }

  }

  return Broadcast;
};
