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
    init() {
      // instance
      this.layoutManager.layout_setInstance(this);
    },
  },
  render() {
    return <div>{this.layoutManager.layout_renderBlock({ blockName: 'main' })}</div>;
  },
};
