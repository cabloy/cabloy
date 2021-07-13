import Vue from 'vue';
const ebLoadMore = Vue.prototype.$meta.module.get('a-components').options.components.ebLoadMore;

export default {
  data() {
    return {
      inited: false,
      loadMore: null,
    };
  },
  methods: {
    async switch(options) {
      // only inited once
      if (this.inited) return;
      // load more
      const componentOptions = {
        propsData: {
          autoInit: options.autoInit,
        },
      };
      this.loadMore = this.$meta.util.createComponentInstance(ebLoadMore, componentOptions);
      // inited
      this.inited = true;
    },
  },
};
