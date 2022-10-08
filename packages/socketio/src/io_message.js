export default adapter => {
  const io = {
    // subscribes
    _subscribeCounter: 0,
    _subscribesAll: {},
    _subscribesPath: {},
    // methods
    subscribe(path, cbMessage, cbSubscribed, options) {
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
        _itemPath = this._subscribesPath[path] = {
          subscribed: false,
          timestamp: Date.now(),
          items: {},
        };
        _newPathSubscribe = true;
      }
      _itemPath.items[subscribeId] = true;
      // just return subscribeId when disconnected
      if (!_socket.connected) return subscribeId;
      // connected
      if (_newPathSubscribe) {
        this._doSubscribePath(path);
      } else {
        if (_itemPath.subscribed) {
          // invoke cbSubscribed directly
          if (cbSubscribed) {
            setTimeout(() => {
              cbSubscribed({ subscribeId, path, options });
            }, 0);
          }
        }
      }
      // ok
      return subscribeId;
    },
    unsubscribe(subscribeId) {
      const _item = this._subscribesAll[subscribeId];
      if (!_item) return;

      let _newPathUnsubscribe = false;
      const _itemPath = this._subscribesPath[_item.path];
      if (_itemPath) {
        delete _itemPath.items[subscribeId];
        if (Object.keys(_itemPath.items).length === 0) {
          delete this._subscribesPath[_item.path];
          _newPathUnsubscribe = true;
        }
      }

      delete this._subscribesAll[subscribeId];
      if (Object.keys(this._subscribesAll).length === 0) {
        this.disconnect();
        return; // just return because will be disconnected
      }

      // just return when disconnected
      const _socket = this._getSocket();
      if (!_socket.connected) return;

      if (_newPathUnsubscribe) {
        // force unsubscribe no matter whether _itemPath.subscribed
        this._doUnsubscribePath(_item.path);
      }
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
    _doSubscribePath(path) {
      // check
      const _socket = this._getSocket();
      if (!_socket.connected) return;
      const _itemPath = this._subscribesPath[path];
      if (!_itemPath) return;
      // subscribe
      this.performAction({
        url: 'a/socketio/subscribe',
        body: {
          path,
          timestamp: _itemPath.timestamp,
        },
      })
        .then(() => {
          _itemPath.subscribed = true;
          for (const subscribeId in _itemPath.items) {
            const _subscribe = this._subscribesAll[subscribeId];
            if (_subscribe && _subscribe.cbSubscribed) {
              _subscribe.cbSubscribed({ subscribeId, path, options: _subscribe.options });
            }
          }
        })
        .catch(() => {
          // do nothing
          // not check 401
        });
    },
    _initialize() {
      // OnConnect
      this.registerOnConnect(() => {
        // subscribe again
        for (const path in this._subscribesPath) {
          this._doSubscribePath(path);
        }
      });
      // onDisconnect
      this.registerOnDisconnect(() => {
        // reset all paths
        for (const path in this._subscribesPath) {
          const _itemPath = this._subscribesPath[path];
          _itemPath.subscribed = false;
        }
      });
      // message
      this._onMessageBind = this._onMessage.bind(this);
      this.registerOnSocketCreate(socket => {
        socket.on('message', this._onMessageBind);
      });
      this.registerOnSocketDestroy(socket => {
        socket.off('message', this._onMessageBind);
      });
    },
  };
  return io;
};
