export default function(Vue) {

  function _setUser(state, user) {
    state.user = Object.assign({}, state.user, user);
    // agent rather then op
    if (user && user.agent && user.agent.locale) {
      Vue.prototype.$meta.util.cookies.set('locale', user.agent.locale);
    }
  }

  return {
    state: {
      loggedIn: false,
      user: null,
      instance: null,
      loginInfo: null,
      hashInit: null,
      reload: false,
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
        _setUser(state, user);
      },
      setUser(state, user) {
        _setUser(state, user);
      },
      logout(state) {
        state.loggedIn = false;
        state.user = null;
        state.loginInfo = null;
      },
      setInstance(state, instance) {
        state.instance = instance;
      },
      setLoginInfo(state, info) {
        state.loginInfo = info;
        // config
        if (info.config) {
          Vue.prototype.$utils.extend(Vue.prototype.$meta.config, info.config);
        }
      },
      setHashInit(state, hashInit) {
        state.hashInit = hashInit;
      },
      setReload(state, reload) {
        state.reload = reload;
      },
    },
  };
}
