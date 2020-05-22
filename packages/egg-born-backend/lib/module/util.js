const mparse = require('egg-born-mparse').default;
const fse = require('fs-extra');
const path = require('path');
const URL = require('url').URL;
const isSafeDomainUtil = require('egg-security').utils.isSafeDomain;

const util = {
  lookupPackage(dir) {
    let _dir = dir;
    // eslint-disable-next-line
    while (true) {
      const file = path.join(_dir, 'package.json');
      if (file === '/package.json') return null;
      if (fse.existsSync(file)) return file;
      _dir = path.join(_dir, '../');
    }
  },
  combineFetchPath(moduleName, arg) {
    if (arg.substr(0, 2) === '//') return arg.substr(1);
    if (arg.charAt(0) === '/') return `/api${arg}`;
    const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
    if (!moduleInfo) throw new Error('invalid url');
    return `/api/${moduleInfo.url}/${arg}`;
  },
  combineApiPath(moduleName, arg) {
    if (arg.charAt(0) === '/') return arg;
    const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
    if (!moduleInfo) throw new Error('invalid url');
    return `/${moduleInfo.url}/${arg}`;
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
  createError(data, returnObject) {
    const error = returnObject ? {} : new Error();
    error.code = data.code || 500;
    error.message = data.message;
    if (data.stack) error.stack = data.stack;
    if (data.name) error.name = data.name;
    if (data.errno) error.errno = data.errno;
    if (data.sqlMessage) error.sqlMessage = data.sqlMessage;
    if (data.sqlState) error.sqlState = data.sqlState;
    if (data.index) error.index = data.index;
    if (data.sql) error.sql = data.sql;
    return error;
  },
  monkeyModule(ebModulesMonkey, monkeyName, monkeyData) {
    for (const key in ebModulesMonkey) {
      const moduleMonkey = ebModulesMonkey[key];
      if (moduleMonkey.main.monkey && moduleMonkey.main.monkey[monkeyName]) {
        moduleMonkey.main.monkey[monkeyName](monkeyData);
      }
    }
  },
  getWhiteListCors(ctx) {
    let whiteListCors;
    const _config = ctx.config.module('a-base');
    const _whiteList = (_config && _config.cors && _config.cors.whiteList) || [];
    if (!Array.isArray(_whiteList)) {
      whiteListCors = _whiteList.split(',');
    } else {
      whiteListCors = _whiteList.concat();
    }
    // inherits from jsonp
    let _whiteListJsonp = _config && _config.jsonp && _config.jsonp.whiteList;
    if (_whiteListJsonp) {
      if (!Array.isArray(_whiteListJsonp)) {
        _whiteListJsonp = _whiteListJsonp.split(',');
      }
      whiteListCors = whiteListCors.concat(_whiteListJsonp);
    }
    return whiteListCors;
  },
  isSafeDomain(ctx, origin) {
    // origin is {protocol}{hostname}{port}...
    if (!origin || origin === 'null' || origin === null) return true;

    let parsedUrl;
    try {
      parsedUrl = new URL(origin);
    } catch (err) {
      return false;
    }

    // whiteList
    const whiteListCors = this.getWhiteListCors(ctx);
    if (isSafeDomainUtil(parsedUrl.hostname, whiteListCors) || isSafeDomainUtil(origin, whiteListCors)) {
      return true;
    }
    return false;
  },
};

module.exports = util;
