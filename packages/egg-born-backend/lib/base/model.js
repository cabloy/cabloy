const is = require('is-type-of');
const moment = require('moment');
const RDSClient = require('ali-rds');

const __columns = {};

module.exports = app => {
  class Model extends app.BaseContextClass {

    constructor(ctx, { table, options = {} }) {
      super(ctx);
      this.table = table;
      this.disableDeleted = (options.disableDeleted === undefined) ? app.config.model.disableDeleted : options.disableDeleted;
      this.disableInstance = (options.disableInstance === undefined) ? app.config.model.disableInstance : options.disableInstance;
    }

    async columns() {
      let columns = __columns[this.table];
      if (!columns) {
        const list = await this.ctx.db.query(`show columns from ${this.ctx.db.format('??', this.table)}`);
        columns = __columns[this.table] = {};
        for (const item of list) {
          columns[item.Field] = item;
        }
      }
      return columns;
    }

    async prepareData(item) {
      // columns
      const columns = await this.columns();
      // data
      const data = {};
      for (const column in columns) {
        if (item[column] !== undefined) {
          data[column] = item[column];
        }
      }
      return data;
    }

    _rowCheck(row) {
      if ((!this.table || !this.disableInstance) && row.iid === undefined) {
        row.iid = this.ctx.instance.id;
      }
      if ((this.table && !this.disableDeleted) && row.deleted === undefined) {
        row.deleted = 0;
      }
    }

    _insertRowsCheck(rows) {
      if (!Array.isArray(rows)) return this._rowCheck(rows);
      for (const row of rows) {
        this._rowCheck(row);
      }
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
          this._insertRowsCheck(args[1]);
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
          if (args[2] && args[2].where) {
            this._rowCheck(args[2].where);
          }
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
          this._rowCheck(args[1]);
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
          this._rowCheck(args[1]);
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
          this._rowCheck(args[1]);
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
          this._rowCheck(args[1].where);
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
          return _formatValue(this.ctx.db, arguments[0]);
        };
      },
    });
  });

  // replace _where
  RDSClient.prototype._where = function(where) {
    const wheres = _formatWhere(this, where, 'AND');
    if (!wheres) return '';
    return ` WHERE (${wheres})`;
  };

  return Model;
};

function _formatWhere(db, where, join) {
  if (!where) {
    return '';
  }

  const wheres = [];
  for (const key in where) {
    const value = where[key];
    if (Array.isArray(value)) {
      wheres.push(db.format('?? IN (?)', [ key, value ]));
    } else if (value === null || value === undefined) {
      wheres.push(db.format('?? IS ?', [ key, value ]));
    } else if (value && typeof value === 'object') {
      // op
      let op = value.op || '='; // default is =
      op = op.indexOf('like') > -1 ? 'LIKE' : op;
      // op: notNull
      if (op === 'notNull') {
        wheres.push(db.format('?? IS NOT null', [ key ]));
      } else {
        wheres.push(`${db.format('??', key)} ${_safeOp(op)} ${_formatValue(db, value)}`);
      }
    } else {
      wheres.push(db.format('?? = ?', [ key, value ]));
    }
  }
  if (wheres.length === 0) return '';
  return wheres.join(` ${join} `);
}

function _formatValue(db, value) {
  if (typeof value !== 'object') return db.format('?', value);
  let val;
  if (value.type === 'Date') {
    val = db.format('?', moment(value.val).format('YYYY-MM-DD HH:mm:ss.SSS'));
  } else {
    val = db.format('?', value.val);
  }
  // like
  const val2 = val.substr(1, val.length - 2);
  if (value.op === 'like') return `'%${val2}%'`;
  if (value.op === 'likeLeft') return `'%${val2}'`;
  if (value.op === 'likeRight') return `'${val2}%'`;
  // in
  if (value.op === 'in') {
    const arr = typeof value.val === 'string' ? value.val.split(',') : value.val;
    const arrVal = [];
    for (const item of arr) {
      arrVal.push(db.format('?', item));
    }
    return `(${arrVal.join(',')})`;
  }
  // others
  return val;
}

function _safeOp(op) {
  return op.replace(/[\\\.*#%'"`;, ]/g, '');
}

