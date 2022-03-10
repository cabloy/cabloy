const require3 = require('require3');
const debug = require3('debug')('io');

const SOCKETSONLINE = Symbol.for('APP#__SOCKETSONLINE');
module.exports = app => {
  class Broadcast extends app.meta.BeanBase {
    async execute(context) {
      const data = context.data;
      const socketsOnline = app[SOCKETSONLINE];
      const socket = socketsOnline && socketsOnline[data.socketId];
      debug('socketEmit broadcast: found:%d, workerId:%s, socketId:%s', !!socket, app.meta.workerId, data.socketId);
      if (socket) {
        socket.emit('message', {
          path: data.path,
          message: data.message,
        });
      }
    }
  }

  return Broadcast;
};
