// eslint-disable-next-line
export default function(Vue) {

  return {
    state: {
      labels: null,
      modules: null,
      atomClasses: null,
      actions: null,
      flags: null,
      orders: null,
      menus: null,
      functions: null,
      panels: null,
      widgets: null,
    },
    getters: {
      userLabels(state) {
        if (!state.labels) return null;
        const user = Vue.prototype.$meta.store.getState('auth/user');
        return state.labels[user.op.id];
      },
    },
    mutations: {
      setLabels(state, labels) {
        const user = Vue.prototype.$meta.store.getState('auth/user');
        state.labels = {
          [user.op.id]: labels,
        };
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
    },
  };

}
