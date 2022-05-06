// eslint-disable-next-line
export default function (Vue) {
  const __atomClassResource = {
    module: 'a-base',
    atomClassName: 'resource',
  };

  const queueLayoutConfig = Vue.prototype.$meta.util.queue((info, cb) => {
    const user = Vue.prototype.$meta.store.getState('auth/user');
    if (user.op.id !== info.userId) return cb();
    Vue.prototype.$meta.api
      .post('/a/base/layoutConfig/saveKey', info.data)
      .then(() => {
        // donothing
        cb();
      })
      .catch(err => {
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
      resourcesArray: {},
      categoryTrees: {},
      categories: {},
      tags: {},
      // global
      locales: null,
      modules: null,
      atomClasses: null,
      actions: null,
      detailClasses: null,
      detailActions: null,
      resourceTypes: null,
    },
    getters: {
      userLabels(state) {
        return state.labels;
      },
      demoEnable() {
        return Vue.prototype.$meta.config.modules['a-base'].demo.enable;
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
        state.resourcesArray = {};
        state.categoryTrees = {};
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
      setDetailClasses(state, detailClasses) {
        state.detailClasses = detailClasses;
      },
      setDetailActions(state, actions) {
        state.detailActions = actions;
      },
      setResourceTypes(state, resourceTypes) {
        state.resourceTypes = resourceTypes;
      },
      setResourceTree(state, { resourceType, tree }) {
        state.resourceTrees = {
          ...state.resourceTrees,
          [resourceType]: tree,
        };
      },
      setResources(state, { resourceType, resources, resourcesArray }) {
        state.resources = {
          ...state.resources,
          [resourceType]: resources,
        };
        state.resourcesArray = {
          ...state.resourcesArray,
          [resourceType]: resourcesArray,
        };
      },
      setCategoryTree(state, { atomClass, language, tree }) {
        const key = `${atomClass.module}:${atomClass.atomClassName}:${language || ''}`;
        state.categoryTrees = {
          ...state.categoryTrees,
          [key]: tree,
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
          Vue.prototype.$meta.api
            .post('/a/base/user/getLabels')
            .then(data => {
              data = data || {};
              commit('setLabels', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getModules({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.modules) return resolve(state.modules);
          Vue.prototype.$meta.api
            .post('/a/base/base/modules')
            .then(data => {
              data = data || {};
              commit('setModules', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getResourceTypes({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.resourceTypes) return resolve(state.resourceTypes);
          Vue.prototype.$meta.api
            .post('/a/base/base/resourceTypes')
            .then(data => {
              data = data || {};
              commit('setResourceTypes', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getLocales({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.locales) return resolve(state.locales);
          Vue.prototype.$meta.api
            .post('/a/base/base/locales')
            .then(data => {
              data = data || [];
              commit('setLocales', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getAtomClasses({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.atomClasses) return resolve(state.atomClasses);
          Vue.prototype.$meta.api
            .post('/a/base/base/atomClasses')
            .then(data => {
              data = data || {};
              commit('setAtomClasses', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getActions({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.actions) return resolve(state.actions);
          Vue.prototype.$meta.api
            .post('/a/base/base/actions')
            .then(data => {
              data = data || {};
              commit('setActions', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getDetailClasses({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.detailClasses) return resolve(state.detailClasses);
          Vue.prototype.$meta.api
            .post('/a/detail/base/detailClasses')
            .then(data => {
              data = data || {};
              commit('setDetailClasses', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getDetailActions({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.detailActions) return resolve(state.detailActions);
          Vue.prototype.$meta.api
            .post('/a/detail/base/actions')
            .then(data => {
              data = data || {};
              commit('setDetailActions', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getResourceTree({ state, commit }, { resourceType }) {
        return new Promise((resolve, reject) => {
          if (state.resourceTrees[resourceType]) return resolve(state.resourceTrees[resourceType]);
          Vue.prototype.$meta.api
            .post('/a/base/category/child', {
              atomClass: __atomClassResource,
              categoryId: 0,
              categoryName: resourceType,
            })
            .then(categoryRoot => {
              Vue.prototype.$meta.api
                .post('/a/base/category/tree', {
                  atomClass: __atomClassResource,
                  categoryId: categoryRoot.id,
                  categoryHidden: 0,
                  setLocale: true,
                })
                .then(data => {
                  const tree = data.list;
                  commit('setResourceTree', { resourceType, tree });
                  resolve(tree);
                })
                .catch(err => {
                  reject(err);
                });
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getResources({ state, commit }, { resourceType }) {
        return __getResources({ state, commit }, { resourceType, useArray: false });
      },
      getResourcesArray({ state, commit }, { resourceType }) {
        return __getResources({ state, commit }, { resourceType, useArray: true });
      },
      getCategoryTree({ state, commit }, { atomClass, language }) {
        return new Promise((resolve, reject) => {
          const key = `${atomClass.module}:${atomClass.atomClassName}:${language || ''}`;
          if (state.categoryTrees[key]) return resolve(state.categoryTrees[key]);
          Vue.prototype.$meta.api
            .post('/a/base/category/tree', {
              atomClass,
              language: language || undefined,
            })
            .then(data => {
              const tree = data.list;
              commit('setCategoryTree', { atomClass, language, tree });
              resolve(tree);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getCategories({ state, commit }, { atomClass, language }) {
        return new Promise((resolve, reject) => {
          const key = `${atomClass.module}:${atomClass.atomClassName}:${language || ''}`;
          if (state.categories[key]) return resolve(state.categories[key]);
          Vue.prototype.$meta.api
            .post('/a/base/category/children', {
              atomClass,
              language: language || undefined,
            })
            .then(data => {
              const categories = data.list;
              commit('setCategories', { atomClass, language, categories });
              resolve(categories);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getTags({ state, commit }, { atomClass, language }) {
        return new Promise((resolve, reject) => {
          const key = `${atomClass.module}:${atomClass.atomClassName}:${language || ''}`;
          if (state.tags[key]) return resolve(state.tags[key]);
          const options = {
            where: {},
            orders: [['tagName', 'asc']],
          };
          if (language) {
            options.where.language = language;
          }
          Vue.prototype.$meta.api
            .post('/a/base/tag/list', {
              atomClass,
              options,
            })
            .then(data => {
              const tags = data.list;
              commit('setTags', { atomClass, language, tags });
              resolve(tags);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getLayoutConfig({ state, commit }, module) {
        return new Promise((resolve, reject) => {
          if (state.layoutConfig[module]) return resolve(state.layoutConfig[module]);
          Vue.prototype.$meta.api
            .post('/a/base/layoutConfig/load', { module })
            .then(data => {
              data = data || {};
              commit('setLayoutConfig', { module, data });
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
    },
  };

  function __getResources({ state, commit }, { resourceType, useArray }) {
    return new Promise((resolve, reject) => {
      if (state.resources[resourceType]) {
        return resolve(useArray ? state.resourcesArray[resourceType] : state.resources[resourceType]);
      }
      Vue.prototype.$meta.api
        .post('/a/base/resource/select', {
          options: {
            resourceType,
            orders: [
              ['f.resourceSorting', 'asc'],
              ['f.createdAt', 'asc'],
            ],
          },
        })
        .then(data => {
          const resourcesArray = data.list;
          const resources = {};
          for (const item of resourcesArray) {
            resources[item.atomStaticKey] = item;
          }
          commit('setResources', { resourceType, resources, resourcesArray });
          resolve(useArray ? resourcesArray : resources);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
