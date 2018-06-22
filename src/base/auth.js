export default function(Vue) {
  return {
    state: {
      loggedIn: false,
      user: null,
      hashInit: null,
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
      setHashInit(state, hashInit) {
        state.hashInit = hashInit;
      },
    },
  };
}
