const is = require('is-type-of');
const performActionFn = require('./performAction.js');

module.exports = ctx => {
  const util = {
    runInBackground(scope) {
      ctx.runInBackground(async () => {
        await ctx.meta.util.executeBeanIsolate({
          fn: async ({ ctx }) => {
            await scope({ ctx });
          },
        });
      });
    },
    async lock({ subdomain, resource, fn, options, redlock }) {
      if (subdomain === undefined) subdomain = ctx.subdomain;
      return await ctx.app.meta.util.lock({ subdomain, resource, fn, options, redlock });
    },
    broadcastEmit({ locale, subdomain, module, broadcastName, data }) {
      ctx.app.meta.broadcast.emit({
        locale: locale === undefined ? ctx.locale : locale,
        subdomain: subdomain === undefined ? ctx.subdomain : subdomain,
        module,
        broadcastName,
        data,
      });
    },
    queuePush(info) {
      ctx.app.meta.queue.push(this._queuePushInfoPrepare(info));
    },
    async queuePushAsync(info) {
      return await ctx.app.meta.queue.pushAsync(this._queuePushInfoPrepare(info));
    },
    _queuePushInfoPrepare(info) {
      const dbLevel = !info.dbLevel ? ctx.dbLevel + 1 : info.dbLevel;
      const locale = info.locale === undefined ? ctx.locale : info.locale;
      const subdomain = info.subdomain === undefined ? ctx.subdomain : info.subdomain;
      // new info
      info = {
        ...info,
        dbLevel,
        locale,
        subdomain,
      };
      if (!info.ctxParent) info.ctxParent = {};
      if (!info.ctxParent.request) info.ctxParent.request = {};
      if (!info.ctxParent.request.headers) info.ctxParent.request.headers = {};
      // headers
      const headers = info.ctxParent.request.headers;
      for (const key of ['x-clientid', 'x-scene']) {
        if (!headers[key]) {
          const value = key === 'x-clientid' ? ctx.bean.util.getFrontClientId() : ctx.bean.util.getFrontScene();
          if (value) {
            headers[key] = value;
          }
        }
      }
      for (const key of ['host', 'origin', 'referer', 'user-agent']) {
        if (!headers[key]) {
          const value = ctx.request.headers[key];
          if (value) {
            headers[key] = value;
          }
        }
      }
      // ok
      return info;
    },
    async executeBeanAuto({ beanModule, beanFullName, context, fn }) {
      const _beanClass = beanFullName ? ctx.bean._getBeanClass(beanFullName) : null;
      if (_beanClass && _beanClass.mode === 'ctx') {
        // in the same ctx
        const bean = ctx.bean._getBean(beanFullName);
        return await ctx.app.meta.util._executeBeanFn({ fn, ctx, bean, context });
      }
      // in the new ctx
      return await this.executeBean({ beanModule, beanFullName, context, fn });
    },
    async executeBean({ locale, subdomain, beanModule, beanFullName, context, fn, transaction, instance }) {
      return await ctx.app.meta.util.executeBean({
        locale: locale === undefined ? ctx.locale : locale,
        subdomain: subdomain === undefined ? ctx.subdomain : subdomain,
        context,
        beanModule,
        beanFullName,
        transaction,
        fn,
        ctxCaller: ctx,
        instance,
      });
    },
    async executeBeanIsolate({
      locale,
      subdomain,
      beanModule,
      beanFullName,
      context,
      fn,
      transaction,
      ctxParent,
      instance,
    }) {
      if (ctxParent) {
        if (ctxParent.dbLevel === undefined) {
          ctxParent = {
            ...ctxParent,
            dbLevel: ctx.dbLevel,
          };
        }
      } else {
        ctxParent = ctx;
      }
      return await ctx.app.meta.util.executeBean({
        locale: locale === undefined ? ctx.locale : locale,
        subdomain: subdomain === undefined ? ctx.subdomain : subdomain,
        context,
        beanModule,
        beanFullName,
        transaction,
        fn,
        ctxParent,
        instance,
      });
    },
    /**
     * perform action of this or that module
     * @param  {string} options options
     * @param  {string} options.method method
     * @param  {string} options.url    url
     * @param  {json} options.body   body(optional)
     * @return {promise}                response.body.data or throw error
     */
    async performAction({ innerAccess, method, url, query, params, headers, body }) {
      return await performActionFn({
        ctxCaller: ctx,
        innerAccess,
        method,
        url,
        query,
        params,
        headers,
        body,
      });
    },
    getDbOriginal() {
      const dbLevel = ctx.dbLevel;
      const mysqlConfig = ctx.app.mysql.__ebdb_test;
      if (!mysqlConfig) return ctx.app.mysql.get('__ebdb');
      let dbs = ctx.app.mysql.__ebdb_test_dbs;
      if (!dbs) {
        dbs = ctx.app.mysql.__ebdb_test_dbs = [];
      }
      if (!dbs[dbLevel]) {
        // need not to check connectionLimit
        // if (dbLevel > 0) {
        //   const connectionLimit =
        //     mysqlConfig.connectionLimitInner || ctx.app.mysql.options.default.connectionLimitInner;
        //   mysqlConfig = Object.assign({}, mysqlConfig, { connectionLimit });
        // }
        dbs[dbLevel] = ctx.app.mysql.createInstance(mysqlConfig);
      }
      return dbs[dbLevel];
    },
    createDatabase() {
      const db = this.getDbOriginal();
      return new Proxy(db, {
        get(target, prop) {
          const value = target[prop];
          if (!is.function(value)) return value;
          // if (value.name !== 'createPromise') return value;
          // check if use transaction
          if (!ctx.dbMeta.transaction.inTransaction) return value;
          return function (...args) {
            return ctx.dbMeta.transaction.connection[prop].apply(ctx.dbMeta.transaction.connection, args);
          };
        },
      });
    },
  };
  return util;
};
