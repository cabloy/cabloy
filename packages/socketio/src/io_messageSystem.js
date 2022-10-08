export default adapter => {
  const io = {
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
    _initialize() {
      this._onMessageSystemBind = this._onMessageSystem.bind(this);
      this.registerOnSocketCreate(socket => {
        socket.on('message-system', this._onMessageSystemBind);
      });
      this.registerOnSocketDestroy(socket => {
        socket.off('message-system', this._onMessageSystemBind);
      });
    },
  };
  return io;
};
