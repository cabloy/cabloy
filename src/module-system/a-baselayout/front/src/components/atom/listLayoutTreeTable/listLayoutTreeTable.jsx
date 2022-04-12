export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layoutConfig: {
      type: Object,
    },
  },
  data() {
    return {
      treeviewData: null,
    };
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.treeviewData = null;
    this.layoutManager.layout_clearInstance(this);
  },
  methods: {
    async init() {
      // subnavbar
      // eslint-disable-next-line
      this.layoutManager.subnavbar.enable = false;
      // eslint-disable-next-line
      this.layoutManager.subnavbar.render = false;
      // treeviewAdapter
      const treeviewAdapter = await this._createTreeviewAdapter();
      // provider switch
      const res = await this.layoutManager.data_providerSwitch({
        providerName: 'tree',
        autoInit: true,
        treeviewAdapter,
        treeviewRoot: {
          attrs: {
            itemToggle: false,
            selectable: true,
          },
        },
      });
      this.treeviewData = res.treeviewData;
      // instance
      await this.layoutManager.layout_setInstance(this);
    },
    async _createTreeviewAdapter() {
      // config component
      const treeviewAdapterConfig = this.layoutConfig.treeviewAdapter;
      if (!treeviewAdapterConfig) throw new Error('treeview adapter not found');
      // performAction
      const action = {
        actionModule: treeviewAdapterConfig.component.module,
        actionComponent: treeviewAdapterConfig.component.name,
        name: 'createTreeviewAdapter',
      };
      const item = {
        layoutManager: this.layoutManager,
        layoutConfig: this.layoutConfig,
        treeviewAdapterConfig,
      };
      return await this.$meta.util.performAction({ ctx: this, action, item });
    },
  },
  render() {
    return <div>{this.layoutManager.layout_renderBlock({ blockName: 'items' })}</div>;
  },
};
