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
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    _renderPicture() {
      // text
      const text = this.info.text;
      if (!text) return null;
      // size
      const height = this.size && this.size.height;
      const width = this.size && this.size.width;
      // style
      const style = {};
      if (height) style.height = height + 'px';
      if (width) style.width = width + 'px';
      // url
      const url = this.$meta.util.combineImageUrl(text, width, height);
      // dom
      return <img src={url} style={style} />;
    },
  },
  render() {
    const domPicture = this._renderPicture();
    return <div class="eb-antdv-table-cell eb-antdv-table-cell-image">{domPicture}</div>;
  },
};
