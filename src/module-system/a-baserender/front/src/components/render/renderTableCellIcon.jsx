export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    layoutItems: {
      type: Object,
    },
    info: {
      type: Object,
    },
    size: {
      type: Number,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    _renderMedia() {
      const text = this.info.text;
      if (!text) return null;
      return <f7-icon f7={text} size={this.size}></f7-icon>;
    },
  },
  render() {
    // avatar
    const domMedia = this._renderMedia();
    return <div>{domMedia}</div>;
  },
};
