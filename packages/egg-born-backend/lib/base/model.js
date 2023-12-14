const is = require('is-type-of');

let __columns = {};

class Model {
  constructor({ table, options = {} }) {
    this.table = table;
    this.disableDeleted =
      options.disableDeleted === undefined ? this.app.config.model.disableDeleted : options.disableDeleted;
    this.disableInstance =
      options.disableInstance === undefined ? this.app.config.model.disableInstance : options.disableInstance;
  }

  async columns(tableName) {
    tableName = tableName || this.table;
    let columns = __columns[tableName];
    if (!columns) {
      const list = await this.ctx.db.query(`show columns from ${this.ctx.db.format('??', tableName)}`);
      columns = __columns[tableName] = {};
      for (const item of list) {
        columns[item.Field] = item;
      }
    }
    return columns;
  }

  columnsClear(tableName) {
    tableName = tableName || this.table;
    const exists = __columns[tableName];
    delete __columns[tableName];
    return exists;
  }

  columnsClearAll() {
    const exists = Object.keys(__columns).length > 0;
    __columns = {};
    return exists;
  }

  async prepareData(item) {
    // columns
    const columns = await this.columns();
    // data
    const data = {};
    for (const columnName in columns) {
      if (item[columnName] !== undefined) {
        data[columnName] = item[columnName];
      }
    }
    return data;
  }

  async default(data) {
    data = data || {};
    // columns
    const columns = await this.columns();
    for (const columnName in columns) {
      const column = columns[columnName];
      data[columnName] = this._coerceTypeOfDefault(column);
    }
    return data;
  }

  _coerceTypeOfDefault(column) {
    // type
    let type = column.Type;
    const pos = type.indexOf('(');
    if (pos > -1) type = type.substring(0, pos);
    // default value
    const value = column.Default;
    // coerce
    if (value === null) return value;
    if (['timestamp'].includes(type) && value === 'CURRENT_TIMESTAMP') return new Date();
    if (['bit', 'bool'].includes(type)) return Boolean(value);
    if (['float', 'double'].includes(type)) return Number(value);
    if (['tinyint', 'smallint', 'mediumint', 'int', 'bigint'].includes(type)) return Number(value);
    // others
    return value;
  }

  async create(data, ...args) {
    const data2 = await this.prepareData(data);
    const res = await this.insert(data2, ...args);
    return res.insertId;
  }

  async write(data, ...args) {
    const data2 = await this.prepareData(data);
    return await this.update(data2, ...args);
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
  '_where',
  '_orders',
  'raw',
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
        // console.log(this.constructor.name, arguments);
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

module.exports = Model;
