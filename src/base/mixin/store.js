import Vuex from 'vuex';

export default function(Vue) {
  // install vuex
  Vue.use(Vuex);

  // store
  const store = new Vuex.Store({});

  // register module: auth
  const auth = require('../auth.js').default(Vue);
  auth.namespaced = true;
  store.registerModule('auth', auth);

  // beforeCreate
  const beforeCreate = function(ctx) {
    // local
    ctx.$local = {};

    Object.defineProperty(ctx.$local, 'state', {
      get() {
        const moduleInfo = ctx.$module.info;
        return ctx.$store.state[moduleInfo.pid][moduleInfo.name];
      },
    });

    Object.defineProperty(ctx.$local, 'getters', {
      get() {
        return function() {
          const moduleInfo = ctx.$module.info;
          return ctx.$store.getters[`${moduleInfo.pid}/${moduleInfo.name}/${arguments[0]}`];
        };
      },
    });

    [ 'commit', 'dispatch' ].forEach(key => {
      Vue.prototype.$meta.util.overrideProperty({
        obj: ctx.$local,
        key,
        objBase: ctx.$store,
        vueComponent: ctx,
        combinePath: (moduleInfo, arg) => {
          return Vue.prototype.$meta.util.combineStorePath(moduleInfo, arg);
        },
      });
    });
  };

  return { store, beforeCreate };
}
