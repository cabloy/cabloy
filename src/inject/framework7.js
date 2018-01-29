import extend from 'extend2';
import util from '../base/util.js';
import fns from '../base/fns.js';
import mparse from 'egg-born-mparse';

export default function(Vue, meta, options) {
  return extend(true, options, {
    el: '#app',
    render: c => c('app'),
    store: meta.store,
    routes: [],
    framework7: {
      theme: 'md',
    },
  });
}

