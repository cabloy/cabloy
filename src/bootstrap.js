import Vue from 'vue';

import 'framework7-icons';
import './assets/css/iconfont/material-icons.css';
import './assets/css/app.less';

let Framework7;
let Framework7Vue;
if (process.env.NODE_ENV === 'production') {
  Framework7 = require('@zhennann/framework7/packages/core/js/framework7-lite.bundle.min.js');
  Framework7Vue = require('@zhennann/framework7/packages/vue/framework7-vue.bundle.min.js');
  // eslint-disable-next-line
  const Framework7Style = require('@zhennann/framework7/packages/core/css/framework7.bundle.min.css');
} else {
  Framework7 = require('@zhennann/framework7/packages/core/framework7-lite.esm.bundle.js').default;
  Framework7Vue = require('@zhennann/framework7/packages/vue/framework7-vue.esm.bundle.js').default;
  // eslint-disable-next-line
  const Framework7Style = require('@zhennann/framework7/packages/core/framework7.bundle.less');
}

// use
Framework7.use(Framework7Vue);
// Vue.use(Framework7Vue, Framework7);
Vue.prototype.$Framework7 = Framework7;
