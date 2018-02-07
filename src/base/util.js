export default {
  overrideProperty({ obj, key, objBase, vueComponent, combilePath }) {
    Object.defineProperty(obj, key, {
      get() {
        return function() {
          const moduleInfo = vueComponent.moduleInfo;
          const args = new Array(arguments.length);
          args[0] = combilePath(moduleInfo, arguments[0]);
          for (let i = 1; i < args.length; i++) {
            args[i] = arguments[i];
          }
          return objBase[key].apply(objBase, args);
        };
      },
    });
  },
  removeAppLoading() {
    // eslint-disable-next-line
    const loading = window.document.getElementById('app-loading');
    loading && loading.parentNode.removeChild(loading);
  },
  clearRouterHistory() {
    Object.keys(window.localStorage).forEach(key => {
      if (key.indexOf('f7router-') === 0) window.localStorage.removeItem(key);
    });
  },
};
