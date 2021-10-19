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
              commit('setDashboardUsers', { dictKey, dict });
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
