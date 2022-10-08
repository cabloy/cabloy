export default () => {
  const io = {
    _onConnectCallbacks: [],
    _onDisconnectCallbacks: [],
    _onSocketCreateCallbacks: [],
    _onSocketDestroyCallbacks: [],
    _onResetCallbacks: [],
    registerOnConnect(callback) {
      this._onConnectCallbacks.push(callback);
    },
    raiseOnConnect() {
      for (const callback of this._onConnectCallbacks) {
        callback.call(this);
      }
    },
    registerOnDisconnect(callback) {
      this._onDisconnectCallbacks.push(callback);
    },
    raiseOnDisconnect() {
      for (const callback of this._onDisconnectCallbacks) {
        callback.call(this);
      }
    },
    registerOnSocketCreate(callback) {
      this._onSocketCreateCallbacks.push(callback);
    },
    raiseOnSocketCreate(socket) {
      for (const callback of this._onSocketCreateCallbacks) {
        callback.call(this, socket);
      }
    },
    registerOnSocketDestroy(callback) {
      this._onSocketDestroyCallbacks.push(callback);
    },
    raiseOnSocketDestroy(socket) {
      for (const callback of this._onSocketDestroyCallbacks) {
        callback.call(this, socket);
      }
    },
    registerOnReset(callback) {
      this._onResetCallbacks.push(callback);
    },
    raiseOnReset() {
      for (const callback of this._onResetCallbacks) {
        callback.call(this);
      }
    },
  };
  return io;
};
