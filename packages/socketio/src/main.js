import io_performAction from './io_performAction.js';

export default adapter => {
  const io = {
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
      // socket
      const _socket = this._getSocket();
      if (!_socket.connected) {
        _socket.connect();
      }
      // record to All
      const subscribeId = ++this._subscribeCounter;
      this._subscribesAll[subscribeId] = {
        path,
        cbMessage,
        cbSubscribed,
        options,
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
        this.disconnect();
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
      adapter
        .subscribe({ subscribes, socketId: this._socket.id })
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
        .catch(err => {
          // done
          this._subscribesWaitingDoing = false;
          if (err.code === 401) {
            this._logout();
          } else {
            // timeout: not use window.
            this._subscribesWaitingTimeoutId = setTimeout(() => {
              this._subscribesWaitingTimeoutId = 0;
              this._doSubscribesWaiting();
            }, 2000);
          }
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
      adapter
        .unsubscribe({ subscribes })
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
        .catch(err => {
          // done
          this._unsubscribesWaitingDoing = false;
          if (err.code === 401) {
            this._logout();
          } else {
            // // timeout: not use window.
            this._unsubscribesWaitingTimeoutId = setTimeout(() => {
              this._unsubscribesWaitingTimeoutId = 0;
              this._doUnsubscribesWaiting();
            }, 2000);
          }
        });
    },
    _getSocket() {
      if (!this._socket) {
        this._socket = adapter.socket();
        this._socket.on('connect', this._onConnectBind);
        this._socket.on('disconnect', this._onDisconnectBind);
        this._socket.on('message', this._onMessageBind);
        this._socket.on('message-system', this._onMessageSystemBind);
        this._socket.on('performAction-callback', this._onMessagePerformActionCallbackBind);
      }
      return this._socket;
    },
    _logout() {
      // timeout: not use window.
      setTimeout(() => {
        this.disconnect();
        if (adapter.logout) {
          adapter.logout();
        }
      }, 0);
    },
    _onMessage(data) {
      const _itemPath = this._subscribesPath[data.path];
      if (!_itemPath) return;
      for (const subscribeId in _itemPath.items) {
        const _subscribe = this._subscribesAll[subscribeId];
        if (_subscribe && _subscribe.cbMessage) {
          _subscribe.cbMessage({ message: data.message });
        }
      }
    },
    _onMessageSystem(data) {
      if (data.code === 401) {
        this._onMessageSystem_401(data);
      }
    },
    _onMessageSystem_401(data) {
      const type = data.type;
      if (type === 'self' || type === 'all') {
        this._logout();
      } else if (type === 'provider') {
        const user = adapter.user();
        if (user) {
          if (user.op.anonymous) {
            this._logout();
          } else {
            const providerCurrent = user.provider;
            const providerMessage = data.provider;
            if (
              providerCurrent &&
              providerMessage &&
              providerCurrent.scene === providerMessage.scene &&
              providerCurrent.id === providerMessage.id
            ) {
              this._logout();
            }
          }
        }
      }
    },
    _onConnect() {
      this._subscribesWaiting = {};
      if (Object.keys(this._subscribesPath).length === 0) {
        this.disconnect();
      } else {
        // -> waitings
        for (const path in this._subscribesPath) {
          this._subscribesWaiting[path] = true;
        }
        this._doSubscribesWaiting();
      }
    },
    _onDisconnect(reason) {
      this._clearPerformActionPromises();
      this._subscribesWaiting = {};
      // reconnect
      if (reason === 'io server disconnect' || reason === 'transport close') {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.connect();
      }
    },
    connect() {
      if (this._socket) {
        this._socket.connect();
      }
    },
    disconnect() {
      if (this._socket) {
        this._socket.disconnect();
      }
    },
    reset() {
      this._unsubscribesWaiting = {};
      this._unsubscribesWaitingTimeoutId = 0;
      this._unsubscribesWaitingDoing = false;

      this._subscribesWaiting = {};
      this._subscribesWaitingTimeoutId = 0;
      this._subscribesWaitingDoing = false;

      this._subscribesAll = {};
      this._subscribesPath = {};

      this.disconnect();

      // should clear socket
      if (this._socket) {
        this._socket.off('connect', this._onConnectBind);
        this._socket.off('disconnect', this._onDisconnectBind);
        this._socket.off('message', this._onMessageBind);
        this._socket.off('message-system', this._onMessageSystemBind);
        this._socket.off('performAction-callback', this._onMessagePerformActionCallbackBind);
        this._socket = null;
      }

      const user = adapter.user();
      if (user && !user.op.anonymous) {
        this.subscribe('/a/socketio/messageSystem', ({ message }) => {
          this._onMessageSystem(JSON.parse(message.content));
        });
      }
    },
  };
  const _initializes = [];
  function mixin(ioProviderFn) {
    const ioProvider = ioProviderFn(adapter);
    if (ioProvider._initialize) {
      _initializes.push(ioProvider._initialize);
    }
    Object.assign(io, ioProvider);
  }
  mixin(io_performAction);
  for (const _initialize of _initializes) {
    _initialize.call(io);
  }
  // bind
  io._onConnectBind = io._onConnect.bind(io);
  io._onDisconnectBind = io._onDisconnect.bind(io);
  io._onMessageBind = io._onMessage.bind(io);
  io._onMessageSystemBind = io._onMessageSystem.bind(io);
  io._onMessagePerformActionCallbackBind = io._onMessagePerformActionCallback.bind(io);
  // initialize
  adapter.initialize(io);
  return io;
};
