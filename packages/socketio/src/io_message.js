export default adapter => {
  const io = {
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
    _initialize() {
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
