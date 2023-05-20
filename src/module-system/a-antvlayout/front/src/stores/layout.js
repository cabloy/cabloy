import Vue from 'vue';
import * as layout from '@antv/layout';

export default {
  state() {
    return {};
  },
  actions: {
    getInstance() {
      return Vue.exports.shallowReactive(layout);
    },
  },
};
