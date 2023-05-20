import Vue from 'vue';
import * as g6 from '@antv/g6';

export default {
  state() {
    return {};
  },
  actions: {
    getInstance() {
      return Vue.exports.shallowReactive(g6);
    },
  },
};
