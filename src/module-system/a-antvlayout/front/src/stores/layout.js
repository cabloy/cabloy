import { markRaw } from 'vue';
import * as layout from '@antv/layout';

export default {
  state() {
    return {
      layout: null,
    };
  },
  actions: {
    getInstance() {
      if (!this.layout) {
        this.layout = markRaw(layout);
      }
      return this.layout;
    },
  },
};
