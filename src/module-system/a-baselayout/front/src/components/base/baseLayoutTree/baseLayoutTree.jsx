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
      await this.layoutManager.subnavbar_policyInit();
      // provider
      const res = await this.layoutManager.data_providerInit({
        providerName: 'tree',
      });
      this.treeviewData = res.treeviewData;
      // instance
      await this.layoutManager.layout_setInstance(this);
    },
  },
  render() {
    const blockName = this.layoutConfig.options?.blockItems || 'items';
    return (
      <div class="eb-atom-list-layout eb-atom-list-layout-tree">
        {this.layoutManager.layout_renderBlock({ blockName })}
      </div>
    );
  },
};
