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
    // eslint-disable-next-line
    this.layoutManager.layout.instance = this;
    if (this.layoutManager.container.atomClass && this.layoutManager.container.scene !== 'select' && this.layoutManager.container.scene !== 'selecting') {
      // eslint-disable-next-line
      this.layoutManager.subnavbar.enable = true;
    }
    this.layoutManager.data_providerSwitch({
      mode: 'continuous',
      loadMore: {
        autoInit: this.layoutManager.container.scene !== 'search',
      },
    });
  },
  beforeDestroy() {
    // eslint-disable-next-line
    this.layoutManager.layout.instance = null;
  },
  methods: {},
  render() {
    return (
      <div>
        {this.layoutManager.layout_renderBlock({ blockName: 'items' })}
        {this.layoutManager.data_renderLoadMore()}
      </div>
    );
  },
};
