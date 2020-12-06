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

    // select
    //   donot set disabled
    async select({ options: { where, orders, page, resourceType, star = 0, label = 0, stage = 'archive', category = 0, tag = 0, locale }, user, pageForce = true, count = 0 }) {
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


    // /////////////


    async check({ functions, user }) {
      for (const func of functions) {
        const res = await this.checkRightFunction({ function: func, user });
        if (res) {
          func.passed = true;
          func.id = res.id;
        } else {
          func.passed = false;
        }
      }
      return functions;
    }


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

    async _registerLock({ module, name }) {
      module = module || this.moduleName;
      // get
      const res = await this.model.get({ module, name });
      if (res) return res;
      const func = ctx.bean.base.function({ module, name });
      if (!func) throw new Error(`function not found: ${module}:${name}`);
      // atomClassId
      let atomClassId = 0;
      if (func.atomClassName) {
        const atomClass = await ctx.bean.atomClass.get({ module, atomClassName: func.atomClassName });
        atomClassId = atomClass.id;
      }
      // sceneId
      let sceneId;
      const sceneName = func.scene;
      if (!sceneName) {
        sceneId = 0;
      } else {
        sceneId = await this.getSceneId({ sceneName, sceneMenu: func.menu });
      }
      // insert
      const data = {
        module,
        name: func.name,
        title: func.title,
        sceneId,
        autoRight: func.autoRight,
        atomClassId,
        action: func.action ? ctx.constant.module(moduleInfo.relativeName).atom.action[func.action] : 0,
        sorting: func.sorting,
        menu: func.menu,
        public: func.public,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

    // iid maybe undefined
    async getSceneId({ sceneName, sceneMenu }) {
      const sceneItem = await this.modelFunctionScene.get({ sceneName, sceneMenu });
      if (sceneItem) return sceneItem.id;
      // scene sorting
      const scenes = (ctx.config.module(moduleInfo.relativeName).function.scenes[sceneMenu] || '').split(',');
      const sceneSorting = scenes.indexOf(sceneName) + 1;
      const res = await this.modelFunctionScene.insert({
        sceneName,
        sceneMenu,
        sceneSorting,
      });
      return res.insertId;
    }

    async checkRightFunction({
      function: { module, name },
      user,
    }) {
      const func = await this.get({ module, name });
      const sql = this.sqlProcedure.checkRightFunction({
        iid: ctx.instance.id,
        userIdWho: user.id,
        functionId: func.id,
      });
      return await ctx.model.queryOne(sql);
    }


  }

  return Resource;
};
