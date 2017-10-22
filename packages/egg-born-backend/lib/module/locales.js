/*
* @Author: zhennann
* @Date:   2017-09-21 14:47:36
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-20 00:40:50
*/

const fs = require('fs');
const path = require('path');
const extend = require('extend2');
const localeutil = require('egg-born-localeutil').default;
const util2 = require('./util.js');

module.exports = function(loader, modules) {

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
      const info = util2.getModuleInfo(context);
      if (info) {
        context.text = getText;
      }

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

  function getText(key) {

    if (arguments.length === 0) return '';

    const locale = this.locale;
    const resource = ebLocales[locale] || {};

    let text = resource[key];
    if (text === undefined) {
      text = key;
    }

    const args = new Array(arguments.length);
    args[0] = text;
    for (let i = 1; i < args.length; i++) {
      args[i] = arguments[i];
    }

    return localeutil.getText.apply(localeutil, args);

  }

};

function formatLocale(locale) {
  // support zh_CN, en_US => zh-CN, en-US
  return locale.replace('_', '-').toLowerCase();
}
