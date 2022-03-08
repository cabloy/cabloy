module.exports = class DbTransaction {
  constructor(ctx) {
    this._ctx = ctx;
    this._transactionCounter = 0;
    this._connection = null;
  }
  get inTransaction() {
    return this._transactionCounter > 0;
  }
  get connection() {
    return this._connection;
  }
  set connection(value) {
    this._connection = value;
  }
  async begin(fn) {
    let res;
    const db = this._ctx.meta.util.getDbOriginal();
    try {
      if (++this._transactionCounter === 1) {
        this._connection = await db.beginTransaction();
      }
    } catch (err) {
      this._transactionCounter--;
      throw err;
    }
    try {
      res = await fn();
    } catch (err) {
      if (--this._transactionCounter === 0) {
        await this._connection.rollback();
        this._connection = null;
      }
      throw err;
    }
    try {
      if (--this._transactionCounter === 0) {
        await this._connection.commit();
        this._connection = null;
      }
    } catch (err) {
      await this._connection.rollback();
      this._connection = null;
      throw err;
    }
    return res;
  }
};
