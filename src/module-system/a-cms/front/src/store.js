// eslint-disable-next-line
export default function (Vue) {
  return {
    state: {
      configSiteBase: {},
      configSite: {},
      languages: {},
    },
    getters: {},
    mutations: {
      setConfigSiteBase(state, { atomClass, configSiteBase }) {
        const atomClassNameFull = `${atomClass.module}:${atomClass.atomClassName}`;
        state.configSiteBase = {
          ...state.configSiteBase,
          [atomClassNameFull]: configSiteBase,
        };
      },
      setConfigSite(state, { atomClass, configSite }) {
        const atomClassNameFull = `${atomClass.module}:${atomClass.atomClassName}`;
        state.configSite = {
          ...state.configSite,
          [atomClassNameFull]: configSite,
        };
      },
      setLanguages(state, { atomClass, languages }) {
        const atomClassNameFull = `${atomClass.module}:${atomClass.atomClassName}`;
        state.languages = {
          ...state.languages,
          [atomClassNameFull]: languages,
        };
      },
    },
    actions: {
      getConfigSiteBase({ state, commit }, { atomClass }) {
        return new Promise((resolve, reject) => {
          const atomClassNameFull = `${atomClass.module}:${atomClass.atomClassName}`;
          const _configSiteBase = state.configSiteBase[atomClassNameFull];
          if (_configSiteBase) return resolve(_configSiteBase);
          Vue.prototype.$meta.api
            .post('/a/cms/site/getConfigSiteBase', { atomClass })
            .then(res => {
              const configSiteBase = res.data || {};
              commit('setConfigSiteBase', { atomClass, configSiteBase });
              resolve(configSiteBase);
            })
            .catch(err => reject(err));
        });
      },
      getConfigSite({ state, commit }, { atomClass }) {
        return new Promise((resolve, reject) => {
          const atomClassNameFull = `${atomClass.module}:${atomClass.atomClassName}`;
          const _configSite = state.configSite[atomClassNameFull];
          if (_configSite) return resolve(_configSite);
          Vue.prototype.$meta.api
            .post('/a/cms/site/getConfigSite', { atomClass })
            .then(res => {
              const configSite = res.data || {};
              commit('setConfigSite', { atomClass, configSite });
              resolve(configSite);
            })
            .catch(err => reject(err));
        });
      },
      getLanguages({ state, commit }, { atomClass }) {
        return new Promise((resolve, reject) => {
          const atomClassNameFull = `${atomClass.module}:${atomClass.atomClassName}`;
          const _languages = state.languages[atomClassNameFull];
          if (_languages) return resolve(_languages);
          Vue.prototype.$meta.api
            .post('/a/cms/site/getLanguages', { atomClass })
            .then(res => {
              const languages = res || [];
              commit('setLanguages', { atomClass, languages });
              resolve(languages);
            })
            .catch(err => reject(err));
        });
      },
    },
  };
}
