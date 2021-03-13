const _detailClasses = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class DetailClass extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, 'detailClass');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).detailClass;
    }

    detailClasses() {
      if (!_detailClasses[ctx.locale]) {
        _detailClasses[ctx.locale] = this._prepareDetailClasses();
      }
      return _detailClasses[ctx.locale];
    }

    detailClass({ module, detailClassName }) {
      const _detailClasses = this.detailClasses();
      return _detailClasses[module] && _detailClasses[module][detailClassName];
    }

    async get({ id, module, detailClassName }) {
      module = module || this.moduleName;
      const data = id ? { id } : { module, detailClassName };
      const res = await this.model.get(data);
      if (res) return res;
      if (!module || !detailClassName) ctx.throw.module('a-base', 1011);
      // lock
      return await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.detailClass.register`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'detailClass',
            context: { module, detailClassName },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ module, detailClassName }) {
      // get
      const res = await this.model.get({ module, detailClassName });
      if (res) return res;
      // data
      const atomClass = this.detailClass({ module, detailClassName });
      if (!atomClass) throw new Error(`detailClass ${module}:${detailClassName} not found!`);
      const data = {
        module,
        detailClassName,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

    // async getByAtomId({ atomId }) {
    //   const res = await this.model.query(`
    //     select a.*,b.id as atomId,b.itemId from aAtomClass a
    //       left join aAtom b on a.id=b.atomClassId
    //         where b.iid=? and b.id=?
    //     `, [ ctx.instance.id, atomId ]);
    //   return res[0];
    // }

    // async getTopByAtomId({ atomId }) {
    //   const atomClass = await this.getByAtomId({ atomId });
    //   return await this.top(atomClass);
    // }

    // async validator({ atomClass }) {
    //   // default
    //   const _module = ctx.app.meta.modules[atomClass.module];
    //   const validator = _module.main.meta.base.atoms[atomClass.atomClassName].validator;
    //   return validator ? {
    //     module: atomClass.module,
    //     validator,
    //   } : null;
    // }

    _prepareDetailClasses() {
      const detailClasses = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        const details = ctx.bean.util.getProperty(module, 'main.meta.detail.details');
        if (details) {
          const res = this._prepareDetailClassesModule(module, details);
          if (Object.keys(res).length > 0) {
            detailClasses[relativeName] = res;
          }
        }
      }
      return detailClasses;
    }

    _prepareDetailClassesModule(module, _details) {
      const detailClasses = {};
      for (const key in _details) {
        // info
        const detailClass = {
          name: key,
          ..._details[key].info,
        };
        // titleLocale
        detailClass.titleLocale = ctx.text(detailClass.title);
        // ok
        detailClasses[key] = detailClass;
      }
      return detailClasses;
    }

  }

  return DetailClass;
};
