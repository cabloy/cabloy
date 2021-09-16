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
    init() {
      // subnavbar
      this.layoutManager.subnavbar_policyDefault();
      // eslint-disable-next-line
      this.layoutManager.layout.instance = this;
    },
  },
  render() {
    return <div>{this.layoutManager.layout_renderBlock({ blockName: 'main' })}</div>;
  },
};
