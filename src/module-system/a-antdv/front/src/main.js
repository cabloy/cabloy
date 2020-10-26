let Vue;

// import Antdv from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
import ConfigProvider from 'ant-design-vue/lib/config-provider';
import Table from 'ant-design-vue/lib/table';
import Pagination from 'ant-design-vue/lib/pagination';

import './assets/css/module.less';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  Vue.use(ConfigProvider);
  Vue.use(Table);
  Vue.use(Pagination);

  return cb({
    routes: require('./routes.js').default,
    store: require('./store.js').default(Vue),
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
    components: require('./components.js').default,
  });
}

// export
export default {
  install,
};
