import Vue from 'vue';
export default {
  data() {
    return {
      actions: {
        list: null,
        popoverId: Vue.prototype.$meta.util.nextId('popover'),
      },
    };
  },
};
