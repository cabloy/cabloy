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
      if (this.layoutConfig.options?.subnavbar?.policyDefault) {
        this.layoutManager.subnavbar_policyDefault();
      }
      // provider switch
      const providerOptions = this.layoutConfig.providerOptions || {
        providerName: 'continuous',
      };
      await this.layoutManager.data_providerSwitch(providerOptions);
      // instance
      await this.layoutManager.layout_setInstance(this);
    },
  },
  render() {
    const blockName = this.layoutConfig.blockItems || 'items';
    return (
      <div>
        {this.layoutManager.layout_renderBlock({ blockName })}
        {this.layoutManager.data_renderLoadMore()}
      </div>
    );
  },
};
