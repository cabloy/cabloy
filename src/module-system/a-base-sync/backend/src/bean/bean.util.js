const require3 = require('require3');
const moment = require3('moment');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Util {

    page(_page, force = true) {
      const pageSize = ctx.config.module(moduleInfo.relativeName).pageSize;
      if (!_page) {
        _page = force ? { index: 0 } : { index: 0, size: 0 };
      }
      if (_page.size === undefined || (force && (_page.size === 0 || _page.size === -1 || _page.size > pageSize))) _page.size = pageSize;
      return _page;
    }

    user(_user) {
      return _user || ctx.state.user.op;
    }

    now() {
      return moment().format('YYYY-MM-DD HH:mm:ss');
    }

    today() {
      return moment().format('YYYY-MM-DD');
    }

    formatDateTime(date, fmt) {
      date = date || new Date();
      fmt = fmt || 'YYYY-MM-DD HH:mm:ss';
      if (typeof (date) !== 'object') date = new Date(date);
      return moment(date).format(fmt);
    }

    formatDate(date, sep) {
      if (this.isUndefined(sep)) sep = '-';
      const fmt = `YYYY${sep}MM${sep}DD`;
      return this.formatDateTime(date, fmt);
    }

    formatTime(date, sep) {
      if (this.isUndefined(sep)) sep = ':';
      const fmt = `HH${sep}mm${sep}ss`;
      return this.formatDateTime(date, fmt);
    }

    fromNow(date) {
      if (typeof (date) !== 'object') date = new Date(date);
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
          obj = obj[names[i]];
        }
        obj[names[names.length - 1]] = value;
      }
    }

    getProperty(obj, name) {
      if (!obj) return undefined;
      const names = name.split('.');
      if (names.length === 1) return obj[name];
      // loop
      for (const name of names) {
        obj = obj[name];
        if (!obj) break;
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

  }

  return Util;
};
