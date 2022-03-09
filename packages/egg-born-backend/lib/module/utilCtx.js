const http = require('http');
const compose = require('koa-compose');
const onFinished = require('on-finished');
const statuses = require('statuses');
const isJSON = require('koa-is-json');
const Stream = require('stream');
const is = require('is-type-of');

module.exports = ctx => {
  const util = {
    async lock({ subdomain, resource, fn, options, redlock }) {
      if (subdomain === undefined) subdomain = ctx.subdomain;
      return await ctx.app.meta.util.lock({ subdomain, resource, fn, options, redlock });
    },
    queuePush(info) {
      const dbLevel = !info.dbLevel ? ctx.dbLevel + 1 : info.dbLevel;
      const locale = info.locale === undefined ? ctx.locale : info.locale;
      const subdomain = info.subdomain === undefined ? ctx.subdomain : info.subdomain;
      ctx.app.meta.queue.push({
        ...info,
        dbLevel,
        locale,
        subdomain,
      });
    },
    async queuePushAsync(info) {
      const dbLevel = !info.dbLevel ? ctx.dbLevel + 1 : info.dbLevel;
      const locale = info.locale === undefined ? ctx.locale : info.locale;
      const subdomain = info.subdomain === undefined ? ctx.subdomain : info.subdomain;
      return await ctx.app.meta.queue.pushAsync({
        ...info,
        dbLevel,
        locale,
        subdomain,
      });
    },
    async executeBean({ locale, subdomain, beanModule, beanFullName, context, fn, transaction }) {
      return await ctx.app.meta.util.executeBean({
        locale: locale === undefined ? ctx.locale : locale,
        subdomain: subdomain === undefined ? ctx.subdomain : subdomain,
        context,
        beanModule,
        beanFullName,
        transaction,
        fn,
        ctxCaller: ctx,
      });
    },
    async executeBeanIsolate({ locale, subdomain, beanModule, beanFullName, context, fn, transaction, ctxParent }) {
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
    performAction({ innerAccess, subdomain, method, url, query, params, headers, body }) {
      return new Promise((resolve, reject) => {
        const handleRequest = appCallback.call(ctx.app);
        const request = createRequest(
          {
            method,
            url: ctx.app.meta.util.combineFetchPath(ctx.module && ctx.module.info, url),
          },
          ctx
        );
        const response = new http.ServerResponse(request);
        handleRequest(ctx, innerAccess, subdomain, request, response, resolve, reject, query, params, headers, body);
      });
    },
    getDbOriginal() {
      const dbLevel = ctx.dbLevel;
      let mysqlConfig = ctx.app.mysql.__ebdb_test;
      if (!mysqlConfig) return ctx.app.mysql.get('__ebdb');
      let dbs = ctx.app.mysql.__ebdb_test_dbs;
      if (!dbs) {
        dbs = ctx.app.mysql.__ebdb_test_dbs = [];
      }
      if (!dbs[dbLevel]) {
        if (dbLevel > 0) {
          const connectionLimit =
            mysqlConfig.connectionLimitInner || ctx.app.mysql.options.default.connectionLimitInner;
          mysqlConfig = Object.assign({}, mysqlConfig, { connectionLimit });
        }
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
          if (value.name !== 'createPromise') return value;
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

function appCallback() {
  const fn = compose(this.middleware);
  const self = this;

  if (!this.listeners('error').length) this.on('error', this.onerror);

  return function handleRequest(
    ctxCaller,
    innerAccess,
    subdomain,
    req,
    res,
    resolve,
    reject,
    query,
    params,
    headers,
    body
  ) {
    res.statusCode = 404;
    const ctx = self.createContext(req, res);
    onFinished(res, ctx.onerror);

    // subdomain
    ctx.subdomain = typeof subdomain === 'undefined' ? ctxCaller.subdomain : subdomain;

    // query params body
    if (query) ctx.query = query;
    if (params) ctx.params = params;
    ctx.request.body = body || null; // not undefined

    // headers
    if (headers) Object.assign(ctx.headers, headers);

    // multipart
    ctx.multipart = function (options) {
      return ctxCaller.multipart(options);
    };

    // cookies
    delegateCookies(ctx, ctxCaller);

    // ctxCaller
    ctx.ctxCaller = ctxCaller;

    // innerAccess
    if (innerAccess !== undefined) ctx.innerAccess = innerAccess;

    // call
    fn(ctx)
      .then(function handleResponse() {
        respond.call(ctx);
        if (ctx.status === 200) {
          if (!ctx.body || ctx.body.code === undefined) {
            // not check code, e.g. text/xml
            resolve(ctx.body);
          } else {
            if (ctx.body.code === 0) {
              resolve(ctx.body.data);
            } else {
              const error = ctx.createError(ctx.body);
              reject(error);
            }
          }
        } else {
          const error = ctx.createError({
            code: ctx.status,
            message: ctx.message || ctx.body,
          });
          reject(error);
        }
      })
      .catch(err => {
        const error = ctx.createError(err);
        ctx.onerror(error);
        reject(error);
      });
  };
}

function respond() {
  // allow bypassing koa
  if (this.respond === false) return;

  const res = this.res;
  if (res.headersSent || !this.writable) return;

  let body = this.body;
  const code = this.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    this.body = null;
    return res.end();
  }

  if (this.method === 'HEAD') {
    if (isJSON(body)) this.length = Buffer.byteLength(JSON.stringify(body));
    return res.end();
  }

  // status body
  if (body == null) {
    this.type = 'text';
    body = this.message || String(code);
    this.length = Buffer.byteLength(body);
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if (typeof body === 'string') return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  this.length = Buffer.byteLength(body);
  res.end(body);
}

function delegateCookies(ctx, ctxCaller) {
  const _cookies = ctx.cookies;
  Object.defineProperty(ctx, 'cookies', {
    get() {
      return ctxCaller.cookies || _cookies;
    },
  });
}

function createRequest({ method, url }, ctxCaller) {
  // _req
  const _req = ctxCaller.request;
  // req
  const req = new http.IncomingMessage();
  req.headers = _req.headers;
  req.host = _req.host;
  req.hostname = _req.hostname;
  req.protocol = _req.protocol;
  req.secure = _req.secure;
  req.method = method.toUpperCase();
  req.url = url;
  // path,
  req.socket = {
    remoteAddress: _req.socket.remoteAddress,
    remotePort: _req.socket.remotePort,
  };
  return req;
}
