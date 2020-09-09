module.exports = app => {
  class Broadcast extends app.meta.BeanBase {

    async execute() {
      await this.ctx.bean.instance.resetCache({ subdomain: this.ctx.subdomain });
    }

  }

  return Broadcast;
};
