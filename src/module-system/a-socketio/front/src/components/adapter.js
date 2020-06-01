import ioc from 'socket.io-client';
import Vue from 'vue';

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
