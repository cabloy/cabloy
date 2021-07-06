const SOCKETSONLINE = Symbol.for('APP#__SOCKETSONLINE');
module.exports = app => {
  class Broadcast extends app.meta.BeanBase {
    async execute(context) {
      const data = context.data;
      if (app.meta.workerId === data.workerId) {
        const socketsOnline = app[SOCKETSONLINE];
        const socket = socketsOnline && socketsOnline[data.socketId];
        if (socket) {
          socket.emit('message', {
            path: data.path,
            message: data.message,
          });
        }
      }
    }
  }

  return Broadcast;
};
