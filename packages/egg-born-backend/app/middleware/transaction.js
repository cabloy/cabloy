module.exports = () => {
  return function* transaction(next) {

    // set flag
    this.dbMeta.transaction = true;

    try {
      // next
      yield next;

      // check if success
      if (this.response.body && this.response.body.code !== 0) { yield handleTransaction(this, false); } else { yield handleTransaction(this, true); }
    } catch (err) {
      yield handleTransaction(this, false);
      throw err;
    }

  };
};

function* handleTransaction(ctx, success) {
  if (ctx.dbMeta.master && ctx.dbMeta.connection.conn) {
    const tran = ctx.dbMeta.connection.conn;
    ctx.dbMeta.connection.conn = null;
    if (success) { yield tran.commit(); } else { yield tran.rollback(); }
  }
}
