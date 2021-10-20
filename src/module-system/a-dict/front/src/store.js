// eslint-disable-next-line
export default function (Vue) {
  Vue.prototype.$meta.eventHub.$on('auth:login', data => {
    Vue.prototype.$meta.store.commit('a/dict/authLogin', data);
  });
  return {
    state: {
      dicts: {},
    },
    getters: {},
    mutations: {
      authLogin(state) {
        // clear user
        state.dicts = {};
      },
      setDict(state, { dictKey, dict }) {
        state.dicts = {
          ...state.dicts,
          [dictKey]: dict,
        };
      },
    },
    actions: {
      async getDict({ state, commit }, { dictKey }) {
        if (state.dicts[dictKey]) return state.dicts[dictKey];
        const data = await Vue.prototype.$meta.api.post('/a/dict/dict/getDict', { dictKey });
        const dict = data;
        _adjustDict({ dict });
        commit('setDict', { dictKey, dict });
        return dict;
      },
      async findItem({ state, dispatch }, { dictKey, code, options }) {
        if (!code) return null;
        code = String(code);
        // options
        options = options || { separator: '/' };
        const separator = options.separator;
        // dict
        const dict = await dispatch('getDict', { dictKey });
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

function _adjustDict({ dict }) {
  dict._dictItemsMap = {};
  // adjust
  _adjustDict_loop({
    dict,
    dictItemsMap: dict._dictItemsMap,
    dictItems: dict._dictItems,
  });
}

function _adjustDict_loop({ dict, dictItemsMap, dictItems }) {
  for (const item of dictItems) {
    // self
    dictItemsMap[item.code] = item;
    // children
    if (item.children) {
      item._childrenMap = {};
      _adjustDict_loop({
        dict,
        dictItemsMap: item._childrenMap,
        dictItems: item.children,
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
