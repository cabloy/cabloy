/*
* @Author: zhennann
* @Date:   2017-09-28 21:00:57
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-28 23:33:13
*/

const is = require('is-type-of');
const DATABASE = Symbol.for('Context#__database');
const DATABASEMETA = Symbol.for('Context#__databasemeta');

module.exports = {
  get db() {
    if (!this[DATABASE]) {
      this[DATABASE] = createDatabase(this);
    }
    return this[DATABASE];
  },
  get dbMeta() {
    if (!this[DATABASEMETA]) {
      this[DATABASEMETA] = { master: true, transaction: false, connection: null };
    }
    return this[DATABASEMETA];
  },
};

function createDatabase(ctx) {

  const __db = {};

  const db = ctx.app.mysql.get('__db');
  const proto = Object.getPrototypeOf(Object.getPrototypeOf(db));
  Object.keys(proto).forEach(key => {
    Object.defineProperty(__db, key, {
      get() {
        if (is.function(db[key])) {
          return function() {
            const args = arguments;

            // check if promise
            if (db[key].name !== 'createPromise') {
              return db[key].apply(db, args);
            }

            // check if use transaction
            // ctx.dbMeta.transaction = true;
            if (!ctx.dbMeta.transaction) return db[key].apply(db, args);

            // use transaction
            if (!ctx.dbMeta.connection) {
              return new Promise(function(resolve, reject) {
                db.beginTransaction()
                  .then(conn => {
                    ctx.dbMeta.connection = conn;
                    const fn = ctx.dbMeta.connection[key].apply(ctx.dbMeta.connection, args);
                    if (!is.promise(fn)) {
                      resolve(fn);
                    } else {
                      fn.then(res => resolve(res)).catch(err => reject(err));
                    }
                  })
                  .catch(err => reject(err));
              });
            }
            // connection ready
            return ctx.dbMeta.connection[key].apply(ctx.dbMeta.connection, args);
          };
        }
        // property
        return db[key];
      },
    });
  });

  return __db;
}
