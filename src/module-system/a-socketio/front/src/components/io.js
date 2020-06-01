import adapter from './adapter.js';

let IOFn;
if (process.env.NODE_ENV === 'production') {
  IOFn = require('@zhennann/socketio');
} else {
  IOFn = require('@zhennann/socketio/src/main.js').default;
}

let _io = null;

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      if (action.name === 'instance') return this._getInstance();
    },
    _getInstance() {
      if (!_io) {
        _io = IOFn(adapter);
      }
      return _io;
    },
  },
};
