module.exports = app => {
  class cli extends app.Service {
    async meta({ argv, user }) {
      return await this.ctx.bean.cli.meta({ argv, user });
    }
  }

  return cli;
};
