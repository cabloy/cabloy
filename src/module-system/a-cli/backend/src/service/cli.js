module.exports = app => {
  class cli extends app.Service {
    async meta({ argv, user }) {
      // check right first
      const cliFullName = argv.cliFullName;
      const right = await this.ctx.bean.resource.checkRightResource({
        atomStaticKey: cliFullName,
        user,
      });
      if (!right) this.ctx.throw(403);
    }
  }

  return cli;
};
