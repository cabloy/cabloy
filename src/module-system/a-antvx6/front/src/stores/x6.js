import Vue from 'vue';
import * as x6 from '@antv/x6';

export default {
  state() {
    return {};
  },
  actions: {
    getInstance() {
      return Vue.exports.shallowReactive(x6);
    },
  },
};
