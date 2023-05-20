import Vue from 'vue';
import helperFn from './helper.js';

let _simple = null;

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ ctx, action }) {
      if (action.name === 'initialize') return this._initialize({ ctx });
    },
    async _initialize({ ctx }) {
      if (_simple) return _simple;
      // io
      const useStoreSocketIO = await Vue.prototype.$meta.store.use('a/socketio/socketio');
      const _io = useStoreSocketIO.getInstance();
      const _helper = helperFn(_io);
      _simple = _helper.simple();
      // auth:login
      Vue.prototype.$meta.eventHub.$on('auth:login', () => {
        _simple.reset();
        _simple.subscribe();
      });
      // subscribe
      _simple.subscribe();
      // ok
      return _simple;
    },
  },
};
