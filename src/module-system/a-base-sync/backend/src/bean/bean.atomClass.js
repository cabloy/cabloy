module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomClass extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'atomClass');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).atomClass;
    }

    async atomClass(atomClass) {
      atomClass = await this.top(atomClass);
      return ctx.bean.base.atomClass({ module: atomClass.module, atomClassName: atomClass.atomClassName });
    }

    async top(atomClass) {
      while (true) {
        if (!atomClass.atomClassIdParent) break;
        atomClass = await this.get({ id: atomClass.atomClassIdParent });
      }
      return atomClass;
    }

    async get({ id, module, atomClassName, atomClassIdParent = 0 }) {
      module = module || this.moduleName;
      const data = id ? { id } : { module, atomClassName, atomClassIdParent };
      const res = await this.model.get(data);
      if (res) return res;
      if (!module || !atomClassName) ctx.throw.module(moduleInfo.relativeName, 1011);
      // lock
      return await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.atomClass.register`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'atomClass',
            context: { module, atomClassName, atomClassIdParent },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ module, atomClassName, atomClassIdParent }) {
      // atom class
      const data = await this._registerLock_inner({ module, atomClassName, atomClassIdParent });
      // atom action: basics
      for (const code of [1, 2, 3, 4]) {
        await ctx.bean.atomAction._registerLock_inner({ atomClassId: data.id, code });
      }
      // ok
      return data;
    }

    async _registerLock_inner({ module, atomClassName, atomClassIdParent }) {
      // get
      const res = await this.model.get({ module, atomClassName, atomClassIdParent });
      if (res) return res;
      // data
      const atomClass = ctx.bean.base.atomClass({ module, atomClassName });
      if (!atomClass) throw new Error(`atomClass ${module}:${atomClassName} not found!`);
      const data = {
        module,
        atomClassName,
        atomClassIdParent,
        atomClassInner: atomClass.inner ? 1 : 0,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

    async getByAtomId({ atomId }) {
      const res = await this.model.query(
        `
        select a.*,b.id as atomId,b.itemId from aAtomClass a
          left join aAtom b on a.id=b.atomClassId
            where b.iid=? and b.id=?
        `,
        [ctx.instance.id, atomId]
      );
      return res[0];
    }

    async getTopByAtomId({ atomId }) {
      const atomClass = await this.getByAtomId({ atomId });
      return await this.top(atomClass);
    }

    async validator({ atomClass }) {
      // default
      const _module = ctx.app.meta.modules[atomClass.module];
      const validator = _module.main.meta.base.atoms[atomClass.atomClassName].validator;
      return validator ? { module: atomClass.module, validator } : null;
    }

    async validatorSearch({ atomClass }) {
      const _module = ctx.app.meta.modules[atomClass.module];
      const validator = _module.main.meta.base.atoms[atomClass.atomClassName].search.validator;
      return validator ? { module: atomClass.module, validator } : null;
    }
  }

  return AtomClass;
};
