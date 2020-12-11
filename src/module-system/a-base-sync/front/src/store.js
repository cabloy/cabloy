// eslint-disable-next-line
export default function(Vue) {

  const __atomClassResource = {
    module: 'a-base',
    atomClassName: 'resource',
  };

  const queueLayoutConfig = Vue.prototype.$meta.util.queue((info, cb) => {
    const user = Vue.prototype.$meta.store.getState('auth/user');
    if (user.op.id !== info.userId) return cb();
    Vue.prototype.$meta.api.post('/a/base/layoutConfig/saveKey', info.data).then(() => {
      // donothing
      cb();
    }).catch(err => {
      console.error(err);
      cb();
    });
  });

  Vue.prototype.$meta.eventHub.$on('auth:login', data => {
    Vue.prototype.$meta.store.commit('a/base/authLogin', data);
  });

  return {
    state: {
      // user
      labels: null,
      layoutConfig: {},
      userAtomClassRolesPreferred: {},
      resourceTrees: {},
      resources: {},
      categories: {},
      tags: {},
      // global
      locales: null,
      modules: null,
      atomClasses: null,
      actions: null,
      resourceTypes: null,
    },
    getters: {
      userLabels(state) {
        return state.labels;
      },
    },
    mutations: {
      authLogin(state) {
        // clear user
        state.labels = null;
        state.layoutConfig = {};
        state.userAtomClassRolesPreferred = {};
        state.resourceTrees = {};
        state.resources = {};
        state.categories = {};
        state.tags = {};
      },
      setLabels(state, labels) {
        state.labels = labels;
      },
      setLayoutConfig(state, { module, data }) {
        state.layoutConfig = {
          ...state.layoutConfig,
          [module]: data,
        };
      },
      setLayoutConfigKey(state, { module, key, value }) {
        let layoutConfigModule = state.layoutConfig[module] || {};
        layoutConfigModule = {
          ...layoutConfigModule,
          [key]: value,
        };
        state.layoutConfig = {
          ...state.layoutConfig,
          [module]: layoutConfigModule,
        };
        // try to save
        const user = Vue.prototype.$meta.store.getState('auth/user');
        if (!user.op.anonymous) {
          const data = { module, key, value };
          queueLayoutConfig.push({ userId: user.op.id, data });
        }
      },
      setUserAtomClassRolesPreferred(state, { atomClassId, roleIdOwner }) {
        state.userAtomClassRolesPreferred = {
          ...state.userAtomClassRolesPreferred,
          [atomClassId]: roleIdOwner,
        };
      },
      setLocales(state, locales) {
        state.locales = locales;
      },
      setModules(state, modules) {
        state.modules = modules;
      },
      setAtomClasses(state, atomClasses) {
        state.atomClasses = atomClasses;
      },
      setActions(state, actions) {
        state.actions = actions;
      },
      setResourceTypes(state, resourceTypes) {
        state.resourceTypes = resourceTypes;
      },
      setResourceTrees(state, { resourceType, tree }) {
        state.resourceTrees = {
          ...state.resourceTrees,
          [resourceType]: tree,
        };
      },
      setResources(state, { resourceType, resources }) {
        state.resources = {
          ...state.resources,
          [resourceType]: resources,
        };
      },
      setCategories(state, { atomClass, language, categories }) {
        const key = `${atomClass.module}:${atomClass.atomClassName}:${language || ''}`;
        state.categories = {
          ...state.categories,
          [key]: categories,
        };
      },
      setTags(state, { atomClass, language, tags }) {
        const key = `${atomClass.module}:${atomClass.atomClassName}:${language || ''}`;
        state.tags = {
          ...state.tags,
          [key]: tags,
        };
      },
    },
    actions: {
      getLabels({ commit, getters }) {
        return new Promise((resolve, reject) => {
          const userLabels = getters.userLabels;
          if (userLabels) return resolve(userLabels);
          Vue.prototype.$meta.api.post('/a/base/user/getLabels').then(data => {
            data = data || {};
            commit('setLabels', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getModules({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.modules) return resolve(state.modules);
          Vue.prototype.$meta.api.post('/a/base/base/modules').then(data => {
            data = data || {};
            commit('setModules', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getResourceTypes({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.resourceTypes) return resolve(state.resourceTypes);
          Vue.prototype.$meta.api.post('/a/base/base/resourceTypes').then(data => {
            data = data || {};
            commit('setResourceTypes', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getLocales({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.locales) return resolve(state.locales);
          Vue.prototype.$meta.api.post('/a/base/base/locales').then(data => {
            data = data || [];
            commit('setLocales', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getAtomClasses({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.atomClasses) return resolve(state.atomClasses);
          Vue.prototype.$meta.api.post('/a/base/base/atomClasses').then(data => {
            data = data || {};
            commit('setAtomClasses', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getActions({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.actions) return resolve(state.actions);
          Vue.prototype.$meta.api.post('/a/base/base/actions').then(data => {
            data = data || {};
            commit('setActions', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getResourceTrees({ state, commit }, { resourceType }) {
        return new Promise((resolve, reject) => {
          if (state.resourceTrees[resourceType]) return resolve(state.resourceTrees[resourceType]);
          Vue.prototype.$meta.api.post('/a/base/category/child', {
            atomClass: __atomClassResource,
            categoryId: 0,
            categoryName: resourceType,
          }).then(categoryRoot => {
            Vue.prototype.$meta.api.post('/a/base/category/tree', {
              atomClass: __atomClassResource,
              categoryId: categoryRoot.id,
              categoryHidden: 0,
              setLocale: true,
            }).then(data => {
              const tree = data.list;
              commit('setResourceTrees', { resourceType, tree });
              resolve(tree);
            }).catch(err => {
              reject(err);
            });
          }).catch(err => {
            reject(err);
          });
        });
      },
      getResources({ state, commit }, { resourceType }) {
        return new Promise((resolve, reject) => {
          if (state.resources[resourceType]) return resolve(state.resources[resourceType]);
          Vue.prototype.$meta.api.post('/a/base/resource/select', {
            options: {
              resourceType,
              orders: [[ 'f.resourceSorting', 'asc' ], [ 'f.createdAt', 'asc' ]],
            },
          }).then(data => {
            const resources = {};
            for (const item of data.list) {
              resources[item.atomStaticKey] = item;
            }
            commit('setResources', { resourceType, resources });
            resolve(resources);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getCategories({ state, commit }, { atomClass, language }) {
        return new Promise((resolve, reject) => {
          const key = `${atomClass.module}:${atomClass.atomClassName}:${language || ''}`;
          if (state.categories[key]) return resolve(state.categories[key]);
          Vue.prototype.$meta.api.post('/a/base/category/children', {
            atomClass,
            language: language || undefined,
          }).then(data => {
            const categories = data.list;
            commit('setCategories', { atomClass, language, categories });
            resolve(categories);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getTags({ state, commit }, { atomClass, language }) {
        return new Promise((resolve, reject) => {
          const key = `${atomClass.module}:${atomClass.atomClassName}:${language || ''}`;
          if (state.tags[key]) return resolve(state.tags[key]);
          const options = {
            where: { },
            orders: [
              [ 'tagName', 'asc' ],
            ],
          };
          if (language) {
            options.where.language = language;
          }
          Vue.prototype.$meta.api.post('/a/base/tag/list', {
            atomClass,
            options,
          }).then(data => {
            const tags = data.list;
            commit('setTags', { atomClass, language, tags });
            resolve(tags);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getLayoutConfig({ state, commit }, module) {
        return new Promise((resolve, reject) => {
          if (state.layoutConfig[module]) return resolve(state.layoutConfig[module]);
          Vue.prototype.$meta.api.post('/a/base/layoutConfig/load', { module }).then(data => {
            data = data || {};
            commit('setLayoutConfig', { module, data });
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
    },
  };

}
