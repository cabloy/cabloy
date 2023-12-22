import Vue from 'vue';
import * as g6 from '@antv/g6';

export default {
  state() {
    return {
      g6: null,
    };
  },
  actions: {
    getInstance() {
      if (!this.g6) {
        this.g6 = Vue.exports.markRaw(g6);
      }
      return this.g6;
    },
  },
};
