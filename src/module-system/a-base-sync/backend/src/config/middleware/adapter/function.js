const modelFn = require('../../../model/function.js');
const modelFunctionStarFn = require('../../../model/functionStar.js');
const modelFunctionLocaleFn = require('../../../model/functionLocale.js');

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Function {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._model = null;
      this._modelFunctionStar = null;
      this._modelFunctionLocale = null;
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

    // list
    //   locale maybe '' for selectAllFunctions beside menus
    async list({ options: { where, orders, page, star = 0, locale = '' }, user }) {
      // page = ctx.meta.util.page(page); // has set in controller

      const _where = ctx.model._where2(where);
      const _orders = ctx.model._orders(orders);
      const _limit = ctx.model._limit(page.size, page.index);

      // check locale
      if (locale) await this.checkLocale({ locale });

      // select
      const res = await ctx.model.query('call aSelectFunctions(?,?,?,?,?,?,?)',
        [ _where, _orders, _limit, ctx.instance.id, user.id, star, this.model.format('?', locale) ]
      );
      return res[0];
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

    async get({ id, module, name }) {
      if (id) return await this.model.get({ id });
      module = module || this.moduleName;
      const res = await this.model.get({ module, name });
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
      let atomClassId = 0;
      if (func.atomClassName) {
        const atomClass = await ctx.meta.atomClass.get({ module, atomClassName: func.atomClassName });
        atomClassId = atomClass.id;
      }
      const data = {
        module,
        name: func.name,
        title: func.title,
        scene: ctx.constant.module(moduleInfo.relativeName).function.scene[func.scene],
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
      const res = await ctx.model.query('call aCheckRightFunction(?,?,?)',
        [ ctx.instance.id, user.id, func.id ]
      );
      return res[0][0];
    }

    async checkLocale({ locale }) {
      locale = locale || ctx.locale;
      const res = await this.model.query('call aCheckFunctionLocales(?,?)',
        [ ctx.instance.id, locale ]);
      if (res[0].length === 0) return;
      // queue
      await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'checkFunctionLocale',
        data: { locale },
      });
    }

    async _checkLocale({ locale }) {
      const res = await this.model.query('call aCheckFunctionLocales(?,?)',
        [ ctx.instance.id, locale ]);
      if (res[0].length === 0) return;
      // insert locales
      for (const menu of res[0]) {
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
