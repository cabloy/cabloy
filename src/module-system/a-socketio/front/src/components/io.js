import io from 'socket.io-client';

let _socket = null;

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      if (action.name === 'socket') return this._getSocket();
    },
    _getSocket() {
      if (!_socket) {
        const url = this.$meta.config.api.baseURL || location.origin;
        _socket = io(url);
      }
      return _socket;
    },
  },
};
