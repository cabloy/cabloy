// eslint-disable-next-line
export default function (Vue) {
  Vue.prototype.$meta.eventHub.$on('auth:login', data => {
    Vue.prototype.$meta.store.commit('a/dashboard/authLogin', data);
  });
  return {
    state: {
      dashboardUsers: {},
    },
    getters: {},
    mutations: {
      authLogin(state) {
        // clear user
        state.dashboardUsers = null;
      },
      setDashboardUsers(state, { dashboardAtomId, dashboardUsers }) {
        state.dashboardUsers = {
          ...state.dashboardUsers,
          [dashboardAtomId]: dashboardUsers,
        };
      },
    },
    actions: {
      getDashboardUsers({ state, commit }, { dashboardAtomId }) {
        return new Promise((resolve, reject) => {
          const key = dashboardAtomId;
          if (state.dashboardUsers[key]) return resolve(state.dashboardUsers[key]);
          Vue.prototype.$meta.api
            .post('/a/dashboard/dashboard/itemUsers', {
              key: { atomId: key },
            })
            .then(data => {
              const dashboardUsers = data;
              commit('setDashboardUsers', { dashboardAtomId, dashboardUsers });
              resolve(dashboardUsers);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
    },
  };
}
