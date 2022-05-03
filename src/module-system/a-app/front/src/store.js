// eslint-disable-next-line
export default function (Vue) {
  const query = Vue.prototype.$utils.parseUrlQuery();
  return {
    state: {
      // global
      currentInner: {
        appKey: null,
        appLanguage: null,
      },
      appItems: {},
    },
    getters: {
      current(state) {
        // appKey
        const appKey = state.currentInner.appKey || query.appKey || 'a-app:appDefault';
        // appLanguage
        const appLanguage = state.currentInner.appLanguage || query.appLanguage || Vue.prototype.$meta.util.getLocale();
        // user
        const user = Vue.prototype.$meta.store.state.auth.user.op;
        const userStatus = user.anonymous ? 'anonymous' : 'authenticated';
        // layout
        const layout = Vue.prototype.$meta.vueApp.layout;
        // ok
        return {
          appKey,
          appLanguage,
          userStatus,
          layout,
        };
      },
      appItemCurrent(state, getters) {
        return state.appItems[getters.current.appKey];
      },
      presetConfigCurrent(state, getters) {
        const appItem = getters.appItemCurrent;
        if (!appItem) return null;
        // current
        const current = getters.current;
        // preset config
        const presetConfig = appItem.content.presets[current.userStatus][current.layout];
        return presetConfig[current.appLanguage] || presetConfig;
      },
    },
    mutations: {
      setAppItem(state, { appKey, appItem }) {
        state.appItems = {
          ...state.appItems,
          [appKey]: appItem,
        };
      },
    },
    actions: {
      async getPresetConfigCurrent({ state, getters, dispatch }) {
        // force appItem exists
        await dispatch('getAppItemCurrent');
        // current
        return getters.presetConfigCurrent;
      },
      async getAppItemCurrent({ state, getters, dispatch }) {
        return await dispatch('getAppItem', { appKey: getters.current.appKey });
      },
      async getAppItem({ state, commit, dispatch }, { appKey }) {
        let appItem = state.appItems[appKey];
        if (appItem) return appItem;
        appItem = await Vue.prototype.$meta.api.post('/a/base/resource/read', {
          atomStaticKey: appKey,
          options: {
            //  locale: false, // should return locale info
          },
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
