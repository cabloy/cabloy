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
      getDict({ state, commit }, { dictKey }) {
        return new Promise((resolve, reject) => {
          if (state.dicts[dictKey]) return resolve(state.dicts[dictKey]);
          Vue.prototype.$meta.api
            .post('/a/dict/dict/getDict', { dictKey })
            .then(data => {
              const dict = data;
              _adjustDict({ dict });
              commit('setDict', { dictKey, dict });
              resolve(dict);
            })
            .catch(err => {
              reject(err);
            });
        });
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
      this._adjustDict_loop({
        dict,
        dictItemsMap: item._childrenMap,
        dictItems: item.children,
      });
    }
  }
}
