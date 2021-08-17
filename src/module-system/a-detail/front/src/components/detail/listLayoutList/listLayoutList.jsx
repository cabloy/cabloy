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
    if (this.layoutManager.layout.instance === this) {
      // eslint-disable-next-line
      this.layoutManager.layout.instance = null;
    }
  },
  methods: {
    async init() {
      // eslint-disable-next-line
      this.layoutManager.layout.instance = this;
      // provider switch
      await this.layoutManager.data_providerSwitch({
        providerName: 'all',
        autoInit: true,
      });
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
