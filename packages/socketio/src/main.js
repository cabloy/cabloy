import io_main from './io_main.js';
import io_socket from './io_socket.js';
import io_message from './io_message.js';
import io_messageSystem from './io_messageSystem.js';
import io_performAction from './io_performAction.js';
import io_test from './io_test.js';

export default adapter => {
  const io = {
    _doUnsubscribesWaiting() {
      if (this._unsubscribesWaitingDoing) return;
      if (this._unsubscribesWaitingTimeoutId !== 0) return;
      if (Object.keys(this._unsubscribesWaiting).length === 0) return;
      // combine
      const subscribes = [];
      for (const path in this._unsubscribesWaiting) {
        const _itemPath = this._subscribesPath[path];
        if (_itemPath) {
          // delete waiting
          delete this._unsubscribesWaiting[path];
        } else {
          const _item = this._unsubscribesWaiting[path];
          subscribes.push({ path, scene: _item.scene, socketId: _item.socketId });
        }
      }
      // unsubscribe
      this._unsubscribesWaitingDoing = true;
      adapter
        .unsubscribe({ subscribes })
        .then(() => {
          // loop
          for (const _item of subscribes) {
            // delete waiting
            delete this._unsubscribesWaiting[_item.path];
          }
          // done
          this._unsubscribesWaitingDoing = false;
          // next
          this._doUnsubscribesWaiting();
        })
        .catch(err => {
          // done
          this._unsubscribesWaitingDoing = false;
          if (err.code === 401) {
            this._logout();
          } else {
            // // timeout: not use window.
            this._unsubscribesWaitingTimeoutId = setTimeout(() => {
              this._unsubscribesWaitingTimeoutId = 0;
              this._doUnsubscribesWaiting();
            }, 2000);
          }
        });
    },
    _logout() {
      // timeout: not use window.
      setTimeout(() => {
        this.disconnect();
        if (adapter.logout) {
          adapter.logout();
        }
      }, 0);
    },
    reset() {
      this._unsubscribesWaiting = {};
      this._unsubscribesWaitingTimeoutId = 0;
      this._unsubscribesWaitingDoing = false;

      this._subscribesWaiting = {};
      this._subscribesWaitingTimeoutId = 0;
      this._subscribesWaitingDoing = false;

      this._subscribesAll = {};
      this._subscribesPath = {};

      this.disconnect();

      // should clear socket
      if (this._socket) {
        this.raiseOnSocketDestroy(this._socket);
        this._socket = null;
      }

      const user = adapter.user();
      if (user && !user.op.anonymous) {
        this.subscribe('/a/socketio/messageSystem', ({ message }) => {
          this._onMessageSystem(JSON.parse(message.content));
        });
      }
    },
  };
  // mixins
  const _initializes = [];
  function mixin(ioProviderFn) {
    const ioProvider = ioProviderFn(adapter);
    if (ioProvider._initialize) {
      _initializes.push(ioProvider._initialize);
    }
    Object.assign(io, ioProvider);
  }
  mixin(io_main);
  mixin(io_socket);
  mixin(io_message);
  mixin(io_messageSystem);
  mixin(io_performAction);
  mixin(io_test);
  // initialize providers
  for (const _initialize of _initializes) {
    _initialize.call(io);
  }
  // initialize adapter
  adapter.initialize(io);
  return io;
};
