import mparse from 'egg-born-mparse';
export default function(Vue) {
  const _ids = { };
  return {
    overrideProperty({ obj, key, objBase, vueComponent, combinePath }) {
      Object.defineProperty(obj, key, {
        get() {
          return function() {
            const moduleInfo = vueComponent && vueComponent.$module && vueComponent.$module.info;
            const args = new Array(arguments.length);
            args[0] = combinePath(moduleInfo, arguments[0]);
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
    wrapPromise(promise) {
      if (!this.isPromise(promise)) {
        return new Promise(resovle => resovle(promise));
      }
      return promise;
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
    replaceTemplate(content, scope) {
      if (!content) return null;
      return content.toString().replace(/(\\)?{{ *(\w+) *}}/g, (block, skip, key) => {
        if (skip) {
          return block.substring(skip.length);
        }
        return scope[key];
      });
    },
    parseModuleInfo(moduleName) {
      return mparse.parseInfo(moduleName);
    },
    combineApiPath(moduleName, arg) {
      if (arg.charAt(0) === '/') return arg;
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      return `/${moduleInfo.url}/${arg}`;
    },
    combineFetchPath(moduleName, arg) {
      if (arg.substr(0, 2) === '//') return arg.substr(1);
      if (arg.charAt(0) === '/') return `/api${arg}`;
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      return `/api/${moduleInfo.url}/${arg}`;
    },
    combineStorePath(moduleName, arg) {
      if (arg.substr(0) === '/') return arg.substr(1);
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      return `${moduleInfo.url}/${arg}`;
    },
    combinePagePath(moduleName, arg) {
      if (!arg || typeof arg !== 'string') return arg;
      const first = arg.charAt(0);
      if (first === '/' || first === '#') return arg;
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      return `/${moduleInfo.url}/${arg}`;
    },
    performAction({ ctx, action, item }) {
      return new Promise((resolve, reject) => {
        if (!action.actionComponent) {
          const url = action.actionPath ? this.combinePagePath(action.actionModule, this.replaceTemplate(action.actionPath, item)) : null;
          if (url) ctx.$meta.vueLayout.navigate(url);
          return resolve();
        }
        ctx.$meta.module.use(action.actionModule, module => {
          const component = module.options.components[action.actionComponent];
          const componentInstance = new Vue(component);
          try {
            const res = componentInstance.onAction({ ctx, action, item });
            this.wrapPromise(res)
              .then(() => {
                componentInstance.$destroy();
                const url = action.actionPath ? this.combinePagePath(action.actionModule, this.replaceTemplate(action.actionPath, item)) : null;
                if (url) ctx.$meta.vueLayout.navigate(url);
                resolve();
              })
              .catch(err => {
                componentInstance.$destroy();
                reject(err);
              });
          } catch (err) {
            componentInstance.$destroy();
            reject(err);
          }
        });
      });
    },
    setProperty(obj, name, value) {
      const names = name.split('.');
      if (names.length === 1) {
        obj[name] = value;
      } else {
        for (let i = 0; i < names.length - 1; i++) {
          obj = obj[names[i]];
        }
        obj[names[names.length - 1]] = value;
      }
    },
  };
}
