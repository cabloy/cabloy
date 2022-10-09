export default () => {
  const io = {
    // performAction
    _performActionCounter: 0,
    _performActionPromises: {},
    // performAction
    async performAction({ url, body }) {
      // socket
      const _socket = this._getSocket();
      if (!_socket.connected) {
        return new Error('socket is disconnected');
      }
      // emit message
      return new Promise((resolve, reject) => {
        const id = ++this._performActionCounter;
        this._performActionPromises[id] = { resolve, reject };
        _socket.emit('performAction', { id, url, body });
      });
    },
    _onMessagePerformActionCallback(data) {
      const { id, result } = data;
      const promise = this._performActionPromises[id];
      if (!promise) return;
      delete this._performActionPromises[id];
      const { resolve, reject } = promise;
      //
      if (result.code === 0) {
        resolve(result.data);
      } else {
        const error = new Error();
        error.code = result.code;
        error.message = result.message;
        reject(error);
      }
    },
    _clearPerformActionPromises() {
      for (const id in this._performActionPromises) {
        const promise = this._performActionPromises[id];
        promise.reject(new Error('socket is disconnected'));
      }
      this._performActionPromises = {};
    },
    _initialize() {
      this.registerOnDisconnect(() => {
        this._clearPerformActionPromises();
      });
      this._onMessagePerformActionCallbackBind = this._onMessagePerformActionCallback.bind(this);
      this.registerOnSocketCreate(socket => {
        socket.on('performAction-callback', this._onMessagePerformActionCallbackBind);
      });
      this.registerOnSocketDestroy(socket => {
        socket.off('performAction-callback', this._onMessagePerformActionCallbackBind);
      });
    },
  };
  return io;
};
