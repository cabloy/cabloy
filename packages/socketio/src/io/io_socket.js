export default adapter => {
  const io = {
    // socket
    _socket: null,
    //
    connect() {
      const _socket = this._getSocket();
      if (!_socket.connected) {
        _socket.connect();
      }
    },
    disconnect() {
      const _socket = this._socket;
      if (!_socket) return;
      if (_socket.connected) {
        _socket.disconnect();
      } else {
        this.destroySocket();
      }
    },
    destroySocket() {
      if (this._socket) {
        this.raiseOnSocketDestroy(this._socket);
        this._socket = null;
      }
    },
    _onConnect() {
      this.raiseOnConnect();
    },
    _onDisconnect(reason) {
      this.raiseOnDisconnect();
      // for create new socket
      this.destroySocket();
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
