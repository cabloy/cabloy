export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    onNodePerformClick(event, context, node) {
      return this.layoutManager.item_onActionView(event, node.data);
    },
    async onNodePerformPopover(event, node) {
      const refTree = this.$refs.tree;
      refTree._openNodeContextMenu(node);
    },
    async onNodeContextmenuOpened(node) {
      const item = node.data;
      await this.layoutManager.actions_fetchActions(item);
    },
    _renderListItemContextMenu(item) {
      return this.layoutManager.item_renderContextMenu(item, 'toolbar');
    },
    _renderNodeLabelStart(node) {
      const item = node.data;
      return item.atomNameLocale || item.atomName;
    },
    _renderNodeLabelStar(node) {
      if (!node.data.star) return;
      return <f7-icon color="orange" size="16" f7="::star"></f7-icon>;
    },
    _renderNodeAfter(node) {
      const item = node.data;
      const domAfterMetaFlags = this.layoutManager.item_renderMetaFlags(item);
      const domAfterLabels = this.layoutManager.item_renderLabels(item);
      const domPopover = (
        <eb-link
          iconF7="::more-horiz"
          iconColor="gray"
          propsOnPerform={event => this.onNodePerformPopover(event, node)}
        ></eb-link>
      );
      const domContextMenu = this._renderListItemContextMenu(item);
      return (
        <div class="treeview-item-root-end">
          {domAfterMetaFlags}
          {domAfterLabels}
          {domPopover}
          {domContextMenu}
        </div>
      );
    },
    _renderTree() {
      if (!this.layoutManager.base.ready) return;
      if (!this.layout.treeviewData) return;
      return (
        <eb-treeview
          ref="tree"
          treeviewDataCustom={this.layout.treeviewData}
          propsOnNodePerform={this.onNodePerformClick}
          onNodeContextmenuOpened={this.onNodeContextmenuOpened}
          {...{
            scopedSlots: {
              'label-start': ({ node }) => {
                return this._renderNodeLabelStart(node);
              },
              label: ({ node }) => {
                return this._renderNodeLabelStar(node);
              },
              'root-end': ({ node }) => {
                return this._renderNodeAfter(node);
              },
            },
          }}
        ></eb-treeview>
      );
    },
  },
  render() {
    return (
      <div>
        {this._renderTree()}
        <f7-block></f7-block>
      </div>
    );
  },
};
