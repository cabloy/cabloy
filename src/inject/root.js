import util from '../base/util.js';

export default function(Vue) {
  return {
    onF7Ready() {
      // load waiting modules
      Vue.prototype.$meta.module.loadWaitings();
      // remove app loading
      util.removeAppLoading();
    },
    openView(view, routeTo) {
      view = typeof view === 'string' ? Vue.prototype.$$(`.eb-view-${view}`)[0].__vue__ : view;
      // create view
      if (!view.f7View) {
        view.f7View = this.$f7.views.create(view.$el, view.$options.propsData);
      }
      // navigate
      const urlLogin = Vue.prototype.$meta.module.get('main').options.meta.login;
      view.f7View.router.navigate(urlLogin, { history: true, pushState: true });
      // open
      Vue.prototype.$f7.loginScreen.open(this.$$(view.$el).parent('.eb-view-container'));
    },
    closeView(view, cancel) {
      view = typeof view === 'string' ? Vue.prototype.$$(`.eb-view-${view}`)[0].__vue__ : view;
      // close
      Vue.prototype.$f7.loginScreen.close(this.$$(view.$el).parent('.eb-view-container'));
    },
  };
}
