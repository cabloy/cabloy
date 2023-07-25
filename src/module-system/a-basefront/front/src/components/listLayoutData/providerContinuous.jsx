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
  computed: {
    itemKey() {
      return this.layoutManager.data.provider.itemKey;
    },
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
      return this.loadMoreComponent.reload(force);
    },
    onPageInfinite() {
      this.loadMoreComponent.loadMore();
    },
    onPageClear() {
      this.loadMoreComponent.clear();
    },
    onLoadClear(done) {
      // items
      this.items = [];
      // callback
      if (this.layoutManager.data_provider_onItemsClear) {
        this.layoutManager.data_provider_onItemsClear();
      }
      // done
      done();
    },
    async onLoadMore({ index }) {
      // fetch
      const page = { index };
      const res = await this.layoutManager.data_provider_onLoadItemsPage({ page });
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
    findItem(key) {
      const index = this.items.findIndex(item => item[this.itemKey] === key);
      const item = index === -1 ? null : this.items[index];
      return { pageNum: 1, items: this.items, index, item };
    },
    spliceItem(bundle, howmany, ...args) {
      if (howmany === undefined) howmany = 1;
      return bundle.items.splice(bundle.index, howmany, ...args);
    },
    replaceItem(bundle, itemNew) {
      this.$set(bundle.items, bundle.index, itemNew);
    },
    renderLoadMore() {
      if (!this.loadMoreComponent) return null;
      return this.loadMoreComponent.renderContent();
    },
  },
};
