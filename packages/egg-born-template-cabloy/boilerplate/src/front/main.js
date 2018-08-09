import 'egg-born-front/src/bootstrap.js';

import './assets/css/app.css';

import config from './config/config.js';
import locales from './config/locales.js';

let Vue;

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // options
  return cb({
    config,
    locales,
    parameters: {
      framework7: {
        name: '{{name}}',
      },
    },
  });
}

// export
export default {
  install,
};
