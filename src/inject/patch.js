import mparse from 'egg-born-mparse';

export default function(Vue) {
  // router
  function patchRouter(router) {
    // routes
    Object.defineProperty(router, 'routes', {
      get() {
        return Vue.prototype.$f7.routes;
      },
    });
    // navigate
    const navigate = router.navigate;
    router.navigate = (navigateParams, navigateOptions) => {
      // url
      let url;
      if (typeof navigateParams === 'string') {
        url = navigateParams;
      } else {
        url = navigateParams.url;
      }
      // match
      const route = router.findMatchingRoute(url);
      if (route) return navigate.call(router, navigateParams, navigateOptions);
      // info
      const moduleInfo = mparse.parseInfo(url);
      if (!moduleInfo) return router; // throw new Error('invalid url');
      // use module
      Vue.prototype.$meta.module.use(moduleInfo, () => {
        return navigate.call(router, navigateParams, navigateOptions);
      });
      return router;
    };
    // back
    const back = router.back;
    router.back = (...args) => {
      const view = router.view;
      if (view && view.$el.hasClass('eb-view')) {
        if (router.history.length <= 2) {
          Vue.prototype.$meta.vueRoot.closeView(view.name, true);
        }
      }
      return back.call(router, ...args);
    };
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
  Object.defineProperty(Vue.prototype.$meta, 'vueRoot', {
    get() {
      return Vue.prototype.$f7.root[0].__vue__;
    },
  });
  Object.defineProperty(Vue.prototype.$meta, 'vueApp', {
    get() {
      return Vue.prototype.$meta.vueRoot.$refs.app;
    },
  });
  Object.defineProperty(Vue.prototype.$meta, 'vueLayout', {
    get() {
      return Vue.prototype.$meta.vueApp.$refs.layout;
    },
  });
  Object.defineProperty(Vue.prototype.$meta, 'vueLogin', {
    get() {
      return Vue.prototype.$meta.vueApp.$refs.login;
    },
  });
}
