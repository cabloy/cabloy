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
      moduleMarkdownRender: null,
      articleUrl: null,
    };
  },
  computed: {
    containerMode() {
      return this.layoutManager.container.mode;
    },
    enableIframe() {
      return this.containerMode === 'view' && this.blockConfig.iframe;
    },
    enableMarkdown() {
      return this.containerMode === 'view' && !this.enableIframe && this.blockConfig.markdown !== false;
    },
    markdownHost() {
      const atom = this.layoutManager.base.item;
      return {
        atomId: atom.atomId,
        atom,
      };
    },
  },
  created() {
    this._loadModuleMarkdownRender();
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
    async _loadModuleMarkdownRender() {
      if (!this.enableMarkdown) return;
      this.moduleMarkdownRender = await this.$meta.module.use('a-markdownrender');
    },
    async _getArticleUrl() {
      if (!this.enableIframe) return;
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
      if (!this.articleUrl) return <div></div>;
      const subnavbar = this.layoutManager.subnavbar.enable;
      return (
        <eb-box onSize={this.onSize} header subnavbar={subnavbar} class="eb-box-iframe">
          <iframe ref="iframe" src={this.articleUrl} seamless={true}></iframe>
        </eb-box>
      );
    },
    _renderMarkdown() {
      if (!this.moduleMarkdownRender) return <div></div>;
      const item = this.markdownHost.atom;
      return (
        <f7-card class="cms-article-markdown">
          <f7-card-content padding>
            <eb-markdown-render host={this.markdownHost} html={item.html}></eb-markdown-render>
          </f7-card-content>
        </f7-card>
      );
    },
  },
  render() {
    if (this.enableIframe) {
      return this._renderIFrame();
    }
    if (this.enableMarkdown) {
      return this._renderMarkdown();
    }
    // others
    return this.layoutManager.validate_render();
  },
};
