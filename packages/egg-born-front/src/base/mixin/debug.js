import DebugInstance from 'debug';

export default function (Vue) {
  // store
  const debug = {
    instance: DebugInstance,
    get(namespace) {},
  };

  Vue.prototype.$debug = debug;

  return { debug, beforeCreate: null };
}
