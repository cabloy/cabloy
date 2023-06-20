import mparse from 'egg-born-mparse';
import moment from 'moment';
import * as uuid from 'uuid';
import cookies from 'js-cookie';
import queue from 'async/queue';
import debounce from '@zhennann/debounce';
import currency from '@zhennann/currency';
import extend from '@zhennann/extend';
import requirejsFn from './requirejs.js';
// eslint-disable-next-line
import localeZhcn from 'moment/locale/zh-cn.js';
import _escape from './escape.js';
import hostUtil from './hostUtil.js';

const __ViewSizes = ['small', 'medium', 'large'];

export default function (Vue) {
  const _ids = {};

  const util = {
    overrideProperty({ obj, key, objBase, vueComponent, combinePath }) {
      Object.defineProperty(obj, key, {
        get() {
          return function () {
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
    async createComponentOptionsUses(component) {
      return await this.useModules(component.meta && component.meta.uses);
    },
    async preloadModules(modules, options) {
      options = options || {};
      const delay = options.delay || Vue.prototype.$meta.config.preload.delay;
      window.setTimeout(() => {
        this.useModules(modules);
      }, delay);
    },
    async useModules(modules) {
      if (!modules) return;
      if (!Array.isArray(modules)) modules = modules.split(',');
      modules = modules.filter(module => !Vue.prototype.$meta.module.get(module));
      if (modules.length === 0) return;
      const promises = modules.map(module => Vue.prototype.$meta.module.use(module));
      await Promise.all(promises);
    },
    createComponentOptions(component) {
      // installFactory
      if (component.installFactory) {
        component = Vue.util.mergeOptions(component, component.installFactory(Vue));
        component._Ctor = {};
        delete component.installFactory;
        Vue.extend(component);
        this._setComponentGlobal(component);
      }
      return component;
    },
    _setComponentGlobal(component) {
      // register
      if (component.meta && component.meta.global === true) {
        if (!Vue.options.components[component.name]) {
          Vue.component(component.name, component);
        }
      }
      return component;
    },
    _setComponentModule(component, module) {
      if (component) {
        component.__ebModuleRelativeName = module.info.relativeName;
      }
    },
    _locationFullPathName() {
      return location.origin + location.pathname;
    },
    parseHash(url) {
      if (!url || url === '/') return '/';
      // support external url
      if (
        (url.indexOf('https://') === 0 || url.indexOf('http://') === 0) &&
        url.indexOf(this._locationFullPathName()) === -1
      ) {
        return url;
      }
      return url.split(Vue.prototype.$f7.router.params.pushStateSeparator)[1] || '/';
    },
    combineHash(hash) {
      hash = hash || '';
      return `${location.origin}${location.pathname}${location.search}${Vue.prototype.$f7.router.params.pushStateSeparator}${hash}`;
    },
    historyUrlEmpty(historyUrl) {
      if (!historyUrl || historyUrl === '/') return true;
      const router = Vue.prototype.$f7.router;
      if (!router.params.pushStateSeparator || historyUrl.indexOf(router.params.pushStateSeparator) < 0) return false;
      historyUrl = historyUrl.split(router.params.pushStateSeparator)[1];
      return !historyUrl || historyUrl === '/';
    },
    isPromise(value) {
      return value && typeof value === 'object' && typeof value.then === 'function';
    },
    wrapPromise(promise) {
      if (!this.isPromise(promise)) {
        return Promise.resolve(promise);
      }
      return promise;
    },
    sleep(ms) {
      return new Promise(reslove => {
        window.setTimeout(() => {
          reslove();
        }, ms);
      });
    },
    nextId(scene) {
      scene = scene || 'default';
      if (!_ids.scene) _ids.scene = 1;
      else _ids.scene++;
      return `${scene}_${_ids.scene}`;
    },
    uuidv4() {
      return uuid.v4().replace(/-/g, '');
    },
    fromNow(date) {
      if (typeof date !== 'object') date = new Date(date);
      return moment(date).fromNow();
    },
    formatDateTime(date, fmt) {
      if (!fmt || fmt === true) {
        fmt = 'YYYY-MM-DD HH:mm:ss';
      } else if (fmt === 'date') {
        fmt = 'YYYY-MM-DD';
      } else if (fmt === 'time') {
        fmt = 'HH:mm:ss';
      }
      date = date || new Date();
      if (typeof date !== 'object') date = new Date(date);
      return moment(date).format(fmt);
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
      if (this.formatDate() === this.formatDate(date)) return this.formatTime(date);
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
      return content.toString().replace(/(\\)?{{ *([\w\.]+) *}}/g, (block, skip, key) => {
        if (skip) {
          return block.substring(skip.length);
        }
        const value = this.getProperty(scope, key);
        return value !== undefined ? value : '';
      });
    },
    parseModuleInfo(moduleName) {
      return mparse.parseInfo(moduleName);
    },
    getBaseURL() {
      return Vue.prototype.$meta.config.api.baseURL || window.location.origin;
    },
    combineApiPath(moduleName, arg) {
      if (arg.charAt(0) === '/') return arg;
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      return `/${moduleInfo.url}/${arg}`;
    },
    combineFetchStaticPath(arg) {
      return this.combineFetchPath(null, '/' + arg);
    },
    combineFetchPath(moduleName, arg) {
      let url = this._combineFetchPath(moduleName, arg);
      url = `${this.getBaseURL()}${url}`;
      return url;
    },
    _combineFetchPath(moduleName, arg) {
      if (arg.substr(0, 2) === '//') return arg.substr(1);
      if (arg.charAt(0) === '/') return `/api${arg}`;
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      return `/api/${moduleInfo.url}/${arg}`;
    },
    combineStaticPath(moduleName, arg) {
      let url = this._combineStaticPath(moduleName, arg);
      url = `${this.getBaseURL()}${url}`;
      return url;
    },
    _combineStaticPath(moduleName, arg) {
      if (arg.substr(0, 2) === '//') return arg.substr(1);
      if (arg.charAt(0) === '/') return `/api/static${arg}`;
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      return `/api/static/${moduleInfo.url}/${arg}`;
    },
    combineStaticPathFront(arg) {
      return `${location.origin}${location.pathname}static/${arg}`;
    },
    combineStorePath(moduleName, arg) {
      if (arg.substr(0) === '/') return arg.substr(1);
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      return `${moduleInfo.url}/${arg}`;
    },
    combinePagePath(moduleName, arg) {
      if (!arg || typeof arg !== 'string') return arg;
      if (arg.indexOf('https://') === 0 || arg.indexOf('http://') === 0) return arg;
      const first = arg.charAt(0);
      if (first === '/' || first === '#') return arg;
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      return `/${moduleInfo.url}/${arg}`;
    },
    createComponentInstance(component, options) {
      if (!component) throw new Error('component should not be null');
      // const _component = Object.assign({}, component, options);
      let _component = this.extend({}, component);
      _component = Object.assign(_component, options);
      const instance = new Vue(_component);
      instance.$store = Vue.prototype.$meta.store;
      instance.$pinia = Vue.prototype.$meta.pinia;
      return instance;
    },
    _combineComponentsProps(parent, component) {
      if (component.mixins) {
        for (const mixin of component.mixins) {
          this._combineComponentsProps(parent, mixin);
        }
      }
      Object.assign(parent, component.props);
    },
    async performAction(args) {
      const { ctx, action, item } = args;
      let actionModule = action.actionModule;
      const actionComponent = action.actionComponent;
      const actionPath = action.actionPath;
      // patch
      if (actionModule === 'a-base' && (actionComponent === 'action' || actionComponent === 'actionBulk')) {
        actionModule = 'a-baseaction';
      }
      // actionPath
      if (!actionComponent) {
        const url = actionPath ? this.combinePagePath(actionModule, this.replaceTemplate(actionPath, item)) : null;
        const options = Object.assign({}, action.navigateOptions, {
          context: {
            params: {
              item,
            },
          },
        });
        this.navigate({ ctx, url, options });
        return;
      }
      // actionComponent
      const module = await Vue.prototype.$meta.module.use(actionModule);
      const component = module.options.components[actionComponent];
      if (!component) throw new Error(`actionComponent not found: ${actionModule}:${actionComponent}`);
      // componentProps
      const componentProps = {};
      this._combineComponentsProps(componentProps, component);
      // options
      const options = {};
      if (componentProps) {
        options.propsData = {};
        for (const key in componentProps) {
          options.propsData[key] = args[key];
        }
      }
      // create instance
      const componentInstance = this.createComponentInstance(component, options);
      try {
        if (window.__debugger) {
          debugger;
        }
        const res = await componentInstance.onAction(args);
        componentInstance.$destroy();
        return res;
      } catch (err) {
        componentInstance.$destroy();
        throw err;
      }
    },
    performActionSync(args) {
      const { action } = args;
      const actionModule = action.actionModule;
      const actionComponent = action.actionComponent;
      // actionComponent
      //  should load module before the call
      const module = Vue.prototype.$meta.module.get(actionModule);
      if (!module) throw new Error(`actionModule not found: ${actionModule}`);
      const component = module.options.components[actionComponent];
      if (!component) throw new Error(`actionComponent not found: ${actionModule}:${actionComponent}`);
      // componentProps
      const componentProps = {};
      this._combineComponentsProps(componentProps, component);
      // options
      const options = {};
      if (componentProps) {
        options.propsData = {};
        for (const key in componentProps) {
          options.propsData[key] = args[key];
        }
      }
      // create instance
      const componentInstance = this.createComponentInstance(component, options);
      try {
        if (window.__debugger) {
          debugger;
        }
        const res = componentInstance.onAction(args);
        componentInstance.$destroy();
        return res;
      } catch (err) {
        componentInstance.$destroy();
        throw err;
      }
    },
    navigate({ ctx, url, options }) {
      const view = ctx.$view;
      if (view) {
        view.navigate(url, options);
      } else {
        ctx.$meta.vueLayout.navigate(url, options);
      }
    },
    setProperty(obj, name, value) {
      const names = name.split('.');
      if (names.length === 1) {
        obj[name] = value;
      } else {
        for (let i = 0; i < names.length - 1; i++) {
          const _obj = obj[names[i]];
          if (_obj) {
            obj = _obj;
          } else {
            obj = obj[names[i]] = {};
          }
        }
        obj[names[names.length - 1]] = value;
      }
    },
    getPropertyDeprecate(obj, name, nameDeprecate, sep) {
      let value = this.getProperty(obj, name, sep);
      if (value !== undefined) return value;
      value = this.getProperty(obj, nameDeprecate, sep);
      if (value !== undefined) {
        console.warn(`DeprecationWarning: \`${nameDeprecate}\` is deprecated. Use \`${name}\` instead.`);
        return value;
      }
      return undefined;
    },
    getProperty(obj, name, sep) {
      return this._getProperty(obj, name, sep, false);
    },
    getPropertyObject(obj, name, sep) {
      return this._getProperty(obj, name, sep, true);
    },
    _getProperty(obj, name, sep, forceObject) {
      if (!obj) return undefined;
      const names = name.split(sep || '.');
      // loop
      for (const name of names) {
        if (obj[name] === undefined || obj[name] === null) {
          if (forceObject) {
            obj[name] = {};
          } else {
            obj = obj[name];
            break;
          }
        }
        obj = obj[name];
      }
      return obj;
    },
    combineStoreUrl(entityName) {
      const locale = this.getLocale();
      return `https://store.cabloy.com/${locale === 'zh-cn' ? 'zh-cn/' : ''}articles/${entityName}.html`;
    },
    combineAvatarUrl(url, width, height) {
      const media = url || Vue.prototype.$meta.config.modules['a-base'].user.avatar.default;
      return this.combineImageUrl(media, width, height);
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
        const value = queries[key];
        if (value !== null && value !== undefined) {
          str += `${key}=${encodeURIComponent(value)}&`;
        }
      }
      if (str) {
        str = str.substr(0, str.length - 1);
      }
      if (!str) return url;
      //
      if (!url) return '?' + str;
      //
      const pos = url.indexOf('?');
      if (pos === -1) return `${url}?${str}`;
      if (pos === url.length - 1) return `${url}${str}`;
      return `${url}&${str}`;
    },
    loadScript(src, callback) {
      if (callback) {
        const check = document.querySelectorAll("script[src='" + src + "']");
        if (check.length > 0) {
          check[0].addEventListener('load', function () {
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
          script.addEventListener(
            'load',
            function () {
              callback();
            },
            false
          );
        } else if (script.attachEvent) {
          script.attachEvent('onreadystatechange', function () {
            const target = window.event.srcElement;
            if (target.readyState === 'loaded') {
              callback();
            }
          });
        }
        head.appendChild(script);
      } else {
        return new Promise(resolve => {
          this.loadScript(src, () => {
            resolve();
          });
        });
      }
    },
    loadLink(src, callback) {
      if (callback) {
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
          link.addEventListener(
            'load',
            function () {
              callback();
            },
            false
          );
        } else if (link.attachEvent) {
          link.attachEvent('onreadystatechange', function () {
            const target = window.event.srcElement;
            if (target.readyState === 'loaded') {
              callback();
            }
          });
        }
        head.appendChild(link);
      } else {
        return new Promise(resolve => {
          this.loadLink(src, () => {
            resolve();
          });
        });
      }
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
    setLocale(locale) {
      if (Vue.prototype.$meta.config.base.jwt) {
        window.localStorage['eb-locale'] = locale;
      } else {
        this.cookies.set('locale', locale);
      }
    },
    getLocale() {
      let locale;
      // localStorage / cookies
      if (Vue.prototype.$meta.config.base.jwt) {
        locale = window.localStorage['eb-locale'];
      } else {
        locale = this.cookies.get('locale');
      }
      if (locale) return locale;
      // navigator.language
      locale = this.preferredLocale(window.navigator.language);
      if (locale) return locale;
      // config
      locale = Vue.prototype.$meta.config.base.locale;
      if (locale) return locale;
      // default
      return 'en-us';
    },
    getLocales() {
      // _locales
      const loginInfo = Vue.prototype.$meta.store.getState('auth/loginInfo');
      const _locales = loginInfo && loginInfo.locales;
      // locales
      let locales;
      if (_locales) {
        locales = {};
        for (const item of _locales) {
          locales[item.value] = item.title;
        }
      } else {
        locales = Vue.prototype.$meta.config.locales;
      }
      return locales;
    },
    preferredLocale(locale) {
      locale = locale.toLowerCase().replace(/_/g, '-');
      const locales = this.getLocales();
      // match exactly
      if (locales[locale]) return locale;
      // match fuzzy
      const localeShort = locale.split('-')[0];
      return Object.keys(locales).find(item => item.indexOf(localeShort) === 0);
    },
    viewRouterDid(view) {
      const f7 = Vue.prototype.$vuef7;
      let viewRouter;
      f7.routers.views.forEach(data => {
        if (data.el && data.el === view.$el) {
          viewRouter = data;
        }
      });
      const urlNew = viewRouter.component.$f7route.url;
      const urlCurrent = view.f7View.router.currentRoute.url;
      return urlNew === urlCurrent;
    },
    fn2workerURL(fn) {
      const blob = new Blob(['(' + fn + ')()'], { type: 'text/javascript' });
      return URL.createObjectURL(blob);
    },
    async combineSearchClauseLoadModules({ schema }) {
      if (!schema) return;
      const properties = schema.schema.properties;
      for (const key in properties) {
        const property = properties[key];
        const ebSearch = property.ebSearch;
        if (ebSearch === false) continue;
        if (ebSearch && ebSearch.combine) {
          const actionModule = ebSearch.combine.actionModule;
          const actionComponent = ebSearch.combine.actionComponent;
          if (!actionModule || !actionComponent) {
            throw new Error(`ebSearch.combine not set properly for property: ${key}`);
          }
          await Vue.prototype.$meta.module.use(actionModule);
        }
      }
    },
    combineSearchClause({ ctx, schema, data, searchStates }) {
      if (!schema || !data) return null;
      const clause = {};
      const properties = schema.schema.properties;
      for (const key in properties) {
        const property = properties[key];
        const ebSearch = property.ebSearch;
        if (ebSearch === false) continue;
        // dataPath
        const dataPath = key;
        // value
        const value = data[key];
        // operator
        const operator = this._combineSearchParseOperator({
          property,
          operator: searchStates && searchStates[dataPath],
        });
        // combine
        let res;
        if (ebSearch && ebSearch.combine) {
          res = this.performActionSync({
            ctx,
            action: ebSearch.combine,
            item: { key, property, dataPath, value, operator, schema, data, searchStates },
          });
        } else {
          res = this._combineSearchClause({ key, property, value, operator });
        }
        if (res) {
          Object.assign(clause, res);
        }
      }
      return clause;
    },
    _combineSearchParseOperator({ property, operator }) {
      if (operator) return operator;
      const ebSearch = property.ebSearch;
      let operators = ebSearch && ebSearch.operators;
      let op;
      if (!operators) {
        op = property.type === 'string' ? 'like' : '=';
      } else {
        if (!Array.isArray(operators)) operators = operators.split(',');
        op = operators[0];
      }
      return { op };
    },
    _combineSearchClause({ key, property, value, operator }) {
      const ebSearch = property.ebSearch;
      if (!property.type) return null;
      if (this.checkIfEmptyForSelect(value)) return null;
      if (ebSearch && ebSearch.ignoreValue === value) return null;
      let tableAlias = ebSearch && ebSearch.tableAlias;
      tableAlias = tableAlias === null ? null : tableAlias || 'f';
      const fieldName = (ebSearch && ebSearch.fieldName) || key;
      const clauseName = tableAlias === null ? fieldName : `${tableAlias}.${fieldName}`;
      const clauseValue = {
        op: operator.op,
        val: value,
      };
      return { [clauseName]: clauseValue };
    },
    checkIfEmptyForSelect(value) {
      return value === '' || value === undefined || value === null;
    },
    _checkIfIconF7Default(iconF7) {
      if (!iconF7) return true;
      return iconF7.indexOf('/api/static/') === -1 && iconF7.split(':').length < 3;
    },
    async combineIcon({ material, f7, color, size }) {
      return await Vue.prototype.$meta.store.dispatch('a/icon/combineIcon', { material, icon: f7, color, size });
    },
    getJwtAuthorization() {
      let oauth = window.localStorage['eb-jwt-oauth'];
      if (!oauth) return '';
      oauth = JSON.parse(oauth);
      return oauth.expireTime - Date.now() > 120 * 1000 ? oauth.accessToken : oauth.refreshToken;
    },
    combineLoginUrl({ providerModule, providerName, providerScene }) {
      const urlParamScene = providerScene ? `/${providerScene}` : '';
      return `/api/a/auth/passport/${providerModule}/${providerName}${urlParamScene}`;
    },
    normalizeResourceKey(key, module, sep = ':') {
      if (!key) return key;
      let _sep, _parts;
      for (let index = 0; index < sep.length; index++) {
        _sep = sep[index];
        _parts = key.split(_sep);
        if (_parts.length > 1) break;
      }
      if (_parts.length === 1 && module) {
        _parts.unshift(module);
      }
      return _parts.join(_sep);
    },
    compareViewSize(sizeA, sizeB) {
      return __ViewSizes.indexOf(sizeA) - __ViewSizes.indexOf(sizeB);
    },
    get emptyIcon() {
      return '<i class="icon"></i>';
    },
    replaceItem(itemDest, itemSrc) {
      if (!itemDest) return itemSrc;
      const keys = Object.keys(itemDest);
      Object.assign(itemDest, itemSrc);
      for (const key of keys) {
        if (itemSrc[key] === undefined) {
          itemDest[key] = undefined;
        }
      }
      return itemDest;
    },
  };

  // moment
  window.moment = moment;

  // requirejs
  let requirejs;
  Object.defineProperty(util, 'requirejs', {
    get() {
      if (!requirejs) {
        requirejs = requirejsFn(Vue);
      }
      return requirejs;
    },
  });

  // mixin
  Object.assign(util, {
    moment,
    uuid,
    queue,
    cookies,
    debounce,
    currency,
    extend(...args) {
      return extend(true, ...args);
    },
    escapeHtml: _escape.escapeHtml,
    escapeURL: _escape.escapeURL,
    hostUtil: hostUtil(Vue, util),
  });

  // // test:
  // window.setTimeout(() => {
  //   util.requirejs.require(['api/static/a/markdownblock/blocks/audio/audio'], function () {
  //     console.log('audio.js loaded');
  //   });
  // }, 0);

  // ok
  return util;
}

function __removeClassLike(classList, classNameLike) {
  for (let i = classList.length - 1; i >= 0; i--) {
    const item = classList.item(i);
    if (item.indexOf(classNameLike) > -1) classList.remove(item);
  }
}
