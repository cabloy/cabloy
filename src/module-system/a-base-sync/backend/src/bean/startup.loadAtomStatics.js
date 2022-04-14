module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Startup extends app.meta.BeanBase {
    async execute() {
      await this.ctx.bean.atomStatic.loadAllAtomStatics();
    }
  }

  return Startup;
};
