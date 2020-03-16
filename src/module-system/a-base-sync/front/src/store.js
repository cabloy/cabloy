// eslint-disable-next-line
export default function(Vue) {

  const queueLayoutConfig = Vue.prototype.$meta.util.queue((info, cb) => {
    const user = Vue.prototype.$meta.store.getState('auth/user');
    if (user.op.id !== info.userId) return cb();
    Vue.prototype.$meta.api.post('/a/base/layoutConfig/saveKey', info.data).then(() => {
      // donothing
      cb();
    }).catch(err => {
      console.log(err);
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
      // global
      modules: null,
      atomClasses: null,
      actions: null,
      flags: null,
      orders: null,
      functionScenes: {},
      functions: null,
      menus: null,
      panels: null,
      widgets: null,
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
      setModules(state, modules) {
        state.modules = modules;
      },
      setAtomClasses(state, atomClasses) {
        state.atomClasses = atomClasses;
      },
      setActions(state, actions) {
        state.actions = actions;
      },
      setFlags(state, flags) {
        state.flags = flags;
      },
      setOrders(state, orders) {
        state.orders = orders;
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
      setFunctions(state, functions) {
        state.functions = functions;
      },
      setFunctionScenes(state, { sceneMenu, scenes }) {
        state.functionScenes = {
          ...state.functionScenes,
          [sceneMenu]: scenes,
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
      getFlags({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.flags) return resolve(state.flags);
          Vue.prototype.$meta.api.post('/a/base/base/flags').then(data => {
            data = data || {};
            commit('setFlags', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getOrders({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.orders) return resolve(state.orders);
          Vue.prototype.$meta.api.post('/a/base/base/orders').then(data => {
            data = data || {};
            commit('setOrders', data);
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
      getFunctionScenes({ state, commit }, { sceneMenu }) {
        return new Promise((resolve, reject) => {
          if (state.functionScenes[sceneMenu]) return resolve(state.functionScenes[sceneMenu]);
          Vue.prototype.$meta.api.post('/a/base/function/scenes', { sceneMenu }).then(data => {
            data = data || [];
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
    },
  };

}
