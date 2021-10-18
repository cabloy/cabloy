const { locales } = require('../../../../../../node_modules/moment-timezone/index');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  const __atomClass = {
    module: moduleInfo.relativeName,
    atomClassName: 'dict',
  };

  const __dicts = {};

  class Dict extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'dict');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).dict;
    }

    get modelDictContent() {
      return ctx.model.module(moduleInfo.relativeName).dictContent;
    }

    // options: translate/separator
    async findItem({ dictKey, code, options }) {
      options = options || { separator: '/' };
      const dict = await this._getDict({ dictKey });
    }

    async _getDict({ dictKey }) {
      if (!__dicts[dictKey]) {
        __dicts[dictKey] = {};
      }
      if (!__dicts[dictKey][ctx.locale]) {
        __dicts[dictKey][ctx.locale] = await this._prepareDict({ dictKey, locale: ctx.locale });
      }
      return __dicts[dictKey][ctx.locale];
    }

    async _prepareDict({ dictKey, locale }) {
      // load
      const dict = await this._prepareDict_load({ dictKey });
      // prepare
      await this._prepareDict_adjust({ dict, locale });
      console.log(dict);
      // ok
      return dict;
    }

    async _prepareDict_load({ dictKey }) {
      if (!dictKey) return ctx.throw.module('a-base', 1002);
      // get atomId
      const atom = await ctx.bean.atom.modelAtom.get({
        atomStaticKey: dictKey,
        atomStage: 1,
      });
      if (!atom) return ctx.throw.module('a-base', 1002);
      const atomId = atom.id;
      // read
      const dict = await ctx.bean.atom.read({ key: { atomId } });
      if (!dict) return ctx.throw.module('a-base', 1002);
      // ok
      return dict;
    }

    async _prepareDict_adjust({ dict, locale }) {
      // init
      dict._dictItems = JSON.parse(dict.dictItems);
      dict._dictLocales = dict.dictLocales ? JSON.parse(dict.dictLocales) : null;
      dict._dictItemsMap = {};
      // adjust
      await this._prepareDict_adjust_loop({
        dict,
        dictItemsMap: dict._dictItemsMap,
        dictItems: dict._dictItems,
        locale,
      });
    }

    async _prepareDict_adjust_loop({ dict, dictItemsMap, dictItems, locale }) {
      for (const item of dictItems) {
        // self
        item.titleLocale = this._prepareDict_titleLocale({ dict, title: item.title, locale });
        dictItemsMap[item.code] = item;
        // children
        if (item.children) {
          item._childrenMap = {};
          await this._prepareDict_adjust_loop({
            dict,
            dictItemsMap: item._childrenMap,
            dictItems: item.children,
            locale,
          });
        }
      }
    }

    _prepareDict_titleLocale({ dict, title, locale }) {
      let titleLocale = ctx.bean.util.getProperty(dict._dictLocales, `${locale}.${title}`);
      if (!titleLocale && locale !== 'en-us') {
        titleLocale = ctx.bean.util.getProperty(dict._dictLocales, `en-us.${title}`);
      }
      if (!titleLocale) {
        titleLocale = ctx.text(title);
      }
      return titleLocale;
    }
  }

  return Dict;
};
