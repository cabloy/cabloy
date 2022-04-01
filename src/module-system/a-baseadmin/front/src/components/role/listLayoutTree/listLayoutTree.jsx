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
      // eslint-disable-next-line
      this.layoutManager.subnavbar.enable = false;
      // eslint-disable-next-line
      this.layoutManager.subnavbar.render = false;
      // provider switch
      await this.layoutManager.data_providerSwitch({
        providerName: 'tree',
        autoInit: false,
      });
      // instance
      await this.layoutManager.layout_setInstance(this);
    },
  },
  render() {
    return <div>{this.layoutManager.layout_renderBlock({ blockName: 'items' })}</div>;
  },
};
