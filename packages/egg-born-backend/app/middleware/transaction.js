module.exports = () => {
  return async function transaction(ctx, next) {

    // set flag
    ctx.dbMeta.transaction = true;

    try {
      // next
      await next();

      // check if success
      if (checkIfSucess(ctx)) {
        await handleTransaction(ctx, true);
      } else {
        await handleTransaction(ctx, false);
      }
    } catch (err) {
      await handleTransaction(ctx, false);
      throw err;
    }

  };
};

function checkIfSucess(ctx) {
  if (typeof ctx.response.body === 'object' && ctx.response.body && ctx.response.body.code !== undefined) {
    return ctx.response.body.code === 0;
  }
  return ctx.response.status === 200;
}

async function handleTransaction(ctx, success) {
  if (!ctx.dbMeta.master) return;
  if (ctx.dbMeta.connection.conn) {
    const tran = ctx.dbMeta.connection.conn;
    ctx.dbMeta.connection.conn = null;
    if (success) {
      // commit
      await tran.commit();
    } else {
      // rollback
      await tran.rollback();
    }
  }
  // reset flag, only for master
  ctx.dbMeta.transaction = false;
}
