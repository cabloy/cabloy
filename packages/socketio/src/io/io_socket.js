export default adapter => {
  const io = {
    // socket
    _socket: null,
    //
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
    _onConnect() {
      this.raiseOnConnect();
    },
    _onDisconnect(reason) {
      this.raiseOnDisconnect();
      // reconnect
      if (reason === 'io server disconnect' || reason === 'transport close') {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.connect();
      }
    },
    _getSocket() {
      if (!this._socket) {
        this._socket = adapter.socket();
        this.raiseOnSocketCreate(this._socket);
      }
      return this._socket;
    },
    _initialize() {
      this._onConnectBind = this._onConnect.bind(this);
      this._onDisconnectBind = this._onDisconnect.bind(this);
      this.registerOnSocketCreate(socket => {
        socket.on('connect', this._onConnectBind);
        socket.on('disconnect', this._onDisconnectBind);
      });
      this.registerOnSocketDestroy(socket => {
        socket.off('connect', this._onConnectBind);
        socket.off('disconnect', this._onDisconnectBind);
      });
    },
  };
  return io;
};
