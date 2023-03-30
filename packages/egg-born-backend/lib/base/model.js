const is = require('is-type-of');
const moment = require('moment');

const __whereOrPlaceholder = '__or__';
const __whereAndPlaceholder = '__and__';
const __columns = {};

module.exports = app => {
  class Model extends app.BaseContextClass {
    constructor(ctx, { table, options = {} }) {
      super(ctx);
      this.table = table;
      this.disableDeleted =
        options.disableDeleted === undefined ? app.config.model.disableDeleted : options.disableDeleted;
      this.disableInstance =
        options.disableInstance === undefined ? app.config.model.disableInstance : options.disableInstance;
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
      if (this.table && !this.disableDeleted && row.deleted === undefined) {
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
    'literals', //
    'escape',
    'escapeId',
    'format',
    '_formatValue',
    '_formatWhere',
    'query',
    'queryOne',
    '_query',
    '_selectColumns',
    '_limit',
  ].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        if (is.function(this.ctx.db[method])) {
          return function () {
            return this.ctx.db[method].apply(this.ctx.db, arguments);
          };
        }
        // property
        return this.ctx.db[method];
      },
    });
  });

  ['insert'].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function (...args) {
          if (args.length === 0) {
            args.push({});
          }
          if (this.table) {
            args.unshift(this.table);
          }
          this._insertRowsCheck(args[1]);
          return this.ctx.db[method].apply(this.ctx.db, args);
        };
      },
    });
  });

  ['update'].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function () {
          const args = [];
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

  ['delete'].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function () {
          const args = [];
          if (this.table) args.push(this.table);
          for (const arg of arguments) args.push(arg);
          args[1] = args[1] || {};
          this._rowCheck(args[1]);
          if (this.table && !this.disableDeleted) {
            const sql = this.ctx.db.format('UPDATE ?? SET deleted=1 ', [args[0]]) + this.ctx.db._where(args[1]);
            return this.ctx.db.query(sql);
          }
          return this.ctx.db[method].apply(this.ctx.db, args);
        };
      },
    });
  });

  ['count'].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function () {
          const args = [];
          if (this.table) args.push(this.table);
          for (const arg of arguments) args.push(arg);
          args[1] = args[1] || {};
          this._rowCheck(args[1]);
          return this.ctx.db[method].apply(this.ctx.db, args);
        };
      },
    });
  });

  ['get'].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function () {
          const args = [];
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

  ['select'].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function () {
          const args = [];
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

  ['_orders'].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function () {
          const value = arguments[0];
          if (!value || !Array.isArray(value) || value.length === 0) return null;
          return this.ctx.db[method].apply(this.ctx.db, arguments);
        };
      },
    });
  });

  ['_where'].forEach(method => {
    Object.defineProperty(Model.prototype, method, {
      get() {
        return function () {
          return _whereClause(this.ctx.db, arguments[0]);
        };
      },
    });
  });

  // // replace _where
  // RDSClient.prototype._where = function (where) {
  //   return _whereClause(this, where);
  // };

  return Model;
};

function _whereClause(db, where) {
  // true/false/clause
  const wheres = _formatWhere(db, where);
  if (wheres === true) {
    return '';
  } else if (wheres === false) {
    return ' WHERE false';
  }
  return ` WHERE (${wheres})`;
}
