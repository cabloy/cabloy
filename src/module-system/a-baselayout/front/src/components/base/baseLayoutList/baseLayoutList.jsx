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
    return {};
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.layoutManager.layout_clearInstance(this);
  },
  methods: {
    async init() {
      // subnavbar
      await this.layoutManager.subnavbar_policyInit();
      // provider
      await this.layoutManager.data_providerInit({
        providerName: 'continuous',
      });
      // instance
      await this.layoutManager.layout_setInstance(this);
    },
  },
  render() {
    const blockName = this.layoutConfig.options?.blockItems || 'items';
    return (
      <div class="eb-atom-list-layout eb-atom-list-layout-list">
        {this.layoutManager.layout_renderBlock({ blockName })}
        {this.layoutManager.data_renderLoadMore()}
      </div>
    );
  },
};
