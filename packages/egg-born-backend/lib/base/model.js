const is = require('is-type-of');
const moment = require('moment');
const RDSClient = require('ali-rds');

module.exports = app => {
  class Model extends app.BaseContextClass {

    constructor(ctx, { table, options = {} }) {
      super(ctx);
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
          const args = [ ];
          if (this.table) args.push(this.table);
          for (const arg of arguments) args.push(arg);
          if ((!this.table || !this.disableInstance) && !args[1].iid) {
            args[1].iid = this.ctx.instance.id;
          }
          if (this.table && !this.disableDeleted) {
            args[1].deleted = 0;
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
          const args = [ ];
          if (this.table) args.push(this.table);
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
          const args = [ ];
          if (this.table) args.push(this.table);
          for (const arg of arguments) args.push(arg);
          args[1] = args[1] || {};
          if ((!this.table || !this.disableInstance) && !args[1].iid) {
            args[1].iid = this.ctx.instance.id;
          }
          if (this.table && !this.disableDeleted) {
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
          const args = [ ];
          if (this.table) args.push(this.table);
          for (const arg of arguments) args.push(arg);
          args[1] = args[1] || {};
          if ((!this.table || !this.disableInstance) && !args[1].iid) {
            args[1].iid = this.ctx.instance.id;
          }
          if (this.table && !this.disableDeleted) {
            args[1].deleted = 0;
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
          const args = [ ];
          if (this.table) args.push(this.table);
          for (const arg of arguments) args.push(arg);
          args[1] = args[1] || {};
          // if (args[1].id) {
          //   return this.ctx.db[method].apply(this.ctx.db, args);
          // }
          if ((!this.table || !this.disableInstance) && !args[1].iid) {
            args[1].iid = this.ctx.instance.id;
          }
          if (this.table && !this.disableDeleted) {
            args[1].deleted = 0;
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
          const args = [ ];
          if (this.table) args.push(this.table);
          for (const arg of arguments) args.push(arg);
          args[1] = args[1] || {};
          args[1].where = args[1].where || {};
          if ((!this.table || !this.disableInstance) && !args[1].iid) {
            args[1].where.iid = this.ctx.instance.id;
          }
          if (this.table && !this.disableDeleted) {
            args[1].where.deleted = 0;
          }
          return this.ctx.db[method].apply(this.ctx.db, args);
        };
      },
    });
  });

  [
    '_format',
  ].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function() {
          return _format(this.ctx.db, arguments[0]);
        };
      },
    });
  });

  // replace _where
  RDSClient.prototype._where = function(where) {
    if (!where) {
      return '';
    }

    const wheres = [];
    const values = [];
    for (const key in where) {
      let ignore = false;
      const value = where[key];
      if (Array.isArray(value)) {
        wheres.push('?? IN (?)');
      } else if (value === null || value === undefined) {
        wheres.push('?? IS ?');
      } else if (value && typeof value === 'object') {
        let op = value.op || '='; // default is =
        op = op.indexOf('like') > -1 ? 'LIKE' : op;
        wheres.push(`${this.format('??', key)} ${_safeOp(op)} ${_format(this, value)}`);
        ignore = true;
      } else {
        wheres.push('?? = ?');
      }
      if (!ignore) {
        values.push(key);
        values.push(value);
      }
    }
    if (wheres.length > 0) {
      return this.format(` WHERE (${wheres.join(' AND ')})`, values);
    }
    return '';
  };

  return Model;
};

function _format(db, value) {
  if (typeof value !== 'object') return db.format('?', value);
  let val;
  if (value.type === 'Date') {
    val = db.format('?', moment(value.val).format('YYYY-MM-DD HH:mm:ss.SSS'));
  } else {
    val = db.format('?', value.val);
  }
  const val2 = val.substr(1, val.length - 2);
  if (value.op === 'like') return `'%${val2}%'`;
  if (value.op === 'likeLeft') return `'%${val2}'`;
  if (value.op === 'likeRight') return `'${val2}%'`;
  if (value.op === 'in') {
    const arr = typeof value.val === 'string' ? value.val.split(',') : value.val;
    const arrVal = [];
    for (const item of arr) {
      arrVal.push(db.format('?', item));
    }
    return `(${arrVal.join(',')})`;
  }
  return val;
}

function _safeOp(op) {
  return op.replace(/[\\\.*#%'"`;, ]/g, '');
}

