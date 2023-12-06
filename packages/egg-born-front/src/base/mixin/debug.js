import DebugInstance from 'debug';

const __debug_caches = {};

export default function (Vue) {
  // log
  DebugInstance.log = console.log || (() => {});

  // debug
  const debug = {
    instance: DebugInstance,
    get(namespace) {
      if (!__debug_caches[namespace]) {
        __debug_caches[namespace] = DebugInstance(namespace);
      }
      return __debug_caches[namespace];
    },
  };

  // enable
  if (process.env.NODE_ENV === 'development') {
    DebugInstance.enable(process.env.DEBUG);
  }

  // $debug
  Vue.prototype.$debug = debug;

  return { debug, beforeCreate: null };
}
