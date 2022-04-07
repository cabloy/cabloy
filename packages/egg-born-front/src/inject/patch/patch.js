import mparse from 'egg-born-mparse';

export default function (ctx, router) {
  // load route
  function loadRoute(url, cb) {
    // match
    let route = router.findMatchingRoute(url);
    if (route) return cb(route);
    // info
    const moduleInfo = mparse.parseInfo(url);
    if (!moduleInfo) {
      // should not throw error
      console.log('invalid page path: ', url);
      return cb(null);
    }
    // use module
    ctx.$meta.module.use(moduleInfo, () => {
      route = router.findMatchingRoute(url);
      if (!route) {
        // should not throw error
        console.log('page path not found: ', url);
      }
      return cb(route);
    });
  }
  // load route component
  function loadRouteComponent(url, cb) {
    loadRoute(url, route => {
      if (!route) throw new Error(`not found route: ${url}`);
      if (!route.route.async) return cb(route.route.component);
      route.route.async(
        url,
        null,
        data => {
          return cb(data.component);
        },
        () => {
          // do nothing
          //   maybe need login
        }
      );
    });
  }
  function _checkIfDirtyOfPage(pageEl) {
    if (!pageEl) return false;
    const pageVue = pageEl.__vue__;
    return pageVue && pageVue.getPageDirty && pageVue.getPageDirty();
  }
  function _checkIfDirtyOfView(viewEl) {
    if (!viewEl) return false;
    const viewVue = viewEl.__vue__;
    return viewVue && viewVue.getViewDirty && viewVue.getViewDirty();
  }
  function _pageDirtyConfirm(viewEl, cbOk, cbCancel) {
    const viewVue = viewEl.__vue__;
    viewVue.viewDirtyConfirm(cbOk, cbCancel);
  }
  // navigate
  const navigate = router.navigate;
  const _navigateReal = function (navigateParams, navigateOptions, cb) {
    ctx.$nextTick(() => {
      // url
      let url;
      if (typeof navigateParams === 'string') {
        url = navigateParams;
      } else {
        url = navigateParams.url;
      }
      // check if page content
      if (navigateParams && navigateParams.route && navigateParams.route.content) {
        // navigate
        navigate.call(router, navigateParams, navigateOptions);
        return cb && cb();
      }
      // load route
      loadRoute(url, route => {
        if (!route) return cb && cb();
        // check if loggedIn
        //   just the placeholder for logical thinking
        if (route.route.meta && route.route.meta.auth && !ctx.$meta.store.state.auth.loggedIn) {
          navigate.call(router, navigateParams, navigateOptions);
          return cb && cb();
        }
        // navigate
        navigate.call(router, navigateParams, navigateOptions);
        return cb && cb();
      });
    });
    return router;
  };
  router.navigate = (navigateParams, navigateOptions, cb) => {
    if (navigateOptions && navigateOptions.initial) {
      navigate.call(router, navigateParams, navigateOptions);
      cb && cb();
      return router;
    }
    const viewEl = router.view.$el[0];
    // check reloadCurrent
    let pageDirty = navigateOptions && navigateOptions.reloadCurrent && _checkIfDirtyOfPage(router.currentPageEl);
    if (!pageDirty) {
      // check reloadAll
      pageDirty = navigateOptions && navigateOptions.reloadAll && _checkIfDirtyOfView(viewEl);
    }
    if (!pageDirty) return _navigateReal(navigateParams, navigateOptions, cb);
    _pageDirtyConfirm(
      viewEl,
      () => {
        _navigateReal(navigateParams, navigateOptions, cb);
      },
      () => {
        cb && cb();
      }
    );
    return router;
  };
  // close
  const _closeReal = function () {
    const view = router.view;
    if (view && view.$el.hasClass('eb-layout-view')) {
      // clear hash
      if (view.params.pushState && history.state) {
        const keys = Object.keys(history.state);
        if (keys.length > 0) {
          const url = history.state[keys[keys.length - 1]].url;
          if (url === router.url) {
            window.history.go(-(view.router.history.length - 1));
            router.url = view.router.history[0];
          }
        }
      }
      // close view
      ctx.$meta.vueLayout.closeView(view, { disableCheckDirty: true });
    }
    return router;
  };
  router.close = () => {
    // check if current view is dirty
    const viewEl = router.view.$el[0];
    if (!_checkIfDirtyOfView(viewEl)) {
      return _closeReal.call(router);
    }
    _pageDirtyConfirm(viewEl, () => {
      _closeReal.call(router);
    });
    return router;
  };
  // back
  const back = router.back;
  const _backReal = function (...args) {
    // view
    const view = router.view;
    if (view && view.$el.hasClass('eb-layout-view')) {
      if (ctx.$meta.util.historyUrlEmpty(router.history[router.history.length - 2])) {
        return _closeReal.call(router);
      }
    }
    return back.call(router, ...args);
  };
  router.back = (...args) => {
    // check if current page is dirty
    if (!_checkIfDirtyOfPage(router.currentPageEl)) {
      return _backReal.call(router, ...args);
    }
    _pageDirtyConfirm(router.view.$el[0], () => {
      _backReal.call(router, ...args);
    });
    return router;
  };

  return {
    loadRoute,
    loadRouteComponent,
  };
}
