module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomAction extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, 'atomAction');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).atomAction;
    }

    async get({ id, atomClassId, code }) {
      const data = id ? { id } : { atomClassId, code };
      const res = await this.model.get(data);
      if (res) return res;
      // lock
      return await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.atomAction.register`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'atomAction',
            context: { atomClassId, code },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ atomClassId, code }) {
      // get
      const res = await this.model.get({ atomClassId, code });
      if (res) return res;
      const atomClass = await ctx.bean.atomClass.get({ id: atomClassId });
      const action = ctx.bean.base.action({ module: atomClass.module, atomClassName: atomClass.atomClassName, code });
      const data = {
        atomClassId,
        code,
        name: action.name,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

  }

  return AtomAction;
};
