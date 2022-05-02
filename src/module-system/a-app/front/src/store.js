// eslint-disable-next-line
export default function (Vue) {
  const query = Vue.prototype.$utils.parseUrlQuery();
  return {
    state: {
      // global
      currentInner: {
        appKey: null,
        language: null,
      },
      appItems: {},
    },
    getters: {
      current(state) {
        return {
          appKey: state.currentInner.appKey || query.app || 'a-app:appDefault',
          language: state.currentInner.language || query.language || Vue.prototype.$meta.util.getLocale(),
          layout: Vue.prototype.$meta.vueApp.layout,
        };
      },
    },
    mutations: {},
    actions: {
      setAppItem(state, { appKey, appItem }) {
        state.appItems = {
          ...state.appItems,
          [appKey]: appItem,
        };
      },
      async getAppItem({ state, commit, dispatch }, { appKey }) {
        let appItem = state.appItems[appKey];
        if (appItem) return appItem;
        appItem = await Vue.prototype.$meta.api.post('/a/base/resource/read', {
          atomStaticKey: appKey,
          options: { locale: false },
        });
        appItem.content = appItem.content ? JSON.parse(appItem.content) : null;
        // get base app
        if (appKey !== 'a-app:appBase') {
          const appItemBase = await dispatch('getAppItem', { appKey: 'a-app:appBase' });
          appItem.content = Vue.prototype.$meta.util.extend({}, appItemBase.content, appItem.content);
        }
        commit('setAppItem', { appKey, appItem });
        return appItem;
      },
    },
  };
}
