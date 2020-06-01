import Vue from 'vue';

let ioc;
if (process.env.NODE_ENV === 'production') {
  ioc = require('socket.io-client/dist/socket.io.js');
} else {
  ioc = require('socket.io-client');
}

export default {
  _io: null,
  initialize(io) {
    this._io = io;
    Vue.prototype.$meta.eventHub.$on('auth:login', () => {
      // reset
      this._io.reset();
    });
  },
  subscribe({ subscribes, socketId }) {
    return Vue.prototype.$meta.api.post('/a/socketio/subscribe', { subscribes, socketId });
  },
  unsubscribe({ subscribes }) {
    return Vue.prototype.$meta.api.post('/a/socketio/unsubscribe', { subscribes });
  },
  socket() {
    const url = Vue.prototype.$meta.config.api.baseURL || location.origin;
    return ioc(url, { autoConnect: false });
  },

};
