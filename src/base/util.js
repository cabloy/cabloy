export default function(Vue) {
  const _ids = { };
  return {
    overrideProperty({ obj, key, objBase, vueComponent, combilePath }) {
      Object.defineProperty(obj, key, {
        get() {
          return function() {
            const moduleInfo = vueComponent && vueComponent.$module && vueComponent.$module.info;
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
      Vue.prototype.$Framework7.history.state = null;
      history.replaceState(null, '', location.href.split('#')[0]);
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
    combineHash(hash) {
      let url = location.origin + '/';
      const router = Vue.prototype.$f7.router;
      if (router.params.pushStateRoot) url += router.params.pushStateRoot;
      if (router.params.pushStateSeparator) url += router.params.pushStateSeparator;
      url += hash;
      return url;
    },
    historyUrlEmpty(historyUrl) {
      if (!historyUrl || historyUrl === '/') return true;
      const router = Vue.prototype.$f7.router;
      if (!router.params.pushStateSeparator || historyUrl.indexOf(router.params.pushStateSeparator) < 0) return false;
      historyUrl = historyUrl.split(router.params.pushStateSeparator)[1];
      return (!historyUrl || historyUrl === '/');
    },
    isPromise(value) {
      return value && typeof value === 'object' && typeof value.then === 'function';
    },
    sleep(ms) {
      return new Promise(reslove => {
        window.setTimeout(() => { reslove(); }, ms);
      });
    },
    debounce(func, wait) {
      let i = 0;
      return function(...args) {
        const ctx = this;
        if (i !== 0) window.clearTimeout(i);
        i = window.setTimeout(() => {
          func.apply(ctx, args);
        }, wait);
      };
    },
    nextId(scene) {
      scene = scene || 'default';
      if (!_ids.scene) _ids.scene = 1; else _ids.scene++;
      return `${scene}_${_ids.scene}`;
    },
    fromNow(date) {
      if (typeof (date) !== 'object') date = new Date(date);
      return Vue.prototype.$meta.moment(date).fromNow();
    },
    formatDateTime(date, fmt) {
      fmt = fmt || 'YYYY-MM-DD HH:mm:ss';
      date = date || new Date();
      if (typeof (date) !== 'object') date = new Date(date);
      return Vue.prototype.$meta.moment(date).format(fmt);
    },
    formatDate(date, sep) {
      if (sep === undefined) sep = '-';
      const fmt = `YYYY${sep}MM${sep}DD`;
      return this.formatDateTime(date, fmt);
    },
    formatTime(date, sep) {
      if (sep === undefined) sep = ':';
      const fmt = `HH${sep}mm${sep}ss`;
      return this.formatDateTime(date, fmt);
    },
    formatDateTimeRelative(date, fmt) {
      date = date || new Date();
      if (typeof (date) !== 'object') date = new Date(date);
      if (Vue.prototype.$meta.moment().diff(date, 'days') == 0) return this.formatTime(date);
      return this.formatDateTime(date, fmt);
    },
    swipeoutClose(target) {
      Vue.prototype.$f7.swipeout.close(Vue.prototype.$$(target).closest('.swipeout'));
    },
    swipeoutDelete(target) {
      Vue.prototype.$f7.swipeout.delete(Vue.prototype.$$(target).closest('.swipeout'));
    },
  };
}
