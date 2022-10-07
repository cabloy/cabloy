export default () => {
  const io = {
    _onConnectCallbacks: [],
    _onDisconnectCallbacks: [],
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
  };
  return io;
};
