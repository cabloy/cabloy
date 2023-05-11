import { createPinia, PiniaVuePlugin, defineStore } from 'pinia';

export default function (Vue) {
  // install pinia
  Vue.use(PiniaVuePlugin);

  // stores
  const __stores = {};

  // pinia
  const pinia = new createPinia();

  // defineStore
  pinia.defineStore = defineStore;

  // get async
  pinia.get = async function (path) {
    const info = Vue.prototype.$meta.util.parseModuleInfo(path);
    await Vue.prototype.$meta.module.use(info.relativeName);
    return __stores[path];
  };

  // get sync
  pinia.getSync = async function (path) {
    return __stores[path];
  };

  // set
  pinia.set = function (path, store) {
    __stores[path] = store;
  };

  return { pinia, beforeCreate: null };

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

  return { pinia, beforeCreate };
}
