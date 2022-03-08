const is = require('is-type-of');

module.exports = ctx => {
  const util = {
    getDbOriginal() {
      const dbLevel = ctx.dbLevel;
      const mysqlConfig = ctx.app.mysql.__ebdb_test;
      if (!mysqlConfig) return ctx.app.mysql.get('__ebdb');
      let dbs = ctx.app.mysql.__ebdb_test_dbs;
      if (!dbs) {
        dbs = ctx.app.mysql.__ebdb_test_dbs = [];
      }
      if (!dbs[dbLevel]) {
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
