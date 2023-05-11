import { PiniaVuePlugin } from 'pinia';

export default function (Vue) {
  // install pinia
  Vue.use(PiniaVuePlugin);

  return { store: null, beforeCreate: null };

  // store
  const store = new Vuex.Store({});

  // get state
  store.getState = function (path) {
    const keys = path.split('/');
    let value = store.state;
    for (const key of keys) {
      if (!value) break;
      value = value[key];
    }
    return value;
  };

  // dispatch
  const _dispatch = store.dispatch;
  store.dispatch = async function (path, ...args) {
    if (path.indexOf('auth/') === 0) return await _dispatch.call(store, path, ...args);
    const info = Vue.prototype.$meta.util.parseModuleInfo(path);
    await Vue.prototype.$meta.module.use(info.relativeName);
    return await _dispatch.call(store, path, ...args);
  };

  // register module: auth
  const auth = require('../auth.js').default(Vue);
  auth.namespaced = true;
  store.registerModule('auth', auth);

  // beforeCreate
  const beforeCreate = function (ctx) {
    // local
    ctx.$local = {};

    Object.defineProperty(ctx.$local, 'state', {
      get() {
        const moduleInfo = ctx.$module.info;
        return store.state[moduleInfo.pid][moduleInfo.name];
      },
    });

    Object.defineProperty(ctx.$local, 'getters', {
      get() {
        return function () {
          const moduleInfo = ctx.$module.info;
          return store.getters[`${moduleInfo.pid}/${moduleInfo.name}/${arguments[0]}`];
        };
      },
    });

    ['commit', 'dispatch'].forEach(key => {
      Vue.prototype.$meta.util.overrideProperty({
        obj: ctx.$local,
        key,
        objBase: store,
        vueComponent: ctx,
        combinePath: (moduleInfo, arg) => {
          return Vue.prototype.$meta.util.combineStorePath(moduleInfo, arg);
        },
      });
    });
  };

  return { store, beforeCreate };
}
