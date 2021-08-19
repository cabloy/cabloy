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
  },
  beforeDestroy() {
    if (this.layoutManager.layout.instance === this) {
      // eslint-disable-next-line
      this.layoutManager.layout.instance = null;
    }
  },
  methods: {},
  render() {
    return <div>{this.layoutManager.layout_renderBlock({ blockName: 'items' })}</div>;
  },
};
