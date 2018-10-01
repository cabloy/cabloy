export default function(Vue) {
  return {
    state: {
      loggedIn: false,
      user: null,
      instance: null,
      hashInit: null,
    },
    getters: {
      title(state) {
        const _title = state.instance ? state.instance.title : null;
        return _title || Vue.prototype.$f7.params.name;
      },
    },
    mutations: {
      login(state, { loggedIn, user }) {
        state.loggedIn = loggedIn;
        state.user = user;
        if (user && user.op && user.op.locale) {
          Vue.prototype.$meta.util.cookies.set('locale', user.op.locale);
        }
      },
      logout(state) {
        state.loggedIn = false;
        state.user = null;
      },
      setInstance(state, instance) {
        state.instance = instance;
      },
      setHashInit(state, hashInit) {
        state.hashInit = hashInit;
      },
    },
  };
}
