const ioc = require('socket.io-client');

module.exports = options => {
  const { openAuth } = options;
  return {
    _io: null,
    initialize(io) {
      this._io = io;
      // reset
      this._io.reset();
    },
    subscribe({ subscribes, socketId }) {
      return openAuth.post({
        path: '/a/socketio/subscribe',
        body: {
          subscribes,
          socketId,
        },
      });
    },
    unsubscribe({ subscribes }) {
      return openAuth.post({
        path: '/a/socketio/unsubscribe',
        body: {
          subscribes,
        },
      });
    },
    socket() {
      // url
      const url = openAuth.host;
      // opts
      const opts = {
        autoConnect: false,
        withCredentials: true,
        transports: ['websocket'],
      };
      // scene
      opts.query = {};
      // jwt
      opts.query['eb-jwt'] = openAuth.jwt.accessToken;
      return ioc(url, opts);
    },
    user() {
      return null;
    },
    logout() {
      // do nothing
    },
  };
};
