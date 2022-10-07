export default () => {
  const io = {
    _onConnectCallbacks: [],
    registerOnConnect(callback) {
      this._onConnectCallbacks.push(callback);
    },
    raiseOnConnect() {
      for (const callback of this._onConnectCallbacks) {
        callback.call(this);
      }
    },
  };
  return io;
};
