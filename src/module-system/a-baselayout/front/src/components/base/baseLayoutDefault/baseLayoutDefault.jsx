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
        providerName: 'item',
      };
      await this.layoutManager.data_providerSwitch(providerOptions);
      // instance
      await this.layoutManager.layout_setInstance(this);
    },
  },
  render() {
    let domMainBefore;
    if (this.layoutConfig.blocks.mainBefore) {
      domMainBefore = this.layoutManager.layout_renderBlock({
        blockName: 'mainBefore',
      });
    }
    const domMain = this.layoutManager.layout_renderBlock({
      blockName: 'main',
    });
    let domMainAfter;
    if (this.layoutConfig.blocks.mainAfter) {
      domMainAfter = this.layoutManager.layout_renderBlock({
        blockName: 'mainAfter',
      });
    }
    return (
      <div class="eb-atom-item-layout eb-atom-item-layout-default">
        {domMainBefore}
        {domMain}
        {domMainAfter}
      </div>
    );
  },
};
