export default function (Vue) {
  return {
    state() {
      return {
        dicts: {},
      };
    },
    created() {
      Vue.prototype.$meta.eventHub.$on('auth:login', () => {
        // clear user state
        this.dicts = {};
      });
    },
    actions: {
      setDict({ dictKey, dict }) {
        _adjustDict({ dict });
        this.dicts[dictKey] = dict;
      },
      async getDict({ dictKey }) {
        if (this.dicts[dictKey]) return this.dicts[dictKey];
        const data = await Vue.prototype.$meta.api.post('/a/dict/dict/getDict', { dictKey });
        const dict = data;
        this.setDict({ dictKey, dict });
        return dict;
      },
      // dict: support a/basestore/atomState
      //   code is full
      async findItem({ dict, dictKey, code: codeFull, options }) {
        if (_checkIfEmptyForSelect(codeFull)) return null;
        codeFull = String(codeFull);
        // trim ending /
        if (codeFull.charAt(codeFull.length - 1) === '/') {
          codeFull = codeFull.substring(0, codeFull.length - 1);
        }
        // separator
        const separator = options?.separator || '/';
        // dict
        if (!dict) {
          dict = await this.getDict({ dictKey });
        }
        if (!dict._cache) dict._cache = {};
        let dictItemRes = dict._cache[codeFull];
        if (dictItemRes) return dictItemRes;
        // find
        const dictItemsRes = [];
        const res = _findItem_loop({
          dictItemsRes,
          dictItemsMap: dict._dictItemsMap,
          codes: codeFull.split('/'),
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
        dict._cache[codeFull] = dictItemRes;
        // ok
        return dictItemRes;
      },
    },
  };
}

function _checkIfEmptyForSelect(value) {
  return value === '' || value === undefined || value === null;
}

function _adjustDict({ dict }) {
  dict._dictItemsMap = {};
  // adjust
  _adjustDict_loop({
    dict,
    dictItemsMap: dict._dictItemsMap,
    dictItems: dict._dictItems,
    itemParent: null,
  });
}

function _adjustDict_loop({ dict, dictItemsMap, dictItems, itemParent }) {
  for (const item of dictItems) {
    // codeFull
    let codeFull = itemParent ? `${itemParent.codeFull}${item.code}` : item.code;
    if (item.children) {
      codeFull = `${codeFull}/`;
    }
    item.codeFull = codeFull;
    // self
    dictItemsMap[item.code] = item;
    // children
    if (item.children) {
      item._childrenMap = {};
      _adjustDict_loop({
        dict,
        dictItemsMap: item._childrenMap,
        dictItems: item.children,
        itemParent: item,
      });
    }
  }
}

function _findItem_loop({ dictItemsRes, dictItemsMap, codes }) {
  const code = codes.shift();
  const dictItem = dictItemsMap && dictItemsMap[code];
  if (!dictItem) return false;
  dictItemsRes.push(dictItem);
  if (codes.length === 0) return true;
  return _findItem_loop({
    dictItemsRes,
    dictItemsMap: dictItem._childrenMap,
    codes,
  });
}
