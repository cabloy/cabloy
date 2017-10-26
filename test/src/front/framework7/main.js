import axios from 'axios';

// eslint-disable-next-line
import Framework7 from 'framework7/dist/js/framework7.js';
import Framework7Vue from 'framework7-vue/dist/framework7-vue.js';

// eslint-disable-next-line
import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css';
// eslint-disable-next-line
import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css';
/* OR for Material Theme:
import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'
*/

// eslint-disable-next-line
import AppStyles from '../css/app.css';

import App from './app';
import config from '../config/config.js';
import locales from '../config/locales.js';

let Vue;

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  Vue.use(Framework7Vue);

  // return options
  return cb({
    meta: {
      provider: 'framework7',
    },
    store: null,
    axios,
    config,
    locales,
    options: {
      // Init Framework7 by passing parameters here
      framework7: {
        /* Uncomment to enable Material theme: */
        // material: true,
        routes: [],
        pushState: true,
        pushStateSeparator: '#',
      },
      // Register App Component
      components: {
        app: App,
      },
    },
  });
}

// export
export default {
  install,
};
