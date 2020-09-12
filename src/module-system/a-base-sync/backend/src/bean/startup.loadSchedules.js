module.exports = app => {
  class Startup extends app.meta.BeanBase {

    async execute() {
      await app.meta._loadSchedules({ subdomain: this.ctx.subdomain });
    }

  }

  return Startup;
};
