import Vue from 'vue';
import mock from './mock.vue';

export default Vue.prototype.$meta.provider === 'framework7' ? {} : {
  'f7-page': mock,
  'f7-navbar': mock,
  'f7-block': mock,
};
