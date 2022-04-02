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
    onPageRefresh(bundle) {
      bundle = bundle || {};
      const item = bundle.item;
      const roleIdParent = item ? item.roleIdParent : 0;
      const nodeParent = this._getNodeParent(roleIdParent);
      this._reloadNode(nodeParent);
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
      const node = this._findNodeByAtomId(atomId);
      const item = node ? node.data : null;
      return { item };
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
        this._reloadNode(this._getNodeParent(itemOld.roleIdParent));
      } else {
        // change current
        node.data = itemNew;
      }
    },
    _reloadNode(node) {
      if (!node) return;
      this.refTree.reloadNode(node);
    },
    _findNodeByAtomId(atomId) {
      if (!atomId) return null;
      return this.refTree.find(null, item => {
        return item.data.atomId === atomId;
      });
    },
    _getNodeParent(roleIdParent) {
      if (!roleIdParent) return this.refTree.treeviewRoot;
      return this.refTree.find(null, node => node.id === roleIdParent);
    },
  },
};
