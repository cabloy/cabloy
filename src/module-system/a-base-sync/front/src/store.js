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
        cb(err);
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
      categoryTreesResource: {},
      categoryTreesResourceMenu: {},
      resources: {},
      resourcesArray: {},
      categoryTrees: {},
      categories: {},
      tags: {},
      atomClassesUser: null,
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
        return !!Vue.prototype.$meta.config.modules['a-base'].demo.enable;
      },
    },
    mutations: {
      authLogin(state) {
        // clear user
        state.labels = null;
        state.layoutConfig = {};
        state.userAtomClassRolesPreferred = {};
        state.categoryTreesResource = {};
        state.categoryTreesResourceMenu = {};
        state.resources = {};
        state.resourcesArray = {};
        state.categoryTrees = {};
        state.categories = {};
        state.tags = {};
        state.atomClassesUser = null;
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
      setLayoutConfigKey(state, { module, key, value, cb }) {
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
          queueLayoutConfig.push({ userId: user.op.id, data }, cb);
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
      setAtomClassesUser(state, atomClassesUser) {
        state.atomClassesUser = atomClassesUser;
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
      setCategoryTreeResource(state, { resourceType, tree }) {
        state.categoryTreesResource = {
          ...state.categoryTreesResource,
          [resourceType]: tree,
        };
      },
      setCategoryTreeResourceMenu(state, { resourceType, appKey, tree }) {
        const key = `${resourceType}_${appKey}`;
        state.categoryTreesResourceMenu = {
          ...state.categoryTreesResourceMenu,
          [key]: tree,
        };
      },
      setResources(state, { resourceType, appKey, resources, resourcesArray }) {
        const key = appKey ? `${resourceType}_${appKey}` : resourceType;
        state.resources = {
          ...state.resources,
          [key]: resources,
        };
        state.resourcesArray = {
          ...state.resourcesArray,
          [key]: resourcesArray,
        };
      },
      setCategoryTree(state, { atomClass, language, categoryHidden, tree }) {
        const key = __getCategoryStoreKey({ atomClass, language, categoryHidden });
        state.categoryTrees = {
          ...state.categoryTrees,
          [key]: tree,
        };
      },
      setCategories(state, { atomClass, language, categoryHidden, categories }) {
        const key = __getCategoryStoreKey({ atomClass, language, categoryHidden });
        state.categories = {
          ...state.categories,
          [key]: categories,
        };
      },
      setTags(state, { atomClass, language, tags }) {
        const key = __getTagStoreKey({ atomClass, language });
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
      getAtomClassesUser({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.atomClassesUser) return resolve(state.atomClassesUser);
          Vue.prototype.$meta.api
            .post('/a/base/atomClass/atomClassesUser')
            .then(data => {
              data = data || {};
              commit('setAtomClassesUser', data);
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
      async getCategoryTreeResourceMenu({ state, commit }, { resourceType, appKey }) {
        const key = `${resourceType}_${appKey}`;
        if (state.categoryTreesResourceMenu[key]) return state.categoryTreesResourceMenu[key];
        const categoryRoot = await Vue.prototype.$meta.api.post('/a/base/category/child', {
          atomClass: __atomClassResource,
          categoryId: 0,
          categoryName: resourceType,
        });
        const categoryRoot2 = await Vue.prototype.$meta.api.post('/a/base/category/child', {
          atomClass: __atomClassResource,
          categoryId: categoryRoot.id,
          categoryName: appKey,
        });
        let tree;
        if (!categoryRoot2) {
          tree = [];
        } else {
          const data = await Vue.prototype.$meta.api.post('/a/base/category/tree', {
            atomClass: __atomClassResource,
            categoryId: categoryRoot2.id,
            categoryHidden: 0,
            setLocale: true,
          });
          tree = data.list;
        }
        commit('setCategoryTreeResourceMenu', { resourceType, appKey, tree });
        return tree;
      },
      async getCategoryTreeResource({ state, commit }, { resourceType }) {
        if (state.categoryTreesResource[resourceType]) return state.categoryTreesResource[resourceType];
        const categoryRoot = await Vue.prototype.$meta.api.post('/a/base/category/child', {
          atomClass: __atomClassResource,
          categoryId: 0,
          categoryName: resourceType,
        });
        const data = await Vue.prototype.$meta.api.post('/a/base/category/tree', {
          atomClass: __atomClassResource,
          categoryId: categoryRoot.id,
          categoryHidden: 0,
          setLocale: true,
        });
        const tree = data.list;
        commit('setCategoryTreeResource', { resourceType, tree });
        return tree;
      },
      getResources({ state, commit }, { resourceType, appKey }) {
        return __getResources({ state, commit }, { resourceType, appKey, useArray: false });
      },
      getResourcesArray({ state, commit }, { resourceType, appKey }) {
        return __getResources({ state, commit }, { resourceType, appKey, useArray: true });
      },
      getCategoryTree({ state, commit }, { atomClass, language, categoryHidden }) {
        return new Promise((resolve, reject) => {
          const key = __getCategoryStoreKey({ atomClass, language, categoryHidden });
          if (state.categoryTrees[key]) return resolve(state.categoryTrees[key]);
          Vue.prototype.$meta.api
            .post('/a/base/category/tree', {
              atomClass,
              language: language || undefined,
              categoryHidden,
            })
            .then(data => {
              const tree = data.list;
              commit('setCategoryTree', { atomClass, language, categoryHidden, tree });
              resolve(tree);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getCategories({ state, commit }, { atomClass, language, categoryHidden }) {
        return new Promise((resolve, reject) => {
          const key = __getCategoryStoreKey({ atomClass, language, categoryHidden });
          if (state.categories[key]) return resolve(state.categories[key]);
          Vue.prototype.$meta.api
            .post('/a/base/category/children', {
              atomClass,
              language: language || undefined,
            })
            .then(data => {
              const categories = data.list;
              commit('setCategories', { atomClass, language, categoryHidden, categories });
              resolve(categories);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getTags({ state, commit }, { atomClass, language }) {
        return new Promise((resolve, reject) => {
          const key = __getTagStoreKey({ atomClass, language });
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
      async setLayoutConfigKey({ state, commit }, { module, key, value }) {
        return new Promise((resolve, reject) => {
          commit('setLayoutConfigKey', {
            module,
            key,
            value,
            cb: err => {
              if (err) return reject(err);
              resolve();
            },
          });
        });
      },
    },
  };

  async function __getResources({ state, commit }, { resourceType, appKey, useArray }) {
    const key = appKey ? `${resourceType}_${appKey}` : resourceType;
    if (state.resources[key]) {
      return useArray ? state.resourcesArray[key] : state.resources[key];
    }
    const data = await Vue.prototype.$meta.api.post('/a/base/resource/select', {
      options: {
        resourceType,
        appKey,
        orders: [
          ['f.resourceSorting', 'asc'],
          ['f.createdAt', 'asc'],
        ],
      },
    });
    const resourcesArray = data.list;
    const resources = {};
    for (const item of resourcesArray) {
      resources[item.atomStaticKey] = item;
    }
    commit('setResources', { resourceType, appKey, resources, resourcesArray });
    return useArray ? resourcesArray : resources;
  }

  function __getCategoryStoreKey({ atomClass, language, categoryHidden }) {
    return `${atomClass.module}:${atomClass.atomClassName}:${language || ''}:${categoryHidden}`;
  }
  function __getTagStoreKey({ atomClass, language }) {
    return `${atomClass.module}:${atomClass.atomClassName}:${language || ''}`;
  }
}
