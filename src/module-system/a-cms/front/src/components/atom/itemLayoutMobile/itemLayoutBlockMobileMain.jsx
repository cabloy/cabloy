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
      moduleMarkdownEditor: null,
      moduleMarkdownRender: null,
      articleUrl: null,
    };
  },
  watch: {
    blockConfig() {
      this.loadResources();
    },
  },
  computed: {
    containerMode() {
      return this.layoutManager.container.mode;
    },
    enableIframe() {
      return !!this.blockConfig.iframe;
    },
    enableInfo() {
      return !!this.blockConfig.info;
    },
    enableMarkdown() {
      return !!this.blockConfig.markdown;
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
    this.loadResources();
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
    loadResources() {
      this._loadModuleMarkdownRender();
      this._getArticleUrl();
    },
    onSize(/* size*/) {},
    async _loadModuleMarkdownRender() {
      if (!this.enableMarkdown) return;
      if (this.containerMode === 'view') {
        if (!this.moduleMarkdownRender) {
          this.moduleMarkdownRender = await this.$meta.module.use('a-markdownrender');
        }
      } else {
        if (!this.moduleMarkdownEditor) {
          this.moduleMarkdownEditor = await this.$meta.module.use('a-markdown');
        }
      }
    },
    async _getArticleUrl() {
      if (!this.enableIframe || this.articleUrl) return;
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
    onInput(value) {
      this.content = value;
      this.page_setDirty(true);
    },
    onSaveEditor() {
      if (this.$refs.actionSave) {
        this.$refs.actionSave.onClick();
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
    _renderMarkdownRender() {
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
    _renderMarkdownEditor() {
      if (!this.moduleMarkdownEditor) return <div></div>;
      const subnavbar = this.layoutManager.subnavbar.enable;
      const item = this.markdownHost.atom;
      return (
        <eb-box onSize={this.onSize} header subnavbar={subnavbar} class="eb-box-iframe">
          <eb-markdown-editor ref="markdownEditor" host={this.markdownHost} value={item.content} onInput={this.onInput} onSave={this.onSaveEditor} />
        </eb-box>
      );
    },
  },
  render() {
    if (this.enableIframe) {
      return this._renderIFrame();
    }
    if (this.enableMarkdown) {
      if (this.containerMode === 'view') {
        return this._renderMarkdownRender();
      }
      return this._renderMarkdownEditor();
    }
    // others
    return this.layoutManager.validate_render();
  },
};
