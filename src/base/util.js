import mparse from 'egg-born-mparse';
import cookies from 'js-cookie';

export default function(Vue) {
  const _ids = { };
  return {
    cookies,
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
      let documentUrl = url.substr(location.origin.length);
      if (documentUrl.indexOf('https://') === 0 || documentUrl.indexOf('http://') === 0) return documentUrl;
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
      hash = hash || '';
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
        return scope[key] !== undefined ? scope[key] : '';
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
      let url = this._combineFetchPath(moduleName, arg);
      if (Vue.prototype.$meta.config.api.baseURL) {
        url = `${Vue.prototype.$meta.config.api.baseURL}${url}`;
      }
      return url;
    },
    _combineFetchPath(moduleName, arg) {
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
          if (url) {
            ctx.$view.navigate(url, action.navigateOptions);
          }
          return resolve();
        }
        ctx.$meta.module.use(action.actionModule, module => {
          const component = module.options.components[action.actionComponent];
          const componentInstance = new Vue(component);
          try {
            const res = componentInstance.onAction({ ctx, action, item });
            this.wrapPromise(res)
              .then(res2 => {
                componentInstance.$destroy();
                const url = action.actionPath ? this.combinePagePath(action.actionModule, this.replaceTemplate(action.actionPath, item)) : null;
                if (url) {
                  ctx.$nextTick(() => {
                    ctx.$view.navigate(url, action.navigateOptions);
                  });
                }
                resolve(res2);
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
    combineImageUrl(url, width, height) {
      if (!url) return url;
      if (url.indexOf('data:image/') === 0) return url;
      if (!width && !height) return url;
      const pixelRatio = Vue.prototype.$device.pixelRatio;
      let query = '';
      if (width) query = `width=${parseInt(width) * pixelRatio}`;
      if (height) query = `${query ? query + '&' : ''}height=${parseInt(height) * pixelRatio}`;
      return `${url}${url.charAt(url.length - 1) === '?' ? '' : '?'}${query}`;
    },
    combineQueries(url, queries) {
      //
      if (!queries) return url;
      //
      let str = '';
      for (const key of Object.keys(queries)) {
        str += `${key}=${encodeURIComponent(queries[key])}&`;
      }
      if (str) {
        str = str.substr(0, str.length - 1);
      }
      if (!str) return url;
      //
      if (!url) return str;
      //
      const pos = url.indexOf('?');
      if (pos === -1) return `${url}?${str}`;
      if (pos === url.length - 1) return `${url}${str}`;
      return `${url}&${str}`;
    },
    loadScript(src, callback) {
      if (!(typeof callback === 'function')) {
        callback = function() {};
      }
      const check = document.querySelectorAll("script[src='" + src + "']");
      if (check.length > 0) {
        check[0].addEventListener('load', function() {
          callback();
        });
        callback();
        return;
      }
      const script = document.createElement('script');
      const head = document.getElementsByTagName('head')[0];
      script.type = 'text/javascript';
      script.charset = 'UTF-8';
      script.async = true;
      script.src = src;
      if (script.addEventListener) {
        script.addEventListener('load', function() {
          callback();
        }, false);
      } else if (script.attachEvent) {
        script.attachEvent('onreadystatechange', function() {
          const target = window.event.srcElement;
          if (target.readyState === 'loaded') {
            callback();
          }
        });
      }
      head.appendChild(script);
    },
    loadLink(src, callback) {
      if (!(typeof callback === 'function')) {
        callback = function() {};
      }
      const check = document.querySelectorAll("link[href='" + src + "']");
      if (check.length > 0) {
        callback();
        return;
      }
      const link = document.createElement('link');
      const head = document.getElementsByTagName('head')[0];
      link.rel = 'stylesheet';
      link.href = src;
      if (link.addEventListener) {
        link.addEventListener('load', function() {
          callback();
        }, false);
      } else if (link.attachEvent) {
        link.attachEvent('onreadystatechange', function() {
          const target = window.event.srcElement;
          if (target.readyState === 'loaded') {
            callback();
          }
        });
      }
      head.appendChild(link);
    },
    removeClassLike($el, className) {
      const classes = className.split(' ');
      for (let i = 0; i < classes.length; i += 1) {
        for (let j = 0; j < $el.length; j += 1) {
          if (typeof $el[j] !== 'undefined' && typeof $el[j].classList !== 'undefined') {
            __removeClassLike($el[j].classList, classes[i]);
          }
        }
      }
    },
  };
}

function __removeClassLike(classList, classNameLike) {
  for (let i = classList.length - 1; i >= 0; i--) {
    const item = classList.item(i);
    if (item.indexOf(classNameLike) > -1) classList.remove(item);
  }
}
