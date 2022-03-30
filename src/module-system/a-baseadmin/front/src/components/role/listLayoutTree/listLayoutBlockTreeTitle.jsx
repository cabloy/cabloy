export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    _renderNormal() {
      return <f7-nav-right></f7-nav-right>;
    },
  },
  render() {
    const domNavRight = this._renderNormal();
    return domNavRight;
  },
};
