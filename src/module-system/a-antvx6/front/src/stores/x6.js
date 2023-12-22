import { markRaw } from 'vue';
import * as x6 from '@antv/x6';

export default {
  state() {
    return {
      x6: null,
    };
  },
  actions: {
    getInstance() {
      if (!this.x6) {
        this.x6 = markRaw(x6);
      }
      return this.x6;
    },
  },
};
