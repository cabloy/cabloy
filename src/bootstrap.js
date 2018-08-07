import Vue from 'vue';
import Framework7 from '@zhennann/framework7/packages/core/framework7.esm.bundle.js';
import Framework7Vue from '@zhennann/framework7/packages/vue/framework7-vue.esm.bundle.js';

import '@zhennann/framework7/packages/core/css/framework7.md.css';

// use
Framework7.use(Framework7Vue);
// Vue.use(Framework7Vue, Framework7);
Vue.prototype.$Framework7 = Framework7;
