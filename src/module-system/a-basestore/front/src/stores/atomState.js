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
      setDict({ atomClass, atomStage, dict }) {
        this.dicts[dictKey] = dict;
      },
      async getDict({ atomClass, atomStage }) {
        if (this.dicts[dictKey]) return this.dicts[dictKey];
        const data = await Vue.prototype.$meta.api.post('/a/dict/dict/getDict', { dictKey });
        const dict = data;
        _adjustDict({ dict });
        this.setDict({ dictKey, dict });
        return dict;
      },
      async findItem({ dictKey, code, options }) {
        if (_checkIfEmptyForSelect(code)) return null;
        code = String(code);
        // options
        options = options || { separator: '/' };
        const separator = options.separator;
        // dict
        const dict = await this.getDict({ dictKey });
        if (!dict._cache) dict._cache = {};
        let dictItemRes = dict._cache[code];
        if (dictItemRes) return dictItemRes;
        // find
        const dictItemsRes = [];
        const res = _findItem_loop({
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
      },
    },
  };
}
