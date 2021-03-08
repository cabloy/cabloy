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
  },
  methods: {
    onSize(size) {
      this.$$(this.$refs.iframe).css({
        height: `${size.height}px`,
        width: `${size.width}px`,
      });
    },
    async _getArticleUrl() {
      if (this.layoutManager.container.mode === 'edit') {
        this.articleUrl = '';
        return;
      }
      try {
        const data = await this.$api.post('render/getArticleUrl', {
          key: { atomId: this.layoutManager.container.atomId },
        });
        this.articleUrl = data.url;
      } catch (err) {
        this.articleUrl = '';
      }
    },
    _renderIFrame() {
      return (
        <eb-box onSize={this.onSize} header subnavbar class="eb-iframe-box">
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
