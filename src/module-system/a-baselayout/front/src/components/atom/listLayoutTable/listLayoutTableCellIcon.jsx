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
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    _renderMedia() {
      const text = this.info.text;
      if (!text) return null;
      return <f7-icon f7={text} size="16"></f7-icon>;
    },
  },
  render() {
    // avatar
    const domMedia = this._renderMedia();
    return <div>{domMedia}</div>;
  },
};
