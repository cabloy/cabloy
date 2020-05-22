module.exports = (options, app) => {
  console.log('----- test app.name', app.name);
  return async (ctx, next) => {

    ctx.socket.emit('res', 'connected!');
    await next();
    // execute when disconnect.
    console.log('disconnection 2!');
  };
};
