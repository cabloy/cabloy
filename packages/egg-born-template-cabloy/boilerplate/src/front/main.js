import Framework7 from '@zhennann/framework7/dist/framework7.esm.bundle.js';
import Framework7Vue from '@zhennann/framework7-vue/dist/framework7-vue.esm.bundle.js';

import '@zhennann/framework7/dist/css/framework7.md.css';
import './assets/css/app.css';

import config from './config/config.js';
import locales from './config/locales.js';

let Vue;

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // use
  Vue.use(Framework7Vue, Framework7);
  Vue.prototype.$Framework7 = Framework7;

  // options
  return cb({
    config,
    locales,
    parameters: {
      framework7: {
        name: '{{name}}',
      },
    },
    meta: {
      layout: {
        breakpoint: 768,
        items: {
          mobile: {
            module: 'a-layoutmobile',
            component: 'layout',
          },
        },
      },
    },
  });
}

// export
export default {
  install,
};
