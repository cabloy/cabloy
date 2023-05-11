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
    const useStore = __stores[path];
    return useStore();
  };

  // get sync
  pinia.getSync = function (path) {
    const useStore = __stores[path];
    return useStore();
  };

  // set
  pinia.set = function (path, store) {
    __stores[path] = store;
  };

  // beforeCreate
  const beforeCreate = function (ctx) {
    // local
    if (!ctx.$local) ctx.$local = {};

    ['get', 'getSync'].forEach(key => {
      Vue.prototype.$meta.util.overrideProperty({
        obj: ctx.$local,
        key,
        objBase: pinia,
        vueComponent: ctx,
        combinePath: (moduleInfo, arg) => {
          return Vue.prototype.$meta.util.combineStorePath(moduleInfo, arg);
        },
      });
    });
  };

  return { pinia, beforeCreate };
}
