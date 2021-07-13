import Vue from 'vue';
const ebLoadMore = Vue.prototype.$meta.module.get('a-components').options.components.ebLoadMore;

export default {
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {
      inited: false,
      loadMore: null,
      items: [],
    };
  },
  methods: {
    onPageRefresh(force) {
      this.loadMore.reload(force);
    },
    onPageInfinite() {
      this.loadMore.loadMore();
    },
    onPageClear() {
      this.loadMore.clear();
    },
    onLoadClear(done) {
      this.items = [];
      // eslint-disable-next-line
      this.layoutManager.bulk.selectedAtoms = [];
      done();
    },
    async onLoadMore({ index }) {
      // params
      const params = this.layoutManager.base_prepareSelectParams();
      // index
      params.options.page = { index };
      // fetch
      const res = await this.$api.post('/a/base/atom/select', params);
      this.items = this.items.concat(res.list);
      return res;
    },
    getItems() {
      return this.items;
    },
    async switch(options) {
      // only inited once
      if (this.inited) return;
      // load more
      const componentOptions = {
        propsData: {
          onLoadClear: this.onLoadClear,
          onLoadMore: this.onLoadMore,
          autoInit: options.autoInit,
        },
      };
      this.loadMore = this.$meta.util.createComponentInstance(ebLoadMore, componentOptions);
      // inited
      this.inited = true;
    },
  },
};
