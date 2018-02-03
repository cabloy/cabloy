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
      // info
      const moduleInfo = mparse.parseInfo(url);
      if (!moduleInfo) return router; // throw new Error('invalid url');
      // use module
      Vue.prototype.$meta.module.use(moduleInfo, () => {
        return navigate.call(router, navigateParams, navigateOptions);
      });
      return router;
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
}
