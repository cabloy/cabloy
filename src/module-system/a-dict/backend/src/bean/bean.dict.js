const __dicts = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Dict extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'dict');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get atomClass() {
      return {
        module: moduleInfo.relativeName,
        atomClassName: 'dict',
      };
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).dict;
    }

    get modelDictContent() {
      return ctx.model.module(moduleInfo.relativeName).dictContent;
    }

    // options: separator
    async findItem({ dictKey, code, options }) {
      if (this._checkIfEmptyForSelect(code)) return null;
      code = String(code);
      // options
      options = options || { separator: '/' };
      const separator = options.separator;
      // locale
      const locale = ctx.locale;
      // dict
      const dict = await this.getDict({ dictKey, locale });
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

    async getDict({ dictKey, locale }) {
      locale = locale || ctx.locale;
      if (!__dicts[dictKey]) {
        __dicts[dictKey] = {};
      }
      if (!__dicts[dictKey][locale]) {
        const res = await this._prepareDict({ dictKey, locale });
        // maybe cleared by broadcast
        if (!__dicts[dictKey]) {
          __dicts[dictKey] = {};
        }
        __dicts[dictKey][locale] = res;
      }
      return __dicts[dictKey][locale];
    }

    async _prepareDict({ dictKey, locale }) {
      // load
      const dict = await this._prepareDict_load({ dictKey, user: null, returnDict: true });
      // prepare
      this._prepareDict_adjust({ dict, locale });
      // ok
      return dict;
    }

    async _prepareDict_load({ dictKey, user, returnDict }) {
      if (!dictKey) throw new Error('dictKey not set');
      // get atomId
      let atomId;
      const atomClass = await ctx.bean.atomClass.get(this.atomClass);
      const atom = await ctx.bean.atom.modelAtom.get({
        atomClassId: atomClass.id,
        atomStaticKey: dictKey,
        atomStage: 1,
      });
      if (!atom) {
        // try preload
        const atomKey = await ctx.bean.atomStatic.preloadAtomStatic({ atomStaticKey: dictKey });
        if (!atomKey) throw new Error(`dict not found: ${dictKey}`);
        atomId = atomKey.atomId;
      } else {
        atomId = atom.id;
      }
      // check resource right
      if (user) {
        const res = await ctx.bean.resource.checkRightResource({ resourceAtomId: atomId, user });
        if (!res) ctx.throw(403);
      }
      if (!returnDict) return true;
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
      return ctx.bean.util.getTitleLocale({
        locales: dict._dictLocales,
        title,
        locale,
      });
    }

    _broadcastDictCacheRemove({ dictKey }) {
      delete __dicts[dictKey];
    }

    _checkIfEmptyForSelect(value) {
      return value === '' || value === undefined || value === null;
    }
  }

  return Dict;
};
