// eslint-disable-next-line
export default function(Vue) {

  return {
    state: {
      configSiteBase: null,
      configSite: null,
      languages: null,
    },
    getters: {
    },
    mutations: {
      setConfigSiteBase(state, configSiteBase) {
        state.configSiteBase = configSiteBase;
      },
      setConfigSite(state, configSite) {
        state.configSite = configSite;
      },
      setLanguages(state, languages) {
        state.languages = languages;
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
      getLanguages({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.languages) return resolve(state.languages);
          Vue.prototype.$meta.api.post('/a/cms/site/getLanguages').then(res => {
            const data = res || [];
            commit('setLanguages', data);
            resolve(data);
          }).catch(err => reject(err));
        });
      },
    },
  };

}
