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
      userPanels: null,
      userWidgets: null,
      userSections: null,
      userButtons: null,
      userAtomClassRolesPreferred: {},
      // global
      locales: null,
      modules: null,
      atomClasses: null,
      actions: null,
      resourceTypes: null,
      resourceTrees: {},
      categories: {},
      tags: {},
      functionScenes: {},
      functions: null,
      menus: null,
      panels: null,
      widgets: null,
      sections: null,
      buttons: null,
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
        state.userPanels = null;
        state.userWidgets = null;
        state.userSections = null;
        state.userButtons = null;
        state.userAtomClassRolesPreferred = {};
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
      setUserPanels(state, panels) {
        state.userPanels = panels;
      },
      setUserWidgets(state, widgets) {
        state.userWidgets = widgets;
      },
      setUserSections(state, sections) {
        state.userSections = sections;
      },
      setUserButtons(state, buttons) {
        state.userButtons = buttons;
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
      setMenus(state, menus) {
        state.menus = menus;
      },
      setPanels(state, panels) {
        state.panels = panels;
      },
      setWidgets(state, widgets) {
        state.widgets = widgets;
      },
      setSections(state, sections) {
        state.sections = sections;
      },
      setButtons(state, buttons) {
        state.buttons = buttons;
      },
      setFunctions(state, functions) {
        state.functions = functions;
      },
      setFunctionScenes(state, { sceneMenu, scenes }) {
        state.functionScenes = {
          ...state.functionScenes,
          [sceneMenu]: scenes,
        };
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
      getMenus({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.menus) return resolve(state.menus);
          Vue.prototype.$meta.api.post('/a/base/base/menus').then(data => {
            data = data || {};
            commit('setMenus', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getPanels({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.panels) return resolve(state.panels);
          Vue.prototype.$meta.api.post('/a/base/base/panels').then(data => {
            data = data || {};
            commit('setPanels', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getWidgets({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.widgets) return resolve(state.widgets);
          Vue.prototype.$meta.api.post('/a/base/base/widgets').then(data => {
            data = data || {};
            commit('setWidgets', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getSections({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.sections) return resolve(state.sections);
          Vue.prototype.$meta.api.post('/a/base/base/sections').then(data => {
            data = data || {};
            commit('setSections', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getButtons({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.buttons) return resolve(state.buttons);
          Vue.prototype.$meta.api.post('/a/base/base/buttons').then(data => {
            data = data || {};
            commit('setButtons', data);
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
      getFunctionScenes({ state, commit }, { sceneMenu }) {
        return new Promise((resolve, reject) => {
          if (state.functionScenes[sceneMenu]) return resolve(state.functionScenes[sceneMenu]);
          Vue.prototype.$meta.api.post('/a/base/function/scenes', { sceneMenu }).then(data => {
            data = data || {};
            commit('setFunctionScenes', { sceneMenu, scenes: data });
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getFunctions({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.functions) return resolve(state.functions);
          Vue.prototype.$meta.api.post('/a/base/base/functions').then(data => {
            data = data || {};
            commit('setFunctions', data);
            resolve(data);
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
      getUserPanels({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.userPanels) return resolve(state.userPanels);
          const options = {
            where: { menu: 2 },
            orders: [
              [ 'titleLocale', 'asc' ],
            ],
            page: { size: 0 },
          };
          Vue.prototype.$meta.api.post('/a/base/function/list', { options }).then(data => {
            commit('setUserPanels', data.list);
            resolve(data.list);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getUserWidgets({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.userWidgets) return resolve(state.userWidgets);
          const options = {
            where: { menu: 3 },
            orders: [
              [ 'titleLocale', 'asc' ],
            ],
            page: { size: 0 },
          };
          Vue.prototype.$meta.api.post('/a/base/function/list', { options }).then(data => {
            commit('setUserWidgets', data.list);
            resolve(data.list);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getUserSections({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.userSections) return resolve(state.userSections);
          const options = {
            where: { menu: 4 },
            orders: [
              [ 'titleLocale', 'asc' ],
            ],
            page: { size: 0 },
          };
          Vue.prototype.$meta.api.post('/a/base/function/list', { options }).then(data => {
            commit('setUserSections', data.list);
            resolve(data.list);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getUserButtons({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.userButtons) return resolve(state.userButtons);
          const options = {
            where: { menu: 5 },
            orders: [
              [ 'titleLocale', 'asc' ],
            ],
            page: { size: 0 },
          };
          Vue.prototype.$meta.api.post('/a/base/function/list', { options }).then(data => {
            commit('setUserButtons', data.list);
            resolve(data.list);
          }).catch(err => {
            reject(err);
          });
        });
      },
    },
  };

}
