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
      // const node = this.refTree.find(null, item => {
      //   return item.data.atomId === atomId;
      // });
      // const nodeParent = node.parent;
      // const items = nodeParent.children.map(node => {
      //   return node.data;
      // });
      // const index = items.findIndex(item => item.atomId === atomId);
      // return { items, index };
    },
    spliceItem(/* bundle*/) {
      //
    },
    replaceItem(bundle, itemNew) {
      const node = this.refTree.find(null, item => {
        return item.data.atomId === itemNew.atomId;
      });
      if (!node) return;
      const itemOld = node.data;
      if (itemOld.sorting !== itemNew.sorting) {
        // reload parent
        this._reloadNode(this._getNodeParent(node));
      } else {
        // change current
        node.data = itemNew;
      }
    },
    _reloadNode(node) {
      if (!node) return;
      this.refTree.reloadNode(node);
    },
    _getNodeParent(node) {
      return this.refTree.find(null, _node => _node.id === node.data.roleIdParent);
    },
  },
};
