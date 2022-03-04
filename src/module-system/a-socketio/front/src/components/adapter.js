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
    // auth:login
    Vue.prototype.$meta.eventHub.$on('auth:login', () => {
      // reset
      this._io.reset();
    });
    // visibilitychange
    Vue.prototype.$meta.util.visibilityChange.$on('visibilityChange', visibilityState => {
      if (visibilityState) {
        this._io.connect();
      } else {
        this._io.disconnect();
      }
    });
  },
  subscribe({ subscribes, socketId }) {
    return Vue.prototype.$meta.api.post('/a/socketio/subscribe', { subscribes, socketId });
  },
  unsubscribe({ subscribes }) {
    return Vue.prototype.$meta.api.post('/a/socketio/unsubscribe', { subscribes });
  },
  socket() {
    // url
    const url = Vue.prototype.$meta.config.api.baseURL || location.origin;
    // opts
    const opts = {
      autoConnect: false,
    };
    // scene
    opts.query = {
      'x-scene': Vue.prototype.$meta.config.scene,
    };
    // clientId
    const clientId = Vue.prototype.$meta.store.state.auth.clientId;
    if (clientId) {
      opts.query['x-clientid'] = clientId;
    }
    // jwt
    if (Vue.prototype.$meta.config.base.jwt) {
      opts.query['eb-jwt'] = window.localStorage['eb-jwt'] || '';
    }
    return ioc(url, opts);
  },
};
