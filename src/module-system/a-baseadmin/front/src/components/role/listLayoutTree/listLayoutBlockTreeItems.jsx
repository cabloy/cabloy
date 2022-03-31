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
    return {
      root: {
        attrs: {
          itemToggle: false,
          selectable: true,
        },
      },
    };
  },
  computed: {
    maxLevelAutoOpened() {
      let maxLevelAutoOpened = this.layoutManager.container.maxLevelAutoOpened;
      if (maxLevelAutoOpened === undefined) maxLevelAutoOpened = 2;
      return maxLevelAutoOpened;
    },
    roleIdStart() {
      return this.layoutManager.container.roleIdStart || 0;
    },
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    async _loadNodeRoles(node) {
      //
      const levelCurrent = (node.data && node.data.__level) || 0;
      const level = levelCurrent + 1;
      //
      let data;
      const roleId = node.root ? this.roleIdStart : node.id;
      if (roleId === 0) {
        data = await this.$api.post('/a/baseadmin/role/childrenTop', { page: { size: 0 } });
      } else {
        data = await this.$api.post('/a/baseadmin/role/children', { roleId, page: { size: 0 } });
      }
      const list = [];
      for (const item of data.list) {
        const node = {
          id: item.id,
          attrs: {
            label: item.atomNameLocale || item.roleName || `[${this.$text('New Role')}]`,
            toggle: item.catalog === 1,
            loadChildren: item.catalog === 1,
            iconF7: item._roleTypeCodeOptions.icon.f7,
          },
          data: {
            ...item,
            __level: level,
          },
        };
        if (item.catalog === 1 && (level <= this.maxLevelAutoOpened || this.maxLevelAutoOpened === -1)) {
          const children = await this.onLoadChildren(node);
          this.$refs.tree.childrenLoaded(node, children);
          node.attrs.loadChildren = false;
          node.attrs.opened = true;
        }
        list.push(node);
      }
      return list;
    },
    async onLoadChildren(node) {
      return await this._loadNodeRoles(node);
    },
    onNodePerformClick(event, context, node) {
      return this.layoutManager.data.adapter.item_onActionView(event, node.data);
    },
    async onNodePerformPopover(event, node) {
      // todo: select first
      const item = node.data;
      const actions = await this.layoutManager.actions_fetchActions(item);
    },
    async onNodeContextmenuOpened(node) {
      const item = node.data;
      await this.layoutManager.actions_fetchActions(item);
    },
    _renderListItemContextMenu(item) {
      return this.layoutManager.data.adapter.item_renderContextMenu(item, 'menu');
    },
    _renderTree() {
      if (!this.layoutManager.base.ready) return;
      return (
        <eb-treeview
          ref="tree"
          root={this.root}
          propsOnLoadChildren={this.onLoadChildren}
          propsOnNodePerform={this.onNodePerformClick}
          onNodeContextmenuOpened={this.onNodeContextmenuOpened}
          {...{
            scopedSlots: {
              'root-end': ({ node }) => {
                return (
                  <div class="treeview-item-root-end">
                    <eb-link
                      iconF7="::more-horiz"
                      propsOnPerform={event => this.onNodePerformPopover(event, node)}
                    ></eb-link>
                    {this._renderListItemContextMenu(node.data)}
                  </div>
                );
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
