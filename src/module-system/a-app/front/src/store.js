// eslint-disable-next-line
export default function (Vue) {
  return {
    state: {
      // global
      appItems: {},
    },
    getters: {},
    mutations: {},
    actions: {
      setAppItem(state, { appKey, appItem }) {
        state.appItems = {
          ...state.appItems,
          [appKey]: appItem,
        };
      },
      async getAppItem({ state, commit }, { appKey }) {
        let appItem = state.appItems[appKey];
        if (appItem) return appItem;
        appItem = await Vue.prototype.$meta.api.post('/a/base/resource/read', {
          atomStaticKey: appKey,
          options: { locale: false },
        });
        appItem.content = appItem.content ? JSON.parse(appItem.content) : null;
        commit('setAppItem', { appKey, appItem });
        return appItem;
      },
    },
  };
}
