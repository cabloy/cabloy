const fs = require('fs');
const path = require('path');
const extend = require('@zhennann/extend');
const localeutil = require('egg-born-localeutil').default;

module.exports = function (loader, modules) {
  // all locales
  const ebLocales = {};

  // load locales
  loadLocales();

  // patch service
  patchCreateContext();

  function patchCreateContext() {
    const createContext = loader.app.createContext;
    loader.app.createContext = (...args) => {
      const context = createContext.call(loader.app, ...args);

      // maybe /favicon.ico
      if (context.module) {
        const defaultLocale = loader.app.config.i18n.defaultLocale;
        context.text = function (...args) {
          return getText(context.locale || defaultLocale, ...args);
        };
        context.text.locale = function (locale, ...args) {
          return getText(locale || defaultLocale, ...args);
        };
      }

      const __getLocale = context.__getLocale;
      context.__getLocale = function () {
        if (context.__locale) {
          return context.__locale;
        }
        let locale = __getLocale.call(context);
        const locale2 = locale.replace(/[\\\.*#%'"`;, ]/g, '');
        if (locale !== locale2) {
          locale = locale2;
          context.__setLocale(locale);
        }
        return locale;
      };

      return context;
    };
  }

  function loadLocales() {
    // module locales
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      const locales = module.main.locales;
      if (locales) {
        Object.keys(locales).forEach(key => {
          let locale = ebLocales[key];
          if (!locale) locale = ebLocales[key] = {};
          extend(false, locale, locales[key]);
        });
      }
    });

    /**
     * based on egg-i18n
     *
     * https://github.com/eggjs/egg-i18n/blob/master/app.js
     *
     */
    // project locales
    const localeDirs = loader.app.config.i18n.dirs;
    for (let i = 0; i < localeDirs.length; i++) {
      const dir = localeDirs[i];

      if (!fs.existsSync(dir)) {
        continue;
      }

      const names = fs.readdirSync(dir);
      for (let j = 0; j < names.length; j++) {
        const name = names[j];
        const filepath = path.join(dir, name);
        // support en_US.js => en-US.js
        const key = formatLocale(name.split('.')[0]);
        const resource = require(filepath);

        let locale = ebLocales[key];
        if (!locale) locale = ebLocales[key] = {};
        extend(false, locale, resource);
      }
    }
  }

  /**
   * based on koa-locales
   *
   * https://github.com/koajs/locales/blob/master/index.js
   *
   */

  function getText(locale, ...args) {
    const key = args[0];
    if (!key) return null;

    // try locale
    let resource = ebLocales[locale] || {};
    let text = resource[key];
    if (text === undefined && locale !== 'en-us') {
      // try en-us
      resource = ebLocales['en-us'] || {};
      text = resource[key];
    }
    // equal key
    if (text === undefined) {
      text = key;
    }
    // format
    args[0] = text;
    return localeutil.getText.apply(localeutil, args);
  }
};

function formatLocale(locale) {
  // support zh_CN, en_US => zh-CN, en-US
  return locale.replace('_', '-').toLowerCase();
}
