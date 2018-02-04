import util from '../base/util.js';

export default function(Vue) {
  return {
    onF7Ready() {
      // load waiting modules
      Vue.prototype.$meta.module.loadWaitings();
      // remove app loading
      util.removeAppLoading();
      // invoke layout.start
      Vue.prototype.$meta.vueLayout.onStart(() => {
        // loginOnStart
        if (Vue.prototype.$meta.module.get().options.meta.loginOnStart === true
          && !Vue.prototype.$meta.store.state.auth.loggedIn) {
          // open login
          this.openView('login');
        }
      });
    },
    openView(viewName, routeTo) {
      const view = this.$f7.views[viewName];
      // navigate
      if (viewName === 'login') {
        const urlLogin = Vue.prototype.$meta.module.get().options.meta.login;
        view.router.navigate(urlLogin);
      }
      // open
      Vue.prototype.$f7.loginScreen.open(this.$$(view.$el).parent('.eb-view-container'));
    },
    closeView(viewName, cancel) {
      const view = this.$f7.views[viewName];
      // close
      Vue.prototype.$f7.loginScreen.close(this.$$(view.$el).parent('.eb-view-container'));
      // adjust history
      if (!cancel) {
        view.router.navigate('/', { reloadAll: true });
      }
    },
  };
}
