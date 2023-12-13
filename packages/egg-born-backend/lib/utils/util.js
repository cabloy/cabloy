const mparse = require('egg-born-mparse').default;
const fse = require('fs-extra');
const path = require('path');
const URL = require('url').URL;
const is = require('is-type-of');
const isSafeDomainUtil = require('egg-security').utils.isSafeDomain;

module.exports = app => {
  return {
    instanceStarted(subdomain) {
      return app.meta.appReadyInstances && app.meta.appReadyInstances[subdomain];
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
      if (!url) return '?' + str;
      //
      const pos = url.indexOf('?');
      if (pos === -1) return `${url}?${str}`;
      if (pos === url.length - 1) return `${url}${str}`;
      return `${url}&${str}`;
    },
    createError(data, returnObject) {
      const error = returnObject ? {} : new Error();
      error.code = data.code !== undefined ? data.code : 500;
      if (data.message && typeof data.message === 'object') {
        error.message = JSON.stringify(data.message, null, 2);
      } else {
        error.message = data.message;
      }
      if (data.stack) error.stack = data.stack;
      if (data.name) error.name = data.name;
      if (data.errno) error.errno = data.errno;
      if (data.sqlMessage) error.sqlMessage = data.sqlMessage;
      if (data.sqlState) error.sqlState = data.sqlState;
      if (data.index) error.index = data.index;
      if (data.sql) error.sql = data.sql;
      return error;
    },
    monkeyModule(ebAppMonkey, ebModulesMonkey, monkeyName, monkeyData) {
      const module = monkeyData && monkeyData.module;
      if (module) {
        if (module.main.hook && module.main.hook[monkeyName]) {
          module.main.hook[monkeyName](monkeyData);
        }
      }
      for (const key in ebModulesMonkey) {
        const moduleMonkey = ebModulesMonkey[key];
        if (moduleMonkey.main.monkey && moduleMonkey.main.monkey[monkeyName]) {
          const monkeyData2 = Object.assign({ moduleSelf: moduleMonkey }, monkeyData);
          moduleMonkey.main.monkey[monkeyName](monkeyData2);
        }
      }
      if (ebAppMonkey && ebAppMonkey[monkeyName]) {
        ebAppMonkey[monkeyName](monkeyData);
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
      // hostSelf
      const hostSelf = ctx.bean.base.getAbsoluteUrl();
      if (hostSelf) {
        whiteListCors.push(hostSelf);
      }
      // ok
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
    compose(chains, adapter) {
      if (!chains) chains = [];
      return function (context, next) {
        // last called middleware #
        let index = -1;
        return dispatch(0);
        function dispatch(i) {
          if (i <= index) return new Error('next() called multiple times');
          index = i;
          let receiver;
          let fn;
          const chain = chains[i];
          if (chain) {
            const obj = adapter(context, chain);
            if (!obj) return dispatch(i + 1);
            receiver = obj.receiver;
            fn = obj.fn;
            if (!fn) return new Error('fn is not defined');
          }
          if (i === chains.length) fn = next;
          if (!fn) return;
          return fn.call(receiver, context, function next() {
            return dispatch(i + 1);
          });
        }
      };
    },
    composeAsync(chains, adapter) {
      if (!chains) chains = [];
      return function (context, next) {
        // last called middleware #
        let index = -1;
        return dispatch(0);
        function dispatch(i) {
          if (i <= index) return Promise.reject(new Error('next() called multiple times'));
          index = i;
          let receiver;
          let fn;
          const chain = chains[i];
          if (chain) {
            const obj = adapter(context, chain);
            if (!obj) return dispatch(i + 1);
            receiver = obj.receiver;
            fn = obj.fn;
            if (!fn) return Promise.reject(new Error('fn is not defined'));
          }
          if (i === chains.length) fn = next;
          if (!fn) return Promise.resolve();
          try {
            return Promise.resolve(
              fn.call(receiver, context, function next() {
                return dispatch(i + 1);
              })
            );
          } catch (err) {
            return Promise.reject(err);
          }
        }
      };
    },
    async createAnonymousContext({ locale, subdomain, module, instance }) {
      // url
      const url = module ? this.combineFetchPath(module, '') : '/api/a/base/';
      // ctx
      const ctx = app.createAnonymousContext({
        method: 'post',
        url,
      });
      ctx.req.ctx = ctx;
      // locale
      Object.defineProperty(ctx, 'locale', {
        get() {
          return locale || app.config.i18n.defaultLocale;
        },
      });
      // subdomain
      Object.defineProperty(ctx, 'subdomain', {
        get() {
          return subdomain;
        },
      });
      // instance
      if (subdomain !== undefined && subdomain !== null) {
        ctx.instance = await ctx.bean.instance.get({ subdomain });
        // start instance
        if (instance) {
          await ctx.bean.instance.checkAppReadyInstance();
        }
      }
      // ok
      return ctx;
    },
    async executeBean({
      locale,
      subdomain,
      beanModule,
      beanFullName,
      context,
      fn,
      transaction,
      ctxCaller,
      ctxParent,
      instance,
    }) {
      // ctxModule
      const ctxModule = beanModule || ctxCaller?.module?.info?.relativeName || ctxParent?.module?.info?.relativeName;
      // ctx
      const ctx = await this.createAnonymousContext({ locale, subdomain, module: ctxModule, instance });
      // innerAccess
      ctx.innerAccess = true;
      // ctxCaller
      if (ctxCaller) {
        // multipart
        ctx.multipart = function (options) {
          return ctxCaller.multipart(options);
        };
        // delegateProperties
        delegateProperties(ctx, ctxCaller);
        // ctxCaller
        ctx.ctxCaller = ctxCaller;
      }
      // ctxParent
      if (ctxParent) {
        // delegateProperties
        delegateProperties(ctx, ctxParent);
        // dbLevel
        ctx.dbLevel = (ctxParent.dbLevel || 0) + 1;
      }
      // dbLevel
      if (!ctxCaller && !ctxParent) {
        ctx.dbLevel = 1;
      }
      // bean
      const bean = beanFullName ? ctx.bean._getBean(beanFullName) : null;
      if (!bean && beanFullName && !is.function(fn)) {
        throw new Error(`bean not found: ${beanFullName}`);
      }
      // execute
      let res;
      if (transaction) {
        res = await ctx.transaction.begin(async () => {
          return await this._executeBeanFn({ fn, ctx, bean, context });
        });
      } else {
        res = await this._executeBeanFn({ fn, ctx, bean, context });
      }
      // tail done
      await ctx.tailDone();
      // ok
      return res;
    },
    async _executeBeanFn({ fn, ctx, bean, context }) {
      let res;
      if (is.function(fn)) {
        res = await fn({ ctx, bean, context });
      } else {
        fn = fn || 'execute';
        if (!bean[fn]) {
          throw new Error(`bean method not found: ${bean.__beanFullName}:${fn}`);
        }
        res = await bean[fn](context);
      }
      return res;
    },
    async lock({ subdomain, resource, fn, options, redlock }) {
      // resource
      const _lockResource = `redlock_${app.name}:${this.subdomainDesp(subdomain)}:${resource}`;
      // options
      const _lockOptions = Object.assign({}, app.config.queue.redlock.options, options);
      // redlock
      if (!redlock) {
        redlock = app.meta.redlock.create(_lockOptions);
      }
      let _lock = await redlock.lock(_lockResource, _lockOptions.lockTTL);
      // timer
      let _lockTimer = null;
      const _lockDone = () => {
        if (_lockTimer) {
          clearInterval(_lockTimer);
          _lockTimer = null;
        }
      };
      _lockTimer = setInterval(() => {
        _lock
          .extend(_lockOptions.lockTTL)
          .then(lock => {
            _lock = lock;
          })
          .catch(err => {
            app.logger.error(err);
            _lockDone();
          });
      }, _lockOptions.lockTTL / 2);
      try {
        const res = await fn();
        _lockDone();
        await _lock.unlock();
        return res;
      } catch (err) {
        _lockDone();
        await _lock.unlock();
        throw err;
      }
    },
    mixinClasses(classMain, classesMore, ...args) {
      // classesMore
      if (!Array.isArray(classesMore)) {
        classesMore = [classesMore];
      }
      // classMain
      if (is.function(classMain) && !is.class(classMain)) {
        classMain = classMain(...args);
      }
      if (classMain.__eb_mixined) return classMain;
      // classesMore
      const mixins = [];
      for (const _class of classesMore) {
        if (is.function(_class) && !is.class(_class)) {
          mixins.push(_class(...args));
        } else {
          mixins.push(_class);
        }
      }
      // mixin
      for (const mixin of mixins) {
        copyProperties(classMain, mixin); // copy static
        copyProperties(classMain.prototype, mixin.prototype); // copy prototype
      }
      // record
      classMain.__eb_mixined = true;
      // ok
      return classMain;
    },
    subdomainDesp(subdomain) {
      if (subdomain === undefined || subdomain === null) return '~';
      return subdomain || '-';
    },
    deprecated(oldUsage, newUsage) {
      return console.warn(
        '`'
          .concat(oldUsage, '` is deprecated and will be removed in a later version. Use `')
          .concat(newUsage, '` instead')
      );
    },
    requireDynamic(file) {
      if (!file) throw new Error('file should not empty');
      let instance = require(file);
      const mtime = this._requireDynamic_getFileTime(file);
      if (instance.__requireDynamic_mtime === undefined) {
        instance.__requireDynamic_mtime = mtime;
      } else if (instance.__requireDynamic_mtime !== mtime) {
        delete require.cache[require.resolve(file)];
        instance = require(file);
        instance.__requireDynamic_mtime = mtime;
      }
      return instance;
    },
    _requireDynamic_getFileTime(file) {
      if (!path.isAbsolute(file)) return null;
      const exists = fse.pathExistsSync(file);
      if (!exists) return null;
      // stat
      const stat = fse.statSync(file);
      return stat.mtime.valueOf();
    },
  };
};

function delegateProperties(ctx, ctxCaller) {
  const req = ctx.req;
  for (const property of ['cookies', 'session', 'user', 'state']) {
    delegateProperty(ctx, ctxCaller, property);
  }
  for (const property of ['query', 'params', 'headers', 'body']) {
    delegateProperty(ctx.request, ctxCaller.request, property);
    if (ctx.request[property]) req[property] = ctx.request[property];
  }
  if (ctx.session) req.session = ctx.session;
  // if (ctx.query) req.query = ctx.query;
  // if (ctx.request.body) req.body = ctx.request.body;
}
function delegateProperty(ctx, ctxCaller, property) {
  const keyMock = `__executeBean__mock__${property}__`;
  const keyOriginal = `__executeBean__mock__${property}__original__`;
  if (['cookies', 'session', 'headers'].includes(property)) {
    ctx[keyOriginal] = ctx[property];
  }
  Object.defineProperty(ctx, property, {
    get() {
      const value = ctxCaller && ctxCaller[property];
      if (value) return value;
      //
      if (['user', 'body'].includes(property)) return value;
      //
      if (['cookies', 'session', 'headers'].includes(property)) {
        return ctx[keyOriginal];
      }
      //
      if (!ctx[keyMock]) {
        ctx[keyMock] = {};
      }
      return ctx[keyMock];
    },
  });
}

function copyProperties(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      const desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
