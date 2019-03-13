// eslint-disable-next-line
export default function(Vue) {

  return {
    state: {
      configSiteBase: {},
      configSite: {},
      languages: {},
    },
    getters: {
    },
    mutations: {
      setConfigSiteBase(state, { atomClass, configSiteBase }) {
        state.configSiteBase = {
          ...state.configSiteBase,
          [atomClass.module]: configSiteBase,
        };
      },
      setConfigSite(state, { atomClass, configSite }) {
        state.configSite = {
          ...state.configSite,
          [atomClass.module]: configSite,
        };
      },
      setLanguages(state, { atomClass, languages }) {
        state.languages = {
          ...state.languages,
          [atomClass.module]: languages,
        };
      },
    },
    actions: {
      getConfigSiteBase({ state, commit }, { atomClass }) {
        return new Promise((resolve, reject) => {
          const _configSiteBase = state.configSiteBase[atomClass.module];
          if (_configSiteBase) return resolve(_configSiteBase);
          Vue.prototype.$meta.api.post('/a/cms/site/getConfigSiteBase', { atomClass }).then(res => {
            const configSiteBase = res.data || {};
            commit('setConfigSiteBase', { atomClass, configSiteBase });
            resolve(configSiteBase);
          }).catch(err => reject(err));
        });
      },
      getConfigSite({ state, commit }, { atomClass }) {
        return new Promise((resolve, reject) => {
          const _configSite = state.configSite[atomClass.module];
          if (_configSite) return resolve(_configSite);
          Vue.prototype.$meta.api.post('/a/cms/site/getConfigSite', { atomClass }).then(res => {
            const configSite = res.data || {};
            commit('setConfigSite', { atomClass, configSite });
            resolve(configSite);
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
