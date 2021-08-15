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
    // eslint-disable-next-line
    this.layoutManager.layout.instance = null;
  },
  methods: {
    init() {
      // eslint-disable-next-line
      this.layoutManager.layout.instance = this;
    },
  },
  render() {
    return <div>{this.layoutManager.layout_renderBlock({ blockName: 'main' })}</div>;
  },
};
