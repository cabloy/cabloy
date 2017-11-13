export default function(Vue) {

  return {
    state: {
      loggedIn: false,
      user: null,
    },
    mutations: {
      login(state, { user }) {
        state.loggedIn = true;
        state.user = user;
      },
      logout(state) {
        state.loggedIn = false;
      },
    },
  };

}

