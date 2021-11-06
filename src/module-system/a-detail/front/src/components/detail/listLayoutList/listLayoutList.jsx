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
      // provider switch
      await this.layoutManager.data_providerSwitch({
        providerName: 'all',
        autoInit: true,
      });
      // instance
      this.layoutManager.layout_setInstance(this);
    },
  },
  render() {
    return (
      <div>
        {this.layoutManager.layout_renderBlock({ blockName: 'title' })}
        {this.layoutManager.layout_renderBlock({ blockName: 'items' })}
      </div>
    );
  },
};
