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
      loadMoreComponent: null,
      items: [],
    };
  },
  beforeDestroy() {
    if (this.loadMoreComponent) {
      this.loadMoreComponent.$destroy();
      this.loadMoreComponent = null;
    }
  },
  methods: {
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
      this.loadMoreComponent = this.$meta.util.createComponentInstance(ebLoadMore, componentOptions);
      // inited
      this.inited = true;
    },
    onPageRefresh(force) {
      this.loadMoreComponent.reload(force);
    },
    onPageInfinite() {
      this.loadMoreComponent.loadMore();
    },
    onPageClear() {
      this.loadMoreComponent.clear();
    },
    onLoadClear(done) {
      // eslint-disable-next-line
      this.layoutManager.bulk_clearSelectedAtoms();
      // items
      this.items = [];
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
    getLoading() {
      return false;
    },
    getPageInfo() {
      // do nothing
    },
    gotoPage(/* pageNum*/) {
      // do nothing
    },
    findItem(atomId) {
      const index = this.items.findIndex(item => item.atomId === atomId);
      return { pageNum: 1, items: this.items, index };
    },
    spliceItem(items, index, howmany, ...args) {
      if (howmany === undefined) howmany = 1;
      return items.splice(index, howmany, ...args);
    },
    replaceItem(items, index, atomNew) {
      this.$set(items, index, atomNew);
    },
    renderLoadMore() {
      if (!this.loadMoreComponent) return null;
      return this.loadMoreComponent.renderContent();
    },
  },
};
