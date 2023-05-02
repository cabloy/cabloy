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
      // instance
      await this.layoutManager.layout_setInstance(this);
    },
  },
  render() {
    const blockName = this.layoutConfig.blockMain || 'main';
    return <div>{this.layoutManager.layout_renderBlock({ blockName })}</div>;
  },
};
