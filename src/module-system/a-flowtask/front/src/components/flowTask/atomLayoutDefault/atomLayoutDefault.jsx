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
    // instance
    this.layoutManager.layout_setInstance(this);
  },
  beforeDestroy() {
    this.layoutManager.layout_clearInstance(this);
  },
  methods: {},
  render() {
    return <div>{this.layoutManager.layout_renderBlock({ blockName: 'main' })}</div>;
  },
};
