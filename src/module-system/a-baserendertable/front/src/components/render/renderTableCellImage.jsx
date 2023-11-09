import Vue from 'vue';
const ebRenderTableCellBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellBase;

export default {
  mixins: [ebRenderTableCellBase],
  data() {
    return {};
  },
  computed: {
    size() {
      return this.base_getParam({ name: 'size' });
    },
    target() {
      return this.base_getParam({ name: 'target' });
    },
    dataSource() {
      return this.layoutManager.data_getItems();
    },
  },
  created() {},
  methods: {
    onClickImage(event) {
      // stopPropagation
      event.stopPropagation();
      // info
      const { index, column } = this.info;
      // target
      const target = this.target === undefined ? '_popup' : this.target;
      // photos
      const photos = this._getPhotos();
      // pageContext
      const pageContext = {
        params: {
          title: this.$text(column.columnConfig.title),
          photos,
          activeIndex: index,
        },
      };
      // navigate
      this.$view.navigate(`/a/photobrowser/photoBrowser?t=${Date.now()}`, {
        target,
        context: pageContext,
      });
    },
    _getPhotos() {
      const photos = [];
      for (const item of this.dataSource) {
        photos.push({
          url: this._getImageUrl(false, item),
          caption: item.atomNameLocale || item.atomName,
        });
      }
      return photos;
    },
    _getImageUrl(fixSize, item) {
      const dataKey = this.base_getDataKey();
      let url = item ? item[dataKey] : this.info.text;
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
      return <img src={url} style={style} onClick={event => this.onClickImage(event)} />;
    },
  },
  render() {
    const domPicture = this._renderPicture();
    return <div class="eb-antdv-table-cell eb-antdv-table-cell-image">{domPicture}</div>;
  },
};
