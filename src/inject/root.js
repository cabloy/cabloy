import util from '../base/util.js';

export default function(Vue) {
  let _routeTo;
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
        } else {
          // invoke layout.onLayout
          Vue.prototype.$meta.vueLayout.onLayout();
        }
      });
    },
    openView(viewName, routeTo) {
      const view = this.$f7.views[viewName];
      // navigate
      if (viewName === 'login') {
        _routeTo = routeTo;
        const urlLogin = Vue.prototype.$meta.module.get().options.meta.login;
        view.router.navigate(urlLogin);
      } else {
        view.router.navigate(routeTo);
      }
      // open
      Vue.prototype.$f7.loginScreen.open(this.$$(view.$el).parent('.eb-view-container'));
    },
    closeView(viewName, cancel) {
      const view = this.$f7.views[viewName];
      // close
      Vue.prototype.$f7.loginScreen.close(this.$$(view.$el).parent('.eb-view-container'));
      // close directly
      if (!cancel) {
        // adjust history
        view.router.navigate('/', { reloadAll: true });
        // check if loggedIn
        if (Vue.prototype.$meta.store.state.auth.loggedIn) {
          // invoke layout.onLayout
          Vue.prototype.$meta.vueLayout.onLayout();
          // show _routeTo
          if (_routeTo) {
            this.openView('main', _routeTo);
          }
        }
      }
      // clear _routeTo
      _routeTo = null;
    },
  };
}
