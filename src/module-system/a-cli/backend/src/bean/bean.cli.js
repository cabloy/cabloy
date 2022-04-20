module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cli {
    async meta({ argv, user }) {
      // check right first
      const cliFullName = argv.cliFullName;
      const right = await this.ctx.bean.resource.checkRightResource({
        atomStaticKey: cliFullName,
        user,
      });
      if (!right) this.ctx.throw(403);
      //
    }
  }
  return Cli;
};
