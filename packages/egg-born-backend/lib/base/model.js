const is = require('is-type-of');

module.exports = app => {
  class Model extends app.BaseContextClass {

    constructor(ctx, { table, options }) {
      super(ctx);
      options = options || {};
      this.table = table;
      this.disableDeleted = (options.disableDeleted === undefined) ? app.config.model.disableDeleted : options.disableDeleted;
      this.disableInstance = (options.disableInstance === undefined) ? app.config.model.disableInstance : options.disableInstance;
    }

  }

  [
    'literals',
    'escape',
    'escapeId',
    'format',
    'query',
    'queryOne',
    '_query',
    '_where',
    '_selectColumns',
    '_orders',
    '_limit',
  ].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        if (is.function(this.ctx.db[method])) {
          return function() {
            return this.ctx.db[method].apply(this.ctx.db, arguments);
          };
        }
        // property
        return this.ctx.db[method];
      },
    });
  });

  [
    'insert',
  ].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function() {
          const args = [ this.table ];
          for (const arg of arguments) args.push(arg);
          if (!this.disableInstance) {
            args[1].iid = this.ctx.instance.id;
          }
          return this.ctx.db[method].apply(this.ctx.db, args);
        };
      },
    });
  });

  [
    'update',
  ].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function() {
          const args = [ this.table ];
          for (const arg of arguments) args.push(arg);
          return this.ctx.db[method].apply(this.ctx.db, args);
        };
      },
    });
  });

  [
    'delete',
  ].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function() {
          const args = [ this.table ];
          for (const arg of arguments) args.push(arg);
          args[1] = args[1] || {};
          if (!this.disableInstance) {
            args[1].iid = this.ctx.instance.id;
          }
          if (!this.disableDeleted) {
            const sql = this.ctx.db.format('UPDATE ?? SET deleted=1 ', [ args[0] ]) +
              this.ctx.db._where(args[1]);
            return this.ctx.db.query(sql);
          }
          return this.ctx.db[method].apply(this.ctx.db, args);
        };
      },
    });
  });

  [
    'count',
  ].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function() {
          const args = [ this.table ];
          for (const arg of arguments) args.push(arg);
          args[1] = args[1] || {};
          if (!this.disableDeleted) {
            args[1].deleted = 0;
          }
          if (!this.disableInstance) {
            args[1].iid = this.ctx.instance.id;
          }
          return this.ctx.db[method].apply(this.ctx.db, args);
        };
      },
    });
  });

  [
    'get',
  ].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function() {
          const args = [ this.table ];
          for (const arg of arguments) args.push(arg);
          args[1] = args[1] || {};
          // if (args[1].id) {
          //   return this.ctx.db[method].apply(this.ctx.db, args);
          // }
          if (!this.disableDeleted) {
            args[1].deleted = 0;
          }
          if (!this.disableInstance) {
            args[1].iid = this.ctx.instance.id;
          }
          return this.ctx.db[method].apply(this.ctx.db, args);
        };
      },
    });
  });

  [
    'select',
  ].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function() {
          const args = [ this.table ];
          for (const arg of arguments) args.push(arg);
          args[1] = args[1] || {};
          args[1].where = args[1].where || {};
          if (!this.disableDeleted) {
            args[1].where.deleted = 0;
          }
          if (!this.disableInstance) {
            args[1].where.iid = this.ctx.instance.id;
          }
          return this.ctx.db[method].apply(this.ctx.db, args);
        };
      },
    });
  });

  return Model;
};
