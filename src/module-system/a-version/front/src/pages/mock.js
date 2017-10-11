/*
* @Author: zhennann
* @Date:   2017-10-11 16:25:16
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-11 16:25:43
*/

import Vue from 'vue';
import mock from './mock.vue';

export default Vue.prototype.$meta.provider === 'framework7' ? {} : {
  'f7-page': mock,
  'f7-navbar': mock,
  'f7-block': mock,
};
