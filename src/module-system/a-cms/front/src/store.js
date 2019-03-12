// eslint-disable-next-line
export default function(Vue) {

  return {
    state: {
      configSiteBase: null,
      configSite: null,
      languages: {},
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
      setLanguages(state, { atomClass, languages }) {
        state.languages = {
          ...state.languages,
          [atomClass.module]: languages,
        };
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
      getLanguages({ state, commit }, { atomClass }) {
        return new Promise((resolve, reject) => {
          const _languages = state.languages[atomClass.module];
          if (_languages) return resolve(_languages);
          Vue.prototype.$meta.api.post('/a/cms/site/getLanguages', { atomClass }).then(res => {
            const languages = res || [];
            commit('setLanguages', { atomClass, languages });
            resolve(languages);
          }).catch(err => reject(err));
        });
      },
    },
  };

}
