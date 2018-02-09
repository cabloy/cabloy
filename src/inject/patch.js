export default function(Vue) {
  // router
  function patchRouter(router, root) {
    // routes
    Object.defineProperty(router, 'routes', {
      get() {
        return Vue.prototype.$f7.routes;
      },
      set() {
        // donothing, just for writable
      },
    });
    // layout patch
    if (!root) {
      const layout = Vue.prototype.$meta.vueLayout;
      if (layout) layout.patchRouter(router);
    }
  }
  Vue.prototype.$Framework7.use({
    create() {
      patchRouter(this.router, true);
    },
  });
  Vue.prototype.$Framework7.View.use({
    create() {
      patchRouter(this.router, false);
    },
  });

  // vue components
  Object.defineProperty(Vue.prototype.$meta, 'vueApp', {
    get() {
      return Vue.prototype.$f7 ? Vue.prototype.$f7.root[0].__vue__ : null;
    },
  });
  Object.defineProperty(Vue.prototype.$meta, 'vueLayout', {
    get() {
      const app = Vue.prototype.$meta.vueApp;
      return app ? Vue.prototype.$meta.vueApp.getLayout() : null;
    },
  });
}
