module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  const __atomClass = {
    module: moduleInfo.relativeName,
    atomClassName: 'resource',
  };

  class Resource extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, 'resource');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).resource;
    }

    get modelResourceLocale() {
      return ctx.model.module(moduleInfo.relativeName).resourceLocale;
    }

    get sqlProcedure() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
    }

    // count
    async count({ options, user }) {
      return await this.select({ options, user, count: 1 });
    }

    // select
    //   donot set atomDisabled
    async select({ options: { where, orders, page, resourceType, star = 0, label = 0, stage = 'archive', category = 0, tag = 0, locale }, user, pageForce = false, count = 0 }) {
      // locale
      locale = locale || ctx.locale;
      // where
      if (!where) where = {};
      if (resourceType) {
        where['f.resourceType'] = resourceType;
      }
      // options
      const options = {
        where, orders, page, star, label, stage, category, tag, resource: 1, resourceLocale: locale,
      };
      return await ctx.bean.atom.select({
        atomClass: __atomClass, options, user, pageForce, count,
      });
    }

    // read
    async read({ key, options, user }) {
      options = Object.assign({ resource: 1 }, options);
      // locale
      options.resourceLocale = options.locale || ctx.locale;
      return await ctx.bean.atom.read({ key, options, user });
    }

    async setLocales({ atomId, atomName }) {
      // delete
      await this.modelResourceLocale.delete({ atomId });
      // setLocales
      const locales = ctx.config.module(moduleInfo.relativeName).locales;
      for (const locale in locales) {
        await this.modelResourceLocale.insert({
          atomId,
          locale,
          atomNameLocale: ctx.text.locale(locale, atomName),
        });
      }
    }

    async checkLocales() {
      // setLocales
      const locales = ctx.config.module(moduleInfo.relativeName).locales;
      for (const locale in locales) {
        await this._checkLocale({ locale });
      }
    }

    async _checkLocale({ locale }) {
      const resources = await this._checkResourceLocales({ locale });
      if (resources.length === 0) return;
      // insert locales
      for (const resource of resources) {
        await this.modelResourceLocale.insert({
          atomId: resource.atomId,
          locale,
          atomNameLocale: ctx.text.locale(locale, resource.atomName),
        });
      }
    }

    async _checkResourceLocales({ locale }) {
      const sql = this.sqlProcedure._checkResourceLocales({
        iid: ctx.instance.id,
        locale,
      });
      return await ctx.model.query(sql);
    }

    // check
    async check({ atomStaticKeys, user }) {
      const output = [];
      for (const atomStaticKey of atomStaticKeys) {
        const res = await this.checkRightResource({ atomStaticKey, user });
        if (res) {
          output.push({
            passed: true,
            atomId: res.atomId,
            atomStaticKey,
          });
        } else {
          output.push({
            passed: false,
            atomStaticKey,
          });
        }
      }
      return output;
    }

    async checkRightResource({
      atomStaticKey,
      user,
    }) {
      const atom = await ctx.bean.atom.modelAtom.get({ atomStaticKey, atomDisabled: 0, atomStage: 1 });
      if (!atom) return null;
      const sql = this.sqlProcedure.checkRightResource({
        iid: ctx.instance.id,
        userIdWho: user.id,
        resourceAtomId: atom.id,
      });
      return await ctx.model.queryOne(sql);
    }


    // /////////////


    //

    async _get({ id, module, name }) {
      if (id) return await this.model.get({ id });
      module = module || this.moduleName;
      return await this.model.get({ module, name });
    }

    async get({ id, module, name }) {
      module = module || this.moduleName;
      const res = await this._get({ id, module, name });
      if (res) return res;
      // lock
      return await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.function.register`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'function',
            context: { module, name },
            fn: '_registerLock',
          });
        },
      });
    }


  }

  return Resource;
};
