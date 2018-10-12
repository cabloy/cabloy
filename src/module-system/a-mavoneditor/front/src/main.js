let Vue;

import mavonEditor from '@zhennann/mavon-editor';
import '@zhennann/mavon-editor/dist/css/index.css';

import './assets/css/module.less';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // use
  Vue.use(mavonEditor);

  // style
  Vue.prototype.$meta.module.use(Vue.prototype.$meta.config.markdown.style.module, () => {
    // ready
    return cb({
      routes: require('./routes.js').default,
      store: require('./store.js').default(Vue),
      config: require('./config/config.js').default,
      locales: require('./config/locales.js').default,
      components: require('./components.js').default,
    });
  });

}

// export
export default {
  install,
};
