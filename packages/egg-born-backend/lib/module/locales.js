/*
* @Author: zhennann
* @Date:   2017-09-21 14:47:36
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-25 16:48:21
*/

const util = require('util');
const extend = require('extend2');
const util2 = require('./util.js');
const assetLocales = require('./asset/locales.js');

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

    // asset locales
    Object.keys(assetLocales).forEach(key => {
      let locale = ebLocales[key];
      if (!locale) locale = ebLocales[key] = {};
      extend(false, locale, assetLocales[key]);
    });

  }

  /**
 * based on koa-locales
 * 
 * https://github.com/koajs/locales/blob/master/index.js
 * 
 */

  function getText(key, value) {

    if (arguments.length === 0) return '';

    const locale = this.locale;
    const resource = ebLocales[locale] || {};

    let text = resource[key];
    if (text === undefined) {
      text = key;
    }

    if (!text) return '';

    if (arguments.length === 1) {
      return text;
    }
    if (arguments.length === 2) {
      if (isObject(value)) {
        return formatWithObject(text, value);
      }

      if (Array.isArray(value)) {
        return formatWithArray(text, value);
      }

      return util.format(text, value);
    }

    const args = new Array(arguments.length);
    args[0] = text;
    for (let i = 1; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return util.format.apply(util, args);
  }

};

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

const ARRAY_INDEX_RE = /\{(\d+)\}/g;
function formatWithArray(text, values) {
  return text.replace(ARRAY_INDEX_RE, function(orignal, matched) {
    const index = parseInt(matched);
    if (index < values.length) {
      return values[index];
    }
    // not match index, return orignal text
    return orignal;
  });
}

const Object_INDEX_RE = /\{(.+?)\}/g;
function formatWithObject(text, values) {
  return text.replace(Object_INDEX_RE, function(orignal, matched) {
    const value = values[matched];
    if (value) {
      return value;
    }
    // not match index, return orignal text
    return orignal;
  });
}
