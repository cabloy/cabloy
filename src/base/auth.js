// eslint-disable-next-line
export default function(Vue) {
  // hash init
  const hashInit = location.href;
  history.replaceState(null, '', location.href.split('#')[0]);

  return {
    state: {
      loggedIn: false,
      user: null,
      hashInit,
    },
    mutations: {
      login(state, { loggedIn, user }) {
        state.loggedIn = loggedIn;
        state.user = user;
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

