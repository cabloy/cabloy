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
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
      articleUrl: null,
    };
  },
  created() {
    this._getArticleUrl();
    // this._unwatch = this.$watch('layoutManager.base.item', () => {
    //   this._getArticleUrl();
    // });
  },
  beforeDestroy() {
    // if (this._unwatch) {
    //   this._unwatch();
    //   this._unwatch = null;
    // }
  },
  methods: {
    onSize(size) {
      this.$$(this.$refs.iframe).css({
        height: `${size.height}px`,
        width: `${size.width}px`,
      });
    },
    async _getArticleUrl() {
      if (this.blockConfig.iframe === false || this.layoutManager.container.mode === 'edit') {
        this.articleUrl = '';
        return;
      }
      try {
        const data = await this.$api.post('render/getArticleUrl', {
          key: {
            atomId: this.layoutManager.container.atomId,
          },
          options: {
            returnWaitingPath: true,
          },
        });
        this.articleUrl = (data && data.url) || '';
        // const url = data && data.url;
        // if (!url) {
        //   this.articleUrl = '';
        // } else {
        //   this.articleUrl = this.$meta.util.combineQueries(url, {
        //     __cms_iframe_random: new Date().getTime(),
        //   });
        // }
      } catch (err) {
        this.articleUrl = '';
      }
    },
    _renderIFrame() {
      const subnavbar = this.layoutManager.subnavbar.enable;

      return (
        <eb-box onSize={this.onSize} header subnavbar={subnavbar} class="eb-box-iframe">
          <iframe ref="iframe" src={this.articleUrl} seamless={true}></iframe>
        </eb-box>
      );
    },
  },
  render() {
    if (this.articleUrl === null) return null;
    if (this.articleUrl === '') return this.layoutManager.validate_render();
    return this._renderIFrame();
  },
};
