export default function(Vue) {
  // router
  function patchRouter(router) {
    // routes
    Object.defineProperty(router, 'routes', {
      get() {
        return Vue.prototype.$f7.routes;
      },
    });
  }
  Vue.prototype.$Framework7.use({
    create() {
      patchRouter(this.router);
    },
  });
  Vue.prototype.$Framework7.View.use({
    create() {
      patchRouter(this.router);
    },
  });

  // vue components
  Object.defineProperty(Vue.prototype.$meta, 'vueApp', {
    get() {
      return Vue.prototype.$f7.root[0].__vue__;
    },
  });
  Object.defineProperty(Vue.prototype.$meta, 'vueLayout', {
    get() {
      return Vue.prototype.$meta.vueApp.getLayout();
    },
  });
}
