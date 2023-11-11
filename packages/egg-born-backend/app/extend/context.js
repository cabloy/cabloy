const raw = require('raw-body');
const inflate = require('inflation');
const mparse = require('egg-born-mparse').default;
const metaCtxFn = require('../../lib/module/metaCtx.js');
const DbTransaction = require('../../lib/base/dbTransaction.js');

const MODULE = Symbol.for('Context#__module');
const META = Symbol.for('Context#__meta');
const DATABASE = Symbol.for('Context#__database');
const DATABASEMETA = Symbol.for('Context#__databasemeta');
const INNERACCESS = Symbol.for('Context#__inneraccess');
const SUBDOMAIN = Symbol.for('Context#__subdomain');
const CTXCALLER = Symbol.for('Context#__ctxcaller');
const TAILCALLBACKS = Symbol.for('Context#__tailcallbacks');
const DBLEVEL = Symbol.for('Context#__dblevel');

module.exports = {
  get module() {
    if (this[MODULE] === undefined) {
      const url = this.req.mockUrl || this.req.url || '';
      let info;
      if (url.indexOf('/api/static/public/') === 0) {
        info = null;
      } else {
        info = mparse.parseInfo(mparse.parseName(url));
      }
      if (!info) {
        info = mparse.parseInfo('a-base');
      }
      if (info) {
        const module = this.app.meta.modules[info.relativeName];
        // should not throw error, because the url maybe not valid
        // if (!module) throw new Error(`module not found: ${info.relativeName}`);
        this[MODULE] = module || null;
      } else {
        this[MODULE] = null;
      }
    }
    return this[MODULE];
  },
  get meta() {
    if (!this[META]) {
      this[META] = metaCtxFn(this);
    }
    return this[META];
  },
  get db() {
    if (!this[DATABASE]) {
      this[DATABASE] = this.meta.util.createDatabase();
    }
    return this[DATABASE];
  },
  set db(value) {
    this[DATABASE] = value;
  },
  get dbMeta() {
    if (!this[DATABASEMETA]) {
      this[DATABASEMETA] = {
        master: true,
        transaction: new DbTransaction(this),
      };
    }
    return this[DATABASEMETA];
  },
  set dbMeta(metaCaller) {
    // transaction
    if (metaCaller.transaction.inTransaction) {
      this.dbMeta.master = false; // false only on metaCaller.transaction=true
      this.dbMeta.transaction = metaCaller.transaction;
    }
  },
  get transaction() {
    return this.dbMeta.transaction;
  },
  get innerAccess() {
    return this[INNERACCESS];
  },
  set innerAccess(value) {
    this[INNERACCESS] = value;
  },
  get dbLevel() {
    return this[DBLEVEL] || 0;
  },
  set dbLevel(value) {
    this[DBLEVEL] = value;
  },
  get subdomain() {
    return typeof this[SUBDOMAIN] === 'undefined' ? this.subdomains.join('.') : this[SUBDOMAIN];
  },
  set subdomain(value) {
    this[SUBDOMAIN] = value;
  },
  get ctxCaller() {
    return this[CTXCALLER];
  },
  set ctxCaller(value) {
    // ctxCaller
    this[CTXCALLER] = value;
    // innerAccess
    this.innerAccess = true;
    // transaction
    this.dbMeta = value.dbMeta;
    // dbLevel
    this.dbLevel = value.dbLevel;
  },
  get cache() {
    return this.bean.cache;
  },
  tail(cb) {
    if (!this.dbMeta.master) {
      this.ctxCaller.tail(cb);
    } else {
      this.tailCallbacks.push(cb);
    }
  },
  async tailDone() {
    while (true) {
      const cb = this.tailCallbacks.shift();
      if (!cb) break;
      await cb();
      // try {
      //   await cb();
      // } catch (err) {
      //   this.app.logger.error(err);
      // }
    }
  },
  get tailCallbacks() {
    if (!this[TAILCALLBACKS]) {
      this[TAILCALLBACKS] = [];
    }
    return this[TAILCALLBACKS];
  },

  async executeBean({ locale, subdomain, beanModule, beanFullName, context, fn, transaction }) {
    this.app.meta.util.deprecated('ctx.executeBean', 'ctx.meta.util.executeBean');
    return await this.meta.util.executeBean({
      locale,
      subdomain,
      context,
      beanModule,
      beanFullName,
      transaction,
      fn,
    });
  },

  async executeBeanIsolate({ locale, subdomain, beanModule, beanFullName, context, fn, transaction }) {
    this.app.meta.util.deprecated('ctx.executeBeanIsolate', 'ctx.meta.util.executeBeanIsolate');
    return await this.meta.util.executeBeanIsolate({
      locale,
      subdomain,
      context,
      beanModule,
      beanFullName,
      transaction,
      fn,
    });
  },

  // * deprecated
  // performActionInBackground(options) {
  //   // inherit subdomain, cookies such as locale
  //   const ctx = this;
  //   ctx.runInBackground(() => {
  //     // performAction
  //     return ctx.meta.util.performAction(options);
  //   });
  // },

  /**
   * perform action of this or that module
   * @param  {string} options options
   * @param  {string} options.method method
   * @param  {string} options.url    url
   * @param  {json} options.body   body(optional)
   * @return {promise}                response.body.data or throw error
   */
  performAction({ innerAccess, method, url, query, params, headers, body }) {
    this.app.meta.util.deprecated('ctx.performAction', 'ctx.meta.util.performAction');
    return this.meta.util.performAction({ innerAccess, method, url, query, params, headers, body });
  },

  getVal(name) {
    return (
      (this.params && this.params[name]) ||
      (this.query && this.query[name]) ||
      (this.request.body && this.request.body[name])
    );
  },

  getInt(name) {
    return parseInt(this.getVal(name));
  },

  getFloat(name) {
    return parseFloat(this.getVal(name));
  },

  getStr(name) {
    const v = this.getVal(name);
    return (v && v.toString()) || '';
  },

  getSafeStr(name) {
    const v = this.getStr(name);
    return v.replace(/'/gi, "''");
  },

  successMore(list, index, size) {
    this.success({ list, index: index + list.length, finished: size === -1 || size === 0 || list.length < size });
  },

  async getPayload(options) {
    return await raw(inflate(this.req), options);
  },
};
