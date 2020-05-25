import ioc from 'socket.io-client';
import Vue from 'vue';

const _io = {
  // socket
  _socket: null,
  // subscribes
  _subscribeCounter: 0,
  _subscribesAll: {},
  _subscribesPath: {},
  // subscribes waiting
  _subscribesWaitingTimeoutId: 0,
  _subscribesWaitingDoing: false,
  _subscribesWaiting: {},
  // unsubscribes waiting
  _unsubscribesWaitingTimeoutId: 0,
  _unsubscribesWaitingDoing: false,
  _unsubscribesWaiting: {},
  // methods
  subscribe(path, cbMessage, cbSubscribed, options) {
    // options
    options = options || {};
    if (options.scene === true) {
      options.scene = Vue.prototype.$meta.config.scene;
    }
    // socket
    const _socket = this._getSocket();
    if (!_socket.connected) {
      _socket.connect();
    }
    // record to All
    const subscribeId = ++this._subscribeCounter;
    this._subscribesAll[subscribeId] = {
      path, cbMessage, cbSubscribed, options,
    };
    // record to path
    let _itemPath = this._subscribesPath[path];
    let _newPathSubscribe = false;
    if (!_itemPath) {
      _itemPath = this._subscribesPath[path] = { scene: options.scene, items: {} };
      _newPathSubscribe = true;
      // delete waiting
      delete this._unsubscribesWaiting[path];
    }
    _itemPath.items[subscribeId] = true;

    // check waitings
    if (_socket.connected) {
      if (_newPathSubscribe) {
        this._subscribesWaiting[path] = true;
        this._doSubscribesWaiting();
      } else {
        if (!this._subscribesWaiting[path]) {
          // invoke cbSubscribed directly
          if (cbSubscribed) {
            cbSubscribed();
          }
        }
      }
    }

    // ok
    return subscribeId;
  },
  unsubscribe(subscribeId) {
    const _item = this._subscribesAll[subscribeId];
    if (!_item) return;

    const _itemPath = this._subscribesPath[_item.path];
    if (_itemPath) {
      delete _itemPath.items[subscribeId];
      if (Object.keys(_itemPath.items).length === 0) {
        // delete path
        delete this._subscribesPath[_item.path];
        // delete waiting
        delete this._subscribesWaiting[_item.path];
        // unsubscribe
        if (_itemPath.socketId) {
          this._unsubscribesWaiting[_item.path] = { scene: _itemPath.scene, socketId: _itemPath.socketId };
          this._doUnsubscribesWaiting();
        }
      }
    }

    delete this._subscribesAll[subscribeId];

    if (Object.keys(this._subscribesAll).length === 0) {
      const _socket = this._getSocket();
      if (_socket.connected) {
        _socket.disconnect();
      }
    }
  },
  _doSubscribesWaiting() {
    if (this._subscribesWaitingDoing) return;
    if (this._subscribesWaitingTimeoutId !== 0) return;
    if (Object.keys(this._subscribesWaiting).length === 0) return;
    if (!this._socket.connected) return;
    // combine
    const subscribes = [];
    for (const path in this._subscribesWaiting) {
      const _itemPath = this._subscribesPath[path];
      if (_itemPath) {
        subscribes.push({ path, scene: _itemPath.scene });
      }
    }
    // subscribe
    this._subscribesWaitingDoing = true;
    Vue.prototype.$meta.api.post('/a/socketio/subscribe', { subscribes, socketId: this._socket.id })
      .then(() => {
        // loop
        for (const _item of subscribes) {
          // delete waiting
          delete this._subscribesWaiting[_item.path];
          // cbSubscribed
          const _itemPath = this._subscribesPath[_item.path];
          if (_itemPath) {
            _itemPath.socketId = this._socket.id;
            for (const subscribeId in _itemPath.items) {
              const _subscribe = this._subscribesAll[subscribeId];
              if (_subscribe && _subscribe.cbSubscribed) {
                _subscribe.cbSubscribed();
              }
            }
          }
        }
        // done
        this._subscribesWaitingDoing = false;
        // next
        this._doSubscribesWaiting();
      })
      .catch(() => {
        // done
        this._subscribesWaitingDoing = false;
        // timeout
        this._subscribesWaitingTimeoutId = window.setTimeout(() => {
          this._subscribesWaitingTimeoutId = 0;
          this._doSubscribesWaiting();
        }, 2000);
      });
  },
  _doUnsubscribesWaiting() {
    if (this._unsubscribesWaitingDoing) return;
    if (this._unsubscribesWaitingTimeoutId !== 0) return;
    if (Object.keys(this._unsubscribesWaiting).length === 0) return;
    // combine
    const subscribes = [];
    for (const path in this._unsubscribesWaiting) {
      const _itemPath = this._subscribesPath[path];
      if (_itemPath) {
        // delete waiting
        delete this._unsubscribesWaiting[path];
      } else {
        const _item = this._unsubscribesWaiting[path];
        subscribes.push({ path, scene: _item.scene, socketId: _item.socketId });
      }
    }
    // unsubscribe
    this._unsubscribesWaitingDoing = true;
    Vue.prototype.$meta.api.post('/a/socketio/unsubscribe', { subscribes })
      .then(() => {
        // loop
        for (const _item of subscribes) {
          // delete waiting
          delete this._unsubscribesWaiting[_item.path];
        }
        // done
        this._unsubscribesWaitingDoing = false;
        // next
        this._doUnsubscribesWaiting();
      })
      .catch(() => {
        // done
        this._unsubscribesWaitingDoing = false;
        // timeout
        this._unsubscribesWaitingTimeoutId = window.setTimeout(() => {
          this._unsubscribesWaitingTimeoutId = 0;
          this._doUnsubscribesWaiting();
        }, 2000);
      });
  },
  _getSocket() {
    if (!this._socket) {
      const url = Vue.prototype.$meta.config.api.baseURL || location.origin;
      this._socket = ioc(url, { autoConnect: false });
      this._socket.on('connect', this._onConnect.bind(this));
      this._socket.on('disconnect', this._onDisconnect.bind(this));
    }
    return this._socket;
  },
  _onConnect() {
    // -> waitings
    this._subscribesWaiting = {};
    for (const path in this._subscribesPath) {
      this._subscribesWaiting[path] = true;
    }
    this._doSubscribesWaiting();
  },
  _onDisconnect(reason) {
    this._subscribesWaiting = {};
    // reconnect
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      this._socket.connect();
    }
  },
  _reset() {
    this._unsubscribesWaiting = {};
    this._subscribesWaiting = {};
    this._subscribesAll = {};
    this._subscribesPath = {};
    if (this._socket && this._socket.connected) {
      this._socket.disconnect();
    }
  },
};

Vue.prototype.$meta.eventHub.$on('auth:login', () => {
  // reset
  _io._reset();
});

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      if (action.name === 'instance') return this._getInstance();
    },
    _getInstance() {
      return _io;
    },
  },
};
