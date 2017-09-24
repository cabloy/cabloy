/*
* @Author: zhennann
* @Date:   2017-09-23 23:21:35
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-24 17:48:57
*/

import Vuex from 'vuex';
import util from './util.js';

export default function(Vue, _store) {
  // install vuex
  Vue.use(Vuex);

  // store
  const store = new Vuex.Store(_store || {});

  // register module: auth
  const auth = require('./auth.js').default(Vue);
  auth.namespaced = true;
  store.registerModule('auth', auth);

  // mixin
  Vue.mixin({ beforeCreate() {

    const self = this;
    this.$local = {};

    Object.defineProperty(this.$local, 'state', {
      get() {
        const moduleInfo = util.getModuleInfo(self);
        return self.$store.state[moduleInfo.pid][moduleInfo.name];
      },
    });

    Object.defineProperty(this.$local, 'getters', {
      get() {
        return function() {
          const moduleInfo = util.getModuleInfo(self);
          return self.$store.getters[`${moduleInfo.pid}/${moduleInfo.name}/${arguments[0]}`];
        };
      },
    });

    [ 'commit', 'dispatch' ].forEach(key => {
      util.overrideProperty({
        obj: this.$local,
        key,
        objBase: this.$store,
        vueComponent: this,
        combilePath: (moduleInfo, arg) => {
          return `${moduleInfo.pid}/${moduleInfo.name}/${arg}`;
        },
      });
    });

  } });

  return store;
}

