import modulesRepo from './__runtime/modules.js';

import './assets/css/app.less';

import locales from './locales.js';

let Vue;

// eslint-disable-next-line
const bootstrap = require(`${process.env.FRONTPATH}/src/bootstrap.js`);

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // config
  const config = require('./config/config.default.js').default;
  if (process.env.SCENE) {
    const configScene = require(`./config/config.${process.env.SCENE}.js`).default;
    Vue.prototype.$meta.util.extend(config, configScene);
  }
  config.base.name = process.env.NAME;
  config.base.title = process.env.TITLE;

  // monkey
  const monkey = require('./config/monkey.js').default(Vue);

  // options
  return cb({
    modulesRepo,
    config,
    locales,
    monkey,
    parameters: {
      framework7: {
        name: config.base.name,
      },
    },
  });
}

// export
export default {
  install,
};
