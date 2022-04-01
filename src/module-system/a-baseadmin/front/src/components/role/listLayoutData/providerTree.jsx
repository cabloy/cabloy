export default {
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {
      inited: false,
      refTree: null,
    };
  },
  beforeDestroy() {
    this.refTree = null;
  },
  methods: {
    async switch(options) {
      // only inited once
      if (this.inited) return;
      // inited
      this.inited = true;
    },
    onPageRefresh() {
      this.onPageClear();
    },
    onPageInfinite() {
      // do nothing
    },
    onPageClear() {},
    setTreeInstance(refTree) {
      this.refTree = refTree;
    },
    getItems() {
      // return this.items;
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
      const node = this.refTree.find(null, item => {
        return item.data.atomId === atomId;
      });
      return { item: node.data };
    },
    // spliceItem(items, index, howmany, ...args) {
    //   if (howmany === undefined) howmany = 1;
    //   return items.splice(index, howmany, ...args);
    // },
  },
};
