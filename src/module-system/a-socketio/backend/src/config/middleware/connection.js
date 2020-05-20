module.exports = app => {
  console.log('----- connection app.name', app.name);
  return async (ctx, next) => {

    ctx.socket.emit('res', 'connected!');
    await next();
    // execute when disconnect.
    console.log('disconnection!');
  };
};
