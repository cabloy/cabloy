export default function(Vue) {
  const login = {
    open(routeTo) {
      // login url
      const urlLogin = Vue.prototype.$meta.module.get('main').options.meta.login;
      // login view
      const view = Vue.prototype.$$('.view-login')[0].__vue__;
      if (!view.f7View) {
        view.f7View = Vue.prototype.$f7.views.create(view.$el, view.$options.propsData);
      }
      view.f7View.router.navigate(urlLogin, { reloadAll: true });
      Vue.prototype.$f7.loginScreen.open(Vue.prototype.$$('.login-screen'));
    },
  };
  return login;
}
