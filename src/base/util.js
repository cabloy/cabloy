export default function(Vue) {
  return {
    overrideProperty({ obj, key, objBase, vueComponent, combilePath }) {
      Object.defineProperty(obj, key, {
        get() {
          return function() {
            const moduleInfo = vueComponent.$module.info;
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
    setComponentModule(component, module) {
      component.__ebModuleRelativeName = module.info.relativeName;
    },
    parseHash(url) {
      if (!url || url === '/') return '/';
      let documentUrl = url.split(location.origin)[1];
      const router = Vue.prototype.$f7.router;
      if (router.params.pushStateRoot && documentUrl.indexOf(router.params.pushStateRoot) >= 0) {
        documentUrl = documentUrl.split(router.params.pushStateRoot)[1] || '/';
      }
      if (router.params.pushStateSeparator && documentUrl.indexOf(router.params.pushStateSeparator) >= 0) {
        documentUrl = documentUrl.split(router.params.pushStateSeparator)[1] || '/';
      }
      return documentUrl || '/';
    },
    isPromise(value) {
      return value && typeof value === 'object' && typeof value.then === 'function';
    },
  };
}
