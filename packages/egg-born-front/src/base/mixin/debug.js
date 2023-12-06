import DebugInstance from 'debug';

export default function (Vue) {
  // store
  const debug = {
    instance: DebugInstance,
    get(namespace) {},
  };

  // enable
  if (process.env.NODE_ENV === 'development') {
    DebugInstance.enable(process.env.DEBUG);
  }

  // $debug
  Vue.prototype.$debug = debug;

  return { debug, beforeCreate: null };
}
