import io_main from './io_main.js';
import io_socket from './io_socket.js';
import io_message from './io_message.js';
import io_messageSystem from './io_messageSystem.js';
import io_performAction from './io_performAction.js';
import io_test from './io_test.js';

export default adapter => {
  const io = {};
  const _initializes = [];
  function mixin(ioProviderFn) {
    const ioProvider = ioProviderFn(adapter);
    if (ioProvider._initialize) {
      _initializes.push(ioProvider._initialize);
    }
    Object.assign(io, ioProvider);
  }
  // mixins
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
