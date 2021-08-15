export default {
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {
      inited: false,
      items: [],
    };
  },
  beforeDestroy() {},
  methods: {
    async switch(options) {
      // only inited once
      if (this.inited) return;
      // load details
      await this.loadDetails();
      // inited
      this.inited = true;
    },
    onPageRefresh(force) {},
    onPageInfinite() {},
    onPageClear() {
      // items
      this.items = [];
    },
    async loadDetails() {
      // params
      const params = this.layoutManager.base_prepareSelectParams();
      // fetch
      const res = await this.$api.post('/a/detail/detail/select', params);
      this.items = res.list;
      return res;
    },
    getItems() {
      return this.items;
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
    spliceItem(items, index) {
      items.splice(index, 1);
    },
  },
};
