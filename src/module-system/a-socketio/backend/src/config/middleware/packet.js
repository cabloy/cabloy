module.exports = (options, app) => {
  console.log('----- packet app.name', app.name);
  return async (ctx, next) => {
    ctx.socket.emit('res', 'packet received!');
    console.log('packet:', ctx.packet);
    await next();
  };
};
