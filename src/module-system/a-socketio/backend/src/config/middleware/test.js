module.exports = app => {
  console.log('----- test app.name', app);
  return async (ctx, next) => {

    ctx.socket.emit('res', 'connected!');
    await next();
    // execute when disconnect.
    console.log('disconnection!');
  };
};
