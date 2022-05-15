const __appKeyDefault = 'a-app:appDefault';
export default function (Vue) {
  return {
    state: {},
    getters: {},
    mutations: {},
    actions: {
      async getAppInfo({ state }, { appKey, force }) {
        const $store = Vue.prototype.$meta.store;
        let configMine;
        // info
        let appItem = await $store.dispatch('a/app/getAppItem', { appKey });
        // current
        const presetConfigCurrent = await $store.dispatch('a/app/getPresetConfig', { appKey });
        configMine = presetConfigCurrent.mine;
        if (!configMine.layout && force) {
          appKey = __appKeyDefault;
          const presetConfigDefault = await $store.dispatch('a/app/getPresetConfigDefault');
          configMine = presetConfigDefault.mine;
          appItem = await $store.dispatch('a/app/getAppItemDefault');
        }
        if (!configMine.layout) return null;
        // ok
        return {
          appKey,
          appMineLayout: configMine.layout,
          appItem,
        };
      },
    },
  };
}
