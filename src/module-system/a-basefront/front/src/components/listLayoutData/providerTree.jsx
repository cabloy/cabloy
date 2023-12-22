import Vue from 'vue';
const ebTreeviewData = Vue.prototype.$meta.module.get('a-components').options.components.ebTreeviewData;

export default {
  props: {
    layoutManager: {
      type: Object,
    },
    providerConfig: {
      type: Object,
    },
  },
  data() {
    return {
      inited: false,
      treeviewData: null,
    };
  },
  computed: {
    itemKey() {
      return this.layoutManager.data.provider.itemKey;
    },
  },
  beforeDestroy() {
    if (this.treeviewData) {
      this.treeviewData.$destroy();
      this.treeviewData = null;
      this.treeviewRoot = null;
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
      // treeviewRoot
      this.treeviewRoot = this.providerConfig.treeviewRoot;
      // maxLevelAutoOpened
      const maxLevelAutoOpened = this.layoutManager.container.maxLevelAutoOpened;
      if (maxLevelAutoOpened !== undefined) {
        this.treeviewRoot.attrs.maxLevelAutoOpened = maxLevelAutoOpened;
      }
      // adapter
      const treeviewAdapter = await this._createTreeviewAdapter();
      this.treeviewData.setAdapter(treeviewAdapter);
      // autoInit
      if (options.autoInit) {
        await this.treeviewData.load(this.treeviewRoot);
      }
    },
    async _createTreeviewAdapter() {
      // config component
      const dataSourceAdapterConfig = this.providerConfig.dataSourceAdapter;
      if (!dataSourceAdapterConfig) throw new Error('treeview adapter not found');
      // performAction
      const action = {
        actionModule: dataSourceAdapterConfig.component.module,
        actionComponent: dataSourceAdapterConfig.component.name,
        name: 'createTreeviewAdapter',
      };
      const item = {
        layoutManager: this.layoutManager,
        providerConfig: this.providerConfig,
        dataSourceAdapterConfig,
      };
      return await this.$meta.util.performAction({ ctx: this, action, item });
    },
    onPageRefresh() {
      return this.treeviewData.load(this.treeviewRoot);
    },
    onPageInfinite() {
      // do nothing
    },
    onPageClear() {
      // callback
      if (this.layoutManager.data_provider_onItemsClear) {
        this.layoutManager.data_provider_onItemsClear();
      }
    },
    getTreeviewData() {
      return this.treeviewData;
    },
    getItems() {
      return this._getItems(this.treeviewData.treeviewRoot);
    },
    _getItems(nodeParent) {
      if (!nodeParent.attrs.loadChildren) return null;
      const items = [];
      // children
      for (const node of nodeParent.children) {
        // current first
        const _treeviewNode = Object.assign({}, node, { parent: undefined, children: undefined, data: undefined });
        const item = {
          ...node.data,
          _treeviewNode,
        };
        // children
        const children = this._getItems(node);
        if (children) {
          item.children = children;
        }
        // push
        items.push(item);
      }
      return items;
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
      const node = this._findNodeByKey(key);
      const item = node ? node.data : null;
      return { item };
      // const node = this.treeviewData.find(null, item => {
      //   return item.data[this.itemKey] === key;
      // });
      // const nodeParent = node.parent;
      // const items = nodeParent.children.map(node => {
      //   return node.data;
      // });
      // const index = items.findIndex(item => item[this.itemKey] === key);
      // return { items, index };
    },
    spliceItem(bundle) {
      const item = bundle.item;
      const node = this._findNodeByKey(item[this.itemKey]);
      const nodeParent = node.parent;
      if (node) {
        this.treeviewData.removeNode(node);
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
      const node = this.treeviewData.find(null, item => {
        return item.data[this.itemKey] === itemNew[this.itemKey];
      });
      if (!node) return;
      const itemOld = node.data;
      if (this._replaceItemSorting(itemOld, itemNew)) {
        // reload parent
        this._reloadNode(node.parent);
      } else {
        // change current
        const nodeNew = { data: itemNew };
        this.treeviewData.replaceNode(node, nodeNew);
      }
    },
    renderLoadMore() {
      return null;
    },
    _replaceItemSorting(itemOld, itemNew) {
      // fieldName
      const fieldName = this.providerConfig.fields && this.providerConfig.fields.sorting;
      if (!fieldName) return false;
      return itemOld[fieldName] !== itemNew[fieldName];
    },
    addChildNode({ /* key,*/ node }) {
      this._addChild(node.parentId);
    },
    moveNode({ key, node }) {
      const bundle = this.findItem(key[this.itemKey]);
      this.spliceItem(bundle);
      this.addChildNode({ key, node });
    },
    _addChild(nodeIdParent) {
      const nodeParent = this._findNodeByNodeId(nodeIdParent);
      this._reloadNode(nodeParent, {
        attrs: {
          toggle: true,
          loadChildren: true,
        },
      });
    },
    _reloadNode(node, nodeNew) {
      if (!node) return;
      this.treeviewData.reloadNode(node, nodeNew);
    },
    _findNodeByKey(key) {
      if (!key) return null;
      return this.treeviewData.find(null, item => item.data[this.itemKey] === key);
    },
    _findNodeByNodeId(nodeId) {
      if (nodeId === undefined) return null;
      return this.treeviewData.find(null, node => node.id === nodeId);
    },
  },
};
