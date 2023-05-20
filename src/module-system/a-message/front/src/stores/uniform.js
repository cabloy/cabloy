import Vue from 'vue';
import helperFn from './helper.js';

export default {
  state() {
    return {
      simple: null,
    };
  },
  actions: {
    async getSimple() {
      if (this.simple) return this.simple;
      // io
      const useStoreSocketIO = await Vue.prototype.$meta.store.use('a/socketio/socketio');
      const _io = useStoreSocketIO.getInstance();
      const _helper = helperFn(_io);
      this.simple = _helper.simple();
      // auth:login
      Vue.prototype.$meta.eventHub.$on('auth:login', () => {
        this.simple.reset();
        this.simple.subscribe();
      });
      // subscribe
      this.simple.subscribe();
      // ok
      return this.simple;
    },
    async initialize() {
      await this.getSimple();
    },
  },
};
