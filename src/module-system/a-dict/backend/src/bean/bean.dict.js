module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __SeparatorCode = '/';
  class Dict extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'dict');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get cacheMem() {
      return ctx.cache.mem.module(moduleInfo.relativeName);
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
    //  find by code or title
    async findItem({ dictKey, code, title, options }) {
      let findByCode;
      if (!this._checkIfEmptyForSelect(code)) {
        code = String(code);
        findByCode = true;
      } else if (title) {
        findByCode = false;
      } else {
        return null;
      }
      // options
      options = options || { separator: '/' };
      const separator = options.separator;
      // locale
      const locale = ctx.locale;
      // dict
      const dict = await this.getDict({ dictKey, locale });
      if (!dict._cacheCode) dict._cacheCode = {};
      if (!dict._cacheTitle) dict._cacheTitle = {};
      let dictItemRes = findByCode ? dict._cacheCode[code] : dict._cacheTitle[title];
      if (dictItemRes) return dictItemRes;
      // find
      const dictItemsRes = [];
      const res = this._findItem_loop({
        dictItemsRes,
        dictItems: dict._dictItems,
        dictItemsMap: dict._dictItemsMap,
        codes: findByCode ? code.split(__SeparatorCode) : undefined,
        titles: findByCode ? undefined : title.split(separator),
        findByCode,
      });
      if (!res) return null;
      const codeFull = findByCode ? code : dictItemsRes.map(item => item.code).join(__SeparatorCode);
      const titleFull = dictItemsRes.map(item => item.title).join(separator);
      const titleLocaleFull = dictItemsRes.map(item => item.titleLocale).join(separator);
      dictItemRes = {
        ...dictItemsRes[dictItemsRes.length - 1],
        codeFull,
        titleFull,
        titleLocaleFull,
      };
      // cache
      if (findByCode) {
        dict._cacheCode[code] = dictItemRes;
      } else {
        dict._cacheTitle[title] = dictItemRes;
      }
      // ok
      return dictItemRes;
    }

    _findItem_loop({ dictItemsRes, dictItems, dictItemsMap, codes, titles, findByCode }) {
      let dictItem;
      if (findByCode) {
        const code = codes.shift();
        dictItem = dictItemsMap && dictItemsMap[code];
        if (!dictItem) return false;
        dictItemsRes.push(dictItem);
        if (codes.length === 0) return true;
      } else {
        const title = titles.shift();
        dictItem = dictItems && dictItems.find(item => item.title === title || item.titleLocale === title);
        if (!dictItem) return false;
        dictItemsRes.push(dictItem);
        if (titles.length === 0) return true;
      }
      return this._findItem_loop({
        dictItemsRes,
        dictItems: dictItem.children,
        dictItemsMap: dictItem._childrenMap,
        codes,
        titles,
        findByCode,
      });
    }

    async getDict({ dictKey, locale }) {
      locale = locale || ctx.locale;
      let dict = this.cacheMem.get(dictKey);
      if (dict && dict[locale]) return dict[locale];
      if (!dict) {
        dict = {};
      }
      if (!dict[locale]) {
        dict[locale] = await this._prepareDict({ dictKey, locale });
      }
      this.cacheMem.set(dictKey, dict);
      return dict[locale];
    }

    dictCacheRemove({ dictKey }) {
      this.cacheMem.remove(dictKey);
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

    _checkIfEmptyForSelect(value) {
      return value === '' || value === undefined || value === null;
    }
  }

  return Dict;
};
