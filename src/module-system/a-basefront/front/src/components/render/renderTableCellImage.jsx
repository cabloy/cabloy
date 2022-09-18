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
    target: {
      type: String,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    onClickImage() {
      // target
      const target = this.target === undefined ? '_popup' : this.target;
      // url
      const url = this._getImageUrl(false);
      // photos
      const photos = [
        {
          url,
          // caption: title,
        },
      ];
      // pageContext
      const pageContext = {
        params: {
          title: this.$text('View'),
          photos,
        },
      };
      // navigate
      this.$view.navigate(`/a/photobrowser/photoBrowser?t=${Date.now()}`, {
        target,
        context: pageContext,
      });
    },
    _getImageUrl(fixSize) {
      let url = this.info.text;
      if (!url) return null;
      if (fixSize) {
        const height = this.size && this.size.height;
        const width = this.size && this.size.width;
        url = this.$meta.util.combineImageUrl(url, width, height);
      }
      return url;
    },
    _renderPicture() {
      // url
      const url = this._getImageUrl(true);
      if (!url) return null;
      // size
      const height = this.size && this.size.height;
      const width = this.size && this.size.width;
      // style
      const style = {
        cursor: 'pointer',
      };
      if (height) style.height = height + 'px';
      if (width) style.width = width + 'px';
      // dom
      return <img src={url} style={style} onClick={this.onClickImage} />;
    },
  },
  render() {
    const domPicture = this._renderPicture();
    return <div class="eb-antdv-table-cell eb-antdv-table-cell-image">{domPicture}</div>;
  },
};
