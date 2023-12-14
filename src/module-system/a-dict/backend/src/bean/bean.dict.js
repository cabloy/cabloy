const moduleInfo = module.info;
const __SeparatorCode = '/';
module.exports = class Dict extends module.meta.class.BeanModuleBase {
  constructor(moduleName) {
    super(moduleName, 'dict');
  }

  get cacheMem() {
    return this.ctx.cache.mem.module(moduleInfo.relativeName);
  }

  get atomClass() {
    return {
      module: moduleInfo.relativeName,
      atomClassName: 'dict',
    };
  }

  get model() {
    return this.ctx.model.module(moduleInfo.relativeName).dict;
  }

  get modelDictContent() {
    return this.ctx.model.module(moduleInfo.relativeName).dictContent;
  }

  // options: separator
  //  find by code or title
  async findItem({ dictKey, code: codeFull, title, options }) {
    let findByCode;
    if (!this._checkIfEmptyForSelect(codeFull)) {
      codeFull = String(codeFull);
      // trim ending /
      if (codeFull.charAt(codeFull.length - 1) === '/') {
        codeFull = codeFull.substring(0, codeFull.length - 1);
      }
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
    const locale = this.ctx.locale;
    // dict
    const dict = await this.getDict({ dictKey, locale });
    if (!dict._cacheCode) dict._cacheCode = {};
    if (!dict._cacheTitle) dict._cacheTitle = {};
    let dictItemRes = findByCode ? dict._cacheCode[codeFull] : dict._cacheTitle[title];
    if (dictItemRes) return dictItemRes;
    // find
    const dictItemsRes = [];
    const res = this._findItem_loop({
      dictItemsRes,
      dictItems: dict._dictItems,
      dictItemsMap: dict._dictItemsMap,
      codes: findByCode ? codeFull.split(__SeparatorCode) : undefined,
      titles: findByCode ? undefined : title.split(separator),
      findByCode,
    });
    if (!res) return null;
    const titleFull = dictItemsRes.map(item => item.title).join(separator);
    const titleLocaleFull = dictItemsRes.map(item => item.titleLocale).join(separator);
    dictItemRes = {
      ...dictItemsRes[dictItemsRes.length - 1],
      titleFull,
      titleLocaleFull,
    };
    // cache
    if (findByCode) {
      dict._cacheCode[codeFull] = dictItemRes;
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
    const childrenMapKey = `${dictItem.code}:childrenMap`;
    return this._findItem_loop({
      dictItemsRes,
      dictItems: dictItem.children,
      dictItemsMap: dictItemsMap[childrenMapKey],
      codes,
      titles,
      findByCode,
    });
  }

  async getDict({ dictKey, locale }) {
    locale = locale || this.ctx.locale;
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
    const atomClass = await this.ctx.bean.atomClass.get(this.atomClass);
    const atom = await this.ctx.bean.atom.modelAtom.get({
      atomClassId: atomClass.id,
      atomStaticKey: dictKey,
      atomStage: 1,
    });
    if (!atom) {
      // try preload
      const atomKey = await this.ctx.bean.atomStatic.preloadAtomStatic({ atomStaticKey: dictKey });
      if (!atomKey) throw new Error(`dict not found: ${dictKey}`);
      atomId = atomKey.atomId;
    } else {
      atomId = atom.id;
    }
    // check resource right
    if (user) {
      const res = await this.ctx.bean.resource.checkRightResource({ resourceAtomId: atomId, user });
      if (!res) this.ctx.throw(403);
    }
    if (!returnDict) return true;
    // read
    const dict = await this.ctx.bean.atom.read({ key: { atomId } });
    if (!dict) return this.ctx.throw.module('a-base', 1002);
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
      itemParent: null,
    });
  }

  _prepareDict_adjust_loop({ dict, dictItemsMap, dictItems, locale, itemParent }) {
    for (const item of dictItems) {
      // codeFull
      let codeFull = itemParent ? `${itemParent.codeFull}${item.code}` : item.code;
      if (item.children) {
        codeFull = `${codeFull}/`;
      }
      item.codeFull = codeFull;
      // self
      item.titleLocale = this._prepareDict_titleLocale({ dict, title: item.title, locale });
      dictItemsMap[item.code] = item;
      // children
      if (item.children) {
        const childrenMapKey = `${item.code}:childrenMap`;
        dictItemsMap[childrenMapKey] = {};
        this._prepareDict_adjust_loop({
          dict,
          dictItemsMap: dictItemsMap[childrenMapKey],
          dictItems: item.children,
          locale,
          itemParent: item,
        });
      }
    }
  }

  _prepareDict_titleLocale({ dict, title, locale }) {
    return this.ctx.bean.util.getTitleLocale({
      locales: dict._dictLocales,
      title,
      locale,
    });
  }

  _checkIfEmptyForSelect(value) {
    return value === '' || value === undefined || value === null;
  }
};
