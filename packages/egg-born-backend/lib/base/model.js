const is = require('is-type-of');

module.exports = app => {
  class Model extends app.BaseContextClass {

    constructor(ctx, { table }) {
      super(ctx);
      this.table = table;
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
    'count',
    'select',
    'get',
    'insert',
    'update',
    'delete',
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

  return Model;
};
