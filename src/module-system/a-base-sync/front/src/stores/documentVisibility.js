import Vue from 'vue';

export default {
  state() {
    return {
      visibilityState: document.visibilityState === 'visible',
    };
  },
  actions: {},
};
