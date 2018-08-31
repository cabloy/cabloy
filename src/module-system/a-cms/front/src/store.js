// eslint-disable-next-line
export default function(Vue) {

  return {
    state: {
      configSiteBase: null,
      configSite: null,
    },
    getters: {
      languages(state) {
        if (!state.configSiteBase || !state.configSite) return null;
        const site = Vue.prototype.$utils.extend({}, state.configSiteBase, state.configSite);
        return site.language.items.split(',');
      },
    },
    mutations: {
      setConfigSiteBase(state, configSiteBase) {
        state.configSiteBase = configSiteBase;
      },
      setConfigSite(state, configSite) {
        state.configSite = configSite;
      },
    },
    actions: {
      getConfigSiteBase({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.configSiteBase) return resolve(state.configSiteBase);
          Vue.prototype.$meta.api.post('/a/cms/site/getConfigSiteBase').then(res => {
            const data = res.data || {};
            commit('setConfigSiteBase', data);
            resolve(data);
          }).catch(err => reject(err));
        });
      },
      getConfigSite({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.configSite) return resolve(state.configSite);
          Vue.prototype.$meta.api.post('/a/cms/site/getConfigSite').then(res => {
            const data = res.data || {};
            commit('setConfigSite', data);
            resolve(data);
          }).catch(err => reject(err));
        });
      },
      getLanguages({ getters, dispatch }) {
        return new Promise((resolve, reject) => {
          if (getters.languages) return resolve(getters.languages);
          dispatch('getConfigSiteBase').then(() => {
            dispatch('getConfigSite').then(() => {
              resolve(getters.languages);
            });
          }).catch(err => reject(err));
        });
      },
    },
  };

}
