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
      async getLabels({ commit, getters }) {
        const userLabels = getters.userLabels;
        if (userLabels) return userLabels;
        let data = await Vue.prototype.$meta.api.post('/a/base/user/getLabels');
        data = data || {};
        commit('setLabels', data);
        return data;
      },
      async getModules({ state, commit }) {
        if (state.modules) return state.modules;
        let data = await Vue.prototype.$meta.api.post('/a/base/base/modules');
        data = data || {};
        commit('setModules', data);
        return data;
      },
      async getResourceTypes({ state, commit }) {
        if (state.resourceTypes) return state.resourceTypes;
        let data = await Vue.prototype.$meta.api.post('/a/base/base/resourceTypes');
        data = data || {};
        commit('setResourceTypes', data);
        return data;
      },
      async getLocales({ state, commit }) {
        if (state.locales) return state.locales;
        let data = await Vue.prototype.$meta.api.post('/a/base/base/locales');
        data = data || [];
        commit('setLocales', data);
        return data;
      },
      async getAtomClasses({ state, commit }) {
        if (state.atomClasses) return state.atomClasses;
        let data = await Vue.prototype.$meta.api.post('/a/base/base/atomClasses');
        data = data || {};
        commit('setAtomClasses', data);
        return data;
      },
      async getAtomClassesUser({ state, commit }) {
        if (state.atomClassesUser) return state.atomClassesUser;
        let data = await Vue.prototype.$meta.api.post('/a/base/atomClass/atomClassesUser');
        data = data || {};
        commit('setAtomClassesUser', data);
        return data;
      },
      async getActions({ state, commit }) {
        if (state.actions) return state.actions;
        let data = await Vue.prototype.$meta.api.post('/a/base/base/actions');
        data = data || {};
        commit('setActions', data);
        return data;
      },
      async getDetailClasses({ state, commit }) {
        if (state.detailClasses) return state.detailClasses;
        let data = await Vue.prototype.$meta.api.post('/a/detail/base/detailClasses');
        data = data || {};
        commit('setDetailClasses', data);
        return data;
      },
      async getDetailActions({ state, commit }) {
        if (state.detailActions) return state.detailActions;
        let data = await Vue.prototype.$meta.api.post('/a/detail/base/actions');
        data = data || {};
        commit('setDetailActions', data);
        return data;
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
      async getResources({ state, commit }, { resourceType, appKey }) {
        return await __getResources({ state, commit }, { resourceType, appKey, useArray: false });
      },
      async getResourcesArray({ state, commit }, { resourceType, appKey }) {
        return await __getResources({ state, commit }, { resourceType, appKey, useArray: true });
      },
      async getCategoryTree({ state, commit }, { atomClass, language, categoryHidden }) {
        const key = __getCategoryStoreKey({ atomClass, language, categoryHidden });
        if (state.categoryTrees[key]) return state.categoryTrees[key];
        const data = await Vue.prototype.$meta.api.post('/a/base/category/tree', {
          atomClass,
          language: language || undefined,
          categoryHidden,
        });
        const tree = data.list;
        commit('setCategoryTree', { atomClass, language, categoryHidden, tree });
        return tree;
      },
      async getCategories({ state, commit }, { atomClass, language, categoryHidden }) {
        const key = __getCategoryStoreKey({ atomClass, language, categoryHidden });
        if (state.categories[key]) return state.categories[key];
        const data = await Vue.prototype.$meta.api.post('/a/base/category/children', {
          atomClass,
          language: language || undefined,
        });
        const categories = data.list;
        commit('setCategories', { atomClass, language, categoryHidden, categories });
        return categories;
      },
      async getTags({ state, commit }, { atomClass, language }) {
        const key = __getTagStoreKey({ atomClass, language });
        if (state.tags[key]) return state.tags[key];
        const options = {
          where: {},
          orders: [['tagName', 'asc']],
        };
        if (language) {
          options.where.language = language;
        }
        const data = await Vue.prototype.$meta.api.post('/a/base/tag/list', {
          atomClass,
          options,
        });
        const tags = data.list;
        commit('setTags', { atomClass, language, tags });
        return tags;
      },
      async getLayoutConfig({ state, commit }, module) {
        if (state.layoutConfig[module]) return state.layoutConfig[module];
        let data = await Vue.prototype.$meta.api.post('/a/base/layoutConfig/load', { module });
        data = data || {};
        commit('setLayoutConfig', { module, data });
        return data;
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
