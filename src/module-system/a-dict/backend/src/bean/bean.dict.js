const __dicts = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
      if (!code) return null;
      code = String(code);
      // options
      options = options || { separator: '/' };
      const separator = options.separator;
      // locale
      const locale = ctx.locale;
      // dict
      const dict = await this._getDict({ dictKey, locale });
      if (!dict._cache) dict._cache = {};
      let dictItemRes = dict._cache[code];
      if (dictItemRes) return dictItemRes;
      // find
      const dictItemsRes = [];
      const res = this._findItem_loop({
        dictItemsRes,
        dictItemsMap: dict._dictItemsMap,
        codes: code.split('/'),
      });
      if (!res) return null;
      const titleFull = dictItemsRes.map(item => item.title).join(separator);
      const titleLocaleFull = dictItemsRes.map(item => item.titleLocale).join(separator);
      dictItemRes = {
        ...dictItemsRes[dictItemsRes.length - 1],
        codeFull: code,
        titleFull,
        titleLocaleFull,
      };
      // cache
      dict._cache[code] = dictItemRes;
      // ok
      return dictItemRes;
    }

    _findItem_loop({ dictItemsRes, dictItemsMap, codes }) {
      const code = codes.shift();
      const dictItem = dictItemsMap && dictItemsMap[code];
      if (!dictItem) return false;
      dictItemsRes.push(dictItem);
      if (codes.length === 0) return true;
      return this._findItem_loop({
        dictItemsRes,
        dictItemsMap: dictItem._childrenMap,
        codes,
      });
    }

    async _getDict({ dictKey, locale }) {
      if (!__dicts[dictKey]) {
        __dicts[dictKey] = {};
      }
      if (!__dicts[dictKey][locale]) {
        __dicts[dictKey][locale] = await this._prepareDict({ dictKey, locale });
      }
      return __dicts[dictKey][locale];
    }

    async _prepareDict({ dictKey, locale }) {
      // load
      const dict = await this._prepareDict_load({ dictKey });
      // prepare
      this._prepareDict_adjust({ dict, locale });
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

    _prepareDict_adjust({ dict, locale }) {
      // init
      dict._dictItems = JSON.parse(dict.dictItems);
      dict._dictLocales = dict.dictLocales ? JSON.parse(dict.dictLocales) : null;
      dict._dictItemsMap = {};
      // adjust
      this._prepareDict_adjust_loop({
        dict,
        dictItemsMap: dict._dictItemsMap,
        dictItems: dict._dictItems,
        locale,
      });
    }

    _prepareDict_adjust_loop({ dict, dictItemsMap, dictItems, locale }) {
      for (const item of dictItems) {
        // self
        item.titleLocale = this._prepareDict_titleLocale({ dict, title: item.title, locale });
        dictItemsMap[item.code] = item;
        // children
        if (item.children) {
          item._childrenMap = {};
          this._prepareDict_adjust_loop({
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
