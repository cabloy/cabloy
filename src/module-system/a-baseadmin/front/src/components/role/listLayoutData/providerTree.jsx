import Vue from 'vue';
const ebTreeviewData = Vue.prototype.$meta.module.get('a-components').options.components.ebTreeviewData;

export default {
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {
      inited: false,
      treeviewData: null,
    };
  },
  beforeDestroy() {
    if (this.treeviewData) {
      this.treeviewData.$destroy();
      this.treeviewData = null;
    }
  },
  methods: {
    async switch(options) {
      // only inited once
      if (this.inited) {
        return { treeviewData: this.treeviewData };
      }
      // start
      await this._start(options);
      // inited
      this.inited = true;
      // ok
      return { treeviewData: this.treeviewData };
    },
    async _start(options) {
      // treeviewData
      const componentOptions = {
        propsData: {},
      };
      this.treeviewData = this.$meta.util.createComponentInstance(ebTreeviewData, componentOptions);
      // adapter
      this.treeviewData.setAdapter(options.treeviewAdapter);
      // autoInit
      if (options.autoInit) {
        await this.treeviewData.load(options.treeviewRoot);
      }
    },
    onPageRefresh() {
      // do nothing
      this.refTree.reload();
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
    spliceItem(bundle) {
      const item = bundle.item;
      const node = this._findNodeByAtomId(item.atomId);
      const nodeParent = node.parent;
      if (node) {
        this.refTree.removeNode(node);
      }
      // adjust parent's catalog->false if no children
      if (nodeParent.children.length === 0) {
        this._reloadNode(nodeParent, {
          attrs: {
            toggle: false,
            loadChildren: false,
          },
        });
      }
    },
    replaceItem(bundle, itemNew) {
      const node = this.refTree.find(null, item => {
        return item.data.atomId === itemNew.atomId;
      });
      if (!node) return;
      const itemOld = node.data;
      if (itemOld.sorting !== itemNew.sorting) {
        // reload parent
        this._reloadNode(this._findNodeByRoleId(itemOld.roleIdParent));
      } else {
        // change current
        node.data = itemNew;
      }
    },
    onActionExt({ /* key,*/ action, atom }) {
      if (action.name === 'addChild') {
        this._addChild(atom.roleIdParent);
      } else if (action.name === 'move') {
        this.spliceItem({ item: atom });
        this._addChild(atom.roleIdParent);
      }
    },
    _addChild(roleIdParent) {
      const nodeParent = this._findNodeByRoleId(roleIdParent);
      this._reloadNode(nodeParent, {
        attrs: {
          toggle: true,
          loadChildren: true,
        },
      });
    },
    _reloadNode(node, nodeNew) {
      if (!node) return;
      this.refTree.reloadNode(node, nodeNew);
    },
    _findNodeByAtomId(atomId) {
      if (!atomId) return null;
      return this.refTree.find(null, item => item.data.atomId === atomId);
    },
    _findNodeByRoleId(roleId) {
      if (!roleId) return null;
      return this.refTree.find(null, node => node.id === roleId);
    },
  },
};
