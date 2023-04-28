const require3 = require('require3');
const uuid = require3('uuid');
const extend = require3('@zhennann/extend');
const currency = require3('@zhennann/currency').default;
const moment = require3('moment');
const mparse = require3('egg-born-mparse').default;
const eggBornUtils = require3('egg-born-utils');
const utils = require('../common/utils.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Util extends app.meta.BeanBase {
    get localConfig() {
      return this.ctx.config.module(moduleInfo.relativeName);
    }

    get uuid() {
      return uuid;
    }

    uuidv4() {
      return uuid.v4().replace(/-/g, '');
    }

    page(_page, force = true) {
      const pageSize = this.localConfig.pageSize;
      if (!_page) {
        _page = force ? { index: 0 } : { index: 0, size: 0 };
      }
      if (_page.size === undefined || (force && (_page.size === 0 || _page.size === -1 || _page.size > pageSize))) {
        _page.size = pageSize;
      }
      return _page;
    }

    user(_user) {
      return _user || this.ctx.state.user.op;
    }

    extend(...args) {
      return extend(true, ...args);
    }

    currency(options) {
      return currency(options);
    }

    moment(date) {
      return moment(date);
    }

    now(fmt, locale) {
      return this.formatDateTime(null, fmt, locale);
    }

    today(fmt, locale) {
      return this.formatDate(null, fmt, locale);
    }

    formatDateTime(date, fmt, locale) {
      locale = locale || this.ctx.locale;
      let timezone = this.localConfig.timezones[locale];
      if (timezone === undefined) {
        timezone = this.localConfig.timezones[app.config.i18n.defaultLocale];
      }
      date = date || new Date();
      fmt = fmt || 'YYYY-MM-DD HH:mm:ss';
      if (typeof date !== 'object') date = new Date(date);
      return moment(date).utcOffset(timezone).format(fmt);
    }

    formatDate(date, sep, locale) {
      if (sep === undefined) sep = '-';
      const fmt = `YYYY${sep}MM${sep}DD`;
      return this.formatDateTime(date, fmt, locale);
    }

    formatTime(date, sep, locale) {
      if (sep === undefined) sep = ':';
      const fmt = `HH${sep}mm${sep}ss`;
      return this.formatDateTime(date, fmt, locale);
    }

    // todo: load locales resources and then format
    fromNow(date /* , locale*/) {
      if (typeof date !== 'object') date = new Date(date);
      return moment(date).fromNow();
    }

    replaceTemplate(content, scope) {
      if (!content) return null;
      return content.toString().replace(/(\\)?{{ *([\w\.]+) *}}/g, (block, skip, key) => {
        if (skip) {
          return block.substring(skip.length);
        }
        const value = this.getProperty(scope, key);
        return value !== undefined ? value : '';
      });
    }

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
    }

    getProperty(obj, name, sep) {
      return this._getProperty(obj, name, sep, false);
    }

    getPropertyObject(obj, name, sep) {
      return this._getProperty(obj, name, sep, true);
    }

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
    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    combinePagePath(moduleName, arg) {
      if (!arg || typeof arg !== 'string') return arg;
      const first = arg.charAt(0);
      if (first === '/' || first === '#') return arg;
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      return `/${moduleInfo.url}/${arg}`;
    }

    checkDemo(throwError = true) {
      const demo = this.ctx.config.module(moduleInfo.relativeName).configFront.demo;
      if (!demo.enable) return true;
      const user = this.ctx.state.user;
      // !user means system operation
      if (!user || user.op.userName === 'root') return true;
      if (throwError) {
        this.ctx.throw.module(moduleInfo.relativeName, 1014);
      }
      return false;
    }

    checkDemoForAtomCreate(throwError = true) {
      const ctxCaller = this.ctx.ctxCaller;
      if (!ctxCaller) return true;
      if (ctxCaller.path === '/api/a/base/atom/create') {
        return this.checkDemo(throwError);
      }
      return true;
    }

    checkDemoForAtomRead(throwError = true) {
      const ctxCaller = this.ctx.ctxCaller;
      if (!ctxCaller) return true;
      if (ctxCaller.path === '/api/a/base/atom/read') {
        return this.checkDemo(throwError);
      }
      return true;
    }

    checkDemoForAtomSelect(throwError = true) {
      const ctxCaller = this.ctx.ctxCaller;
      if (!ctxCaller) return true;
      if (ctxCaller.path === '/api/a/base/atom/select') {
        return this.checkDemo(throwError);
      }
      return true;
    }

    checkDemoForAtomWrite(throwError = true) {
      const ctxCaller = this.ctx.ctxCaller;
      if (!ctxCaller) return true;
      if (ctxCaller.path === '/api/a/base/atom/write' || ctxCaller.path === '/api/a/base/atom/writeSubmit') {
        return this.checkDemo(throwError);
      }
      return true;
    }

    escapeHtml(str) {
      return utils.escapeHtml(str);
    }

    escapeURL(str) {
      return utils.escapeURL(str);
    }

    getTitleLocale({ locales, title, locale }) {
      locale = locale || this.ctx.locale;
      let titleLocale = this.getProperty(locales, `${locale}.${title}`);
      if (!titleLocale && locale !== 'en-us') {
        titleLocale = this.getProperty(locales, `en-us.${title}`);
      }
      // not use system locale
      // if (!titleLocale) {
      //   titleLocale = this.ctx.text(title);
      // }
      return titleLocale || title;
    }

    getFrontScene() {
      return (
        (this.ctx.request.query && this.ctx.request.query['x-scene']) ||
        (this.ctx.headers && this.ctx.headers['x-scene']) ||
        (this.ctx.session && this.ctx.session['x-scene'])
      );
    }

    getFrontClientId() {
      return (
        (this.ctx.request.query && this.ctx.request.query['x-clientid']) ||
        (this.ctx.headers && this.ctx.headers['x-clientid']) ||
        (this.ctx.session && this.ctx.session['x-clientid']) ||
        ''
      );
    }

    evaluateExpression({ expression, globals, wrapper }) {
      return eggBornUtils.tools.evaluateExpression({ expression, scope: globals, wrapper });
      // return vm.runInContext(expression, vm.createContext(globals || {}));
    }

    normalizeResourceKey(key, module, sep = ':') {
      if (!key) return key;
      let _sep, _parts;
      for (_sep of sep) {
        _parts = key.split(_sep);
        if (_parts.length > 1) break;
      }
      if (_parts.length === 1 && module) {
        _parts.unshift(module);
      }
      return _parts.join(_sep);
    }

    hostUtil(options) {
      const self = this;
      return {
        text(...args) {
          const locale = options && options.locale;
          return self.ctx.text.locale(locale || self.ctx.app.config.i18n.defaultLocale, ...args);
        },
        url(str) {
          if (str && (str.indexOf('http://') === 0 || str.indexOf('https://') === 0)) return this.escapeURL(str);
          if (str[0] !== '/') str = '/' + str;
          return self.ctx.bean.base.getAbsoluteUrl(this.escapeURL(str));
        },
        urlFront(str) {
          return this.url(str);
        },
        escapeHtml(str) {
          return self.escapeHtml(str);
        },
        escapeURL(str) {
          return self.escapeURL(str);
        },
        performAction({ method, url, body }) {
          return self.ctx.meta.util.performAction({ method, url, body });
        },
      };
    }

    // check draft/formal
    async checkAtomIdExists({ atomId, items }) {
      if (items.length === 0) return false;
      const _atomOld = await this.ctx.bean.atom.modelAtom.get({ id: atomId });
      const atomIds = new Set([atomId]);
      if (_atomOld.atomIdDraft) {
        atomIds.add(_atomOld.atomIdDraft);
      }
      if (_atomOld.atomIdFormal) {
        atomIds.add(_atomOld.atomIdFormal);
      }
      return items.some(item => {
        return !atomIds.has(item.id);
      });
    }
  }

  return Util;
};
