const modelFn = require('../../../model/function.js');
const modelFunctionStarFn = require('../../../model/functionStar.js');
const modelFunctionLocaleFn = require('../../../model/functionLocale.js');
const modelFunctionSceneFn = require('../../../model/functionScene.js');
const sqlProcedureFn = require('../../sql/procedure.js');

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Function {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._model = null;
      this._modelFunctionStar = null;
      this._modelFunctionLocale = null;
      this._modelFunctionScene = null;
      this._sqlProcedure = null;
    }

    // other module's menu
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    get modelFunctionStar() {
      if (!this._modelFunctionStar) this._modelFunctionStar = new (modelFunctionStarFn(ctx.app))(ctx);
      return this._modelFunctionStar;
    }

    get modelFunctionLocale() {
      if (!this._modelFunctionLocale) this._modelFunctionLocale = new (modelFunctionLocaleFn(ctx.app))(ctx);
      return this._modelFunctionLocale;
    }

    get modelFunctionScene() {
      if (!this._modelFunctionScene) this._modelFunctionScene = new (modelFunctionSceneFn(ctx.app))(ctx);
      return this._modelFunctionScene;
    }

    get sqlProcedure() {
      if (!this._sqlProcedure) this._sqlProcedure = new (sqlProcedureFn(ctx))();
      return this._sqlProcedure;
    }

    // list
    //   locale maybe '' for selectAllFunctions beside menus
    async list({ options: { where, orders, page, star = 0, locale = '' }, user }) {
      // page = ctx.meta.util.page(page); // has set in controller

      // check locale
      if (locale) await this.checkLocale({ locale });

      // sql
      const sql = this.sqlProcedure.selectFunctions({
        iid: ctx.instance.id,
        locale,
        userIdWho: user.id,
        where, orders, page, star,
      });
      // select
      return await ctx.model.query(sql);
    }

    async star({ id, star = 1, user }) {
      // force delete
      await this.modelFunctionStar.delete({
        userId: user.id,
        functionId: id,
      });
      // new
      if (star) {
        await this.modelFunctionStar.insert({
          userId: user.id,
          functionId: id,
          star: 1,
        });
      }
    }

    async check({ functions, user }) {
      for (const func of functions) {
        const res = await this.checkRightFunction({ function: func, user });
        func.passed = !!res;
      }
      return functions;
    }

    //

    async delete({ id, module, name }) {
      if (id) {
        await this.model.delete({ id });
      } else {
        module = module || this.moduleName;
        await this.model.delete({ module, name });
      }
    }

    async _get({ id, module, name }) {
      if (id) return await this.model.get({ id });
      module = module || this.moduleName;
      return await this.model.get({ module, name });
    }

    async get({ id, module, name }) {
      module = module || this.moduleName;
      const res = await this._get({ id, module, name });
      if (res) return res;
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerFunction',
        data: { module, name },
      });
    }

    async register({ module, name }) {
      module = module || this.moduleName;
      // get
      const res = await this.model.get({ module, name });
      if (res) return res;
      const func = ctx.meta.base.function({ module, name });
      if (!func) throw new Error(`function not found: ${module}:${name}`);
      // atomClassId
      let atomClassId = 0;
      if (func.atomClassName) {
        const atomClass = await ctx.meta.atomClass.get({ module, atomClassName: func.atomClassName });
        atomClassId = atomClass.id;
      }
      // sceneId
      let sceneId;
      const sceneName = func.scene;
      if (!sceneName) {
        sceneId = 0;
      } else {
        const sceneItem = await this.modelFunctionScene.get({ scene: sceneName, menu: func.menu });
        if (sceneItem) {
          sceneId = sceneItem.id;
        } else {
          const res = await this.modelFunctionScene.insert({ scene: sceneName, menu: func.menu });
          sceneId = res.insertId;
        }
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

    async _checkFunctionLocales({ locale }) {
      locale = locale || ctx.locale;
      const sql = this.sqlProcedure.checkFunctionLocales({
        iid: ctx.instance.id,
        locale,
      });
      return await ctx.model.query(sql);
    }

    async checkLocale({ locale }) {
      const res = await this._checkFunctionLocales({ locale });
      if (res.length === 0) return;
      // queue
      await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'checkFunctionLocale',
        data: { locale },
      });
    }

    async _checkLocale({ locale }) {
      const res = await this._checkFunctionLocales({ locale });
      if (res.length === 0) return;
      // insert locales
      for (const menu of res) {
        const titleLocale = ctx.text.locale(locale, menu.title);
        await this.modelFunctionLocale.insert({
          functionId: menu.id,
          locale,
          titleLocale,
        });
      }
    }

    async clearLocales() {
      await this.modelFunctionLocale.delete();
    }

  }

  return Function;
};
