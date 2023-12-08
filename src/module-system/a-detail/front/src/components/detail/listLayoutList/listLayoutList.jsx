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
      // provider
      await this.layoutManager.data_providerInit({
        providerName: 'all',
        autoInit: true,
      });
      // instance
      await this.layoutManager.layout_setInstance(this);
    },
  },
  render() {
    return (
      <div class="detail-list-main-container">
        {this.layoutManager.layout_renderBlock({ blockName: 'title' })}
        {this.layoutManager.layout_renderBlock({ blockName: 'items' })}
      </div>
    );
  },
};
