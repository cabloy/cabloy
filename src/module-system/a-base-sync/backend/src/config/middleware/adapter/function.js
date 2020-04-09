const modelFn = require('../../../model/function.js');
const modelFunctionStarFn = require('../../../model/functionStar.js');
const modelFunctionLocaleFn = require('../../../model/functionLocale.js');
const modelFunctionSceneFn = require('../../../model/functionScene.js');
const sqlProcedureFn = require('../../sql/procedure.js');

const __cacheSetLocalesStartup = '__setLocalesStartup';

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
        if (res) {
          func.passed = true;
          func.id = res.id;
        } else {
          func.passed = false;
        }
      }
      return functions;
    }

    async scenesArray({ sceneMenu }) {
      const list = await this.modelFunctionScene.select({
        where: { sceneMenu },
        orders: [[ 'sceneSorting', 'asc' ]],
      });
      for (const item of list) {
        const sceneName = item.sceneName;
        item.title = sceneName.replace(sceneName[0], sceneName[0].toUpperCase());
        item.titleLocale = ctx.text(item.title);
      }
      return list;
    }

    async scenes({ sceneMenu }) {
      const list = await this.scenesArray({ sceneMenu });
      const scenes = {};
      for (const item of list) {
        scenes[item.id] = item;
      }
      return scenes;
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

    async _setLocale({ locale, reset }) {
      let functions;
      // functions
      if (reset) {
        functions = await this.model.select();
      } else {
        functions = await this._checkFunctionLocales({ locale });
      }
      if (functions.length === 0) return;
      // insert locales
      for (const func of functions) {
        // title
        const funcBase = ctx.meta.base.function({ module: func.module, name: func.name });
        if (!funcBase) throw new Error(`function not found: ${func.module}:${func.nam}`);
        if (func.title !== funcBase.title) {
          await this.model.update({ id: func.id, title: funcBase.title });
        }
        // titleLocale
        const titleLocale = ctx.text.locale(locale, funcBase.title);
        await this.modelFunctionLocale.insert({
          functionId: func.id, locale, titleLocale,
        });
      }
    }

    async setLocales(options) {
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'setFunctionLocales',
        data: { options },
      });
    }

    async setLocalesQueue(options) {
      options = options || {};
      const reset = options.reset;
      // check cache
      if (reset && !ctx.app.meta.isTest) {
        const cache = ctx.cache.db.module(moduleInfo.relativeName);
        const flag = await cache.get(__cacheSetLocalesStartup);
        if (flag) return;
        // set
        await cache.set(__cacheSetLocalesStartup, true, 6 * 1000);
      }
      // clear
      if (reset) {
        await this.clearLocales();
      }
      // setLocales
      const locales = ctx.config.module(moduleInfo.relativeName).locales;
      for (const locale in locales) {
        await this._setLocale({ locale, reset });
      }
    }

    async clearLocales() {
      await this.modelFunctionLocale.delete();
    }

  }

  return Function;
};
